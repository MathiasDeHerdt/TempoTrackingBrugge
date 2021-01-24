import sys
import math
import time
import json
import threading
from datetime import datetime


from .BLE.ble_beacon_manager import BeaconManager
from .BLE.player_manager import PlayerManager


from .BLE.rpi_ble_scan_manager import RpiScanManager
from .BLE.Helpers.ble_beacon import BleBeacon, BleMeasurement
from .BLE.Helpers.ble_helper import BleHelper

from .Mqtt.mqtt_client import MqttClient

class BleManager:
    # =========================================================
    #region --- INIT ==========================================================================================================================================
    def __init__(self):
        self.__mqtt_client = None

        self.__beacon_manager = BeaconManager()
        self.__player_manager = {}

        self.__BEACON_UUID_ESP_1 = "6fc88bbe756698da486866a36ec78e05" #unexpected results with ESP
        self.__rpi_scanner = RpiScanManager(5, 1, "device_rpi")
        self.__finish_width = 1.40
        self.__list_device_id_rssi = ["device_esp_1", "device_esp_2"]

        self.__is_loop_scan_active = False

        self.__callback_etappe = self.print_etappe
        self.__callback_finish = self.print_finished


    def initialize(self, etappe_count, finish_width, selected_players, callback_etappe, callback_finish):
        #Setup Ble Manager
        print(f'BleManager - initialize')
        self.__player_manager = {}
        self.__setup_mqtt()
        self.__finish_width = finish_width
        self.__callback_etappe = callback_etappe
        self.__callback_finish = callback_finish
        self.__beacon_manager.filter_saved_beacons(selected_players)

        #Create player managers
        original_beacons = self.__beacon_manager.list_beacons
        print(f'Filter from beaconlist to only register following beacons = {original_beacons}')
        for beacon in original_beacons:
            if beacon == None:
                continue
            address = str(beacon.address)
            self.__player_manager[address] = PlayerManager(beacon, etappe_count, self.__finish_width, self.__callback_etappe, self.__callback_finish)


    def __setup_mqtt(self):
        #Setup MQTT and subscribe to receive measurement messages
        self.__mqtt_client = MqttClient(self.__callback_mqtt)
    #endregion

    
    # =========================================================
    #region --- SETUP GAME ==========================================================================================================================================
    def scan_for_players(self):
        #reset
        self.clear() 

        #Scan for BLE beacons, register them, and return the list
        self.__scan_for_player_beacons()
        player_beacons = self.__beacon_manager.list_beacons
        return player_beacons


    def __scan_for_player_beacons(self):
        #Scan for BLE beacons 
        list_beacons = self.__rpi_scanner.scan_beacon_details_filter()
        
        #Register beacons in the beacon manager -- and -- Create new result lists within each scanning device manager
        for beacon_obj in list_beacons:
            #Update beacon manager
            self.__beacon_manager.append(beacon_obj)


    def __scan_for_beacon_by_uuid(self, uuid):
        #Scan for specific BLE beacons 
        return self.__rpi_scanner.scan_beacon_uuid(uuid)


    def clear_results(self):
        #Clear only results
        for key in self.__player_manager.keys():
            self.__player_manager[key].clear_results()


    def clear(self):
        #Clear everything
        self.__player_manager = {}
        self.__beacon_manager = BeaconManager()
    #endregion


    # =========================================================
    #region --- LOOP GAME ==========================================================================================================================================
    def start_game_loop(self):
        #Start game
        try:
            print('Connecting to MQTT...')
            self.__mqtt_client.subscribe()
            print('Begin scanning for player distance')
            self.start_scanning_player_distance()
        except Exception as e:
            print(f'Exception => {e}')


    def stop_game_loop(self):
        #Stop game
        self.__mqtt_client.unsubscribe()
        self.stop_scanning_player_distance()
    

    def start_scanning_player_distance(self):
        #Start scanning for disances
        print(f'Activate ESP')
        self.__start_esp_scan()
        print(f'Distance thread')
        self.__create_thread_scanning_player_distance()
        self.__is_loop_scan_active = True
    

    def stop_scanning_player_distance(self):
        #Stop scanning for distances
        print(f'Stop scanning for distances')
        self.__is_loop_scan_active = False
        self.__stop_esp_scan()


    def __create_thread_scanning_player_distance(self):
        #Create thread to scan for BLE beacon measurements
        self.__thread_player_scan = threading.Thread(target=self.__thread_scanning_player_distance)
        self.__thread_player_scan.start()


    def __thread_scanning_player_distance(self):
        #Scan for player beacons during game to retrieve distance
        self.__scanning_player_distance()
        
        #Check if loop needs to continue
        if self.__is_loop_scan_active == True:
            self.__create_thread_scanning_player_distance()
        else:
            print("Stopping RSSI scan on RPI")


    def __scanning_player_distance(self):
        return
        #Scan for player beacons during game to retrieve distance
        results = self.__rpi_scanner.scan_rssi()
        for result in results:
            #Publish to MQTT to save
            self.__mqtt_client.publish_to_pi(result)
    #endregion


    # =========================================================
    #region --- DEBUG GAME ==========================================================================================================================================
    def print_registered_results(self):
        for key in self.__player_manager.keys():
            self.__player_manager[key].print_manager()
    

    def print_etappe(self, player_manager):
        print(f'Etappe done - {player_manager}')


    def print_finished(self, player_manager):
        print(f'Finished - {player_manager}')
    #endregion


    # =========================================================
    #region --- MQTT ==========================================================================================================================================
    def __callback_mqtt(self, msg):
        now = datetime.now()
        jsonObj = json.loads(msg.payload)

        address = str(jsonObj["address"])
        beacon = self.__beacon_manager.get_beacon_by_address(address)
        if beacon == None:
            return

        jsonObj['timestamp'] = BleHelper.datetime_to_string(now,"%Y-%m-%d %H:%M:%S")
        jsonObj['txPower'] = beacon.txPower

        deviceId = jsonObj["deviceId"].strip()
        if deviceId in self.__list_device_id_rssi:
            #print(f'address = {address} --- deviceId = {deviceId}')
            if address not in self.__player_manager.keys():
                return

            measureObj = BleMeasurement(jsonObj)
            try:  #Add txPower to measurement 
                measureObj.set_tx_power(beacon.txPower)
                #print(f'Set TX power measurement')
            except:1

            self.__player_manager[address].append_result(measureObj)
            
        else:
            print(f'No corresponding device was found for this MQTT message => {jsonObj}')
    #endregion


    # =========================================================
    #region --- ESP ==========================================================================================================================================
    def __start_esp_scan(self):   
        print(f'Sending ESP32s to start - esp_scan_start')
        self.__mqtt_client.sendMessage("esp_scan_start")

    def __stop_esp_scan(self):
        print(f'Sending ESP32s to stop - esp_scan_stop')
        self.__mqtt_client.sendMessage("esp_scan_stop")
    #endregion

