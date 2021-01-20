import sys
import math
import time
import json
import threading
from datetime import datetime


from BLE.ble_beacon_manager import BeaconManager
from BLE.player_manager import PlayerManager


from BLE.rpi_ble_scan_manager import RpiScanManager
from BLE.Helpers.ble_beacon import BleBeacon, BleMeasurement

from Mqtt.mqtt_client import MqttClient

from MathProject import math_race

class BleManager:
    # INIT
    #=================================================================================================================
    def __init__(self):
        self.__mqtt_client = None

        self.__beacon_manager = BeaconManager()
        self.__player_manager = {}

        self.__BEACON_UUID_ESP_1 = "6fc88bbe756698da486866a36ec78e05" #unexpected results with ESP
        self.__rpi_scanner = RpiScanManager(5, 1, "device_rpi")
        self.__finish_width = 1.40

        self.__is_loop_scan_active = False

        self.__callback_etappe = self.print_etappe
        self.__callback_finish = self.print_finished


    def initialize(self, etappe_count, finish_width, selected_players, callback_etappe, callback_finish):
        #Setup Ble Manager
        self.__player_manager = {}

        self.__setup_mqtt()
        self.__finish_width = finish_width
        self.__callback_etappe = callback_etappe
        self.__callback_finish = callback_finish
        self.__beacon_manager.filter_saved_beacons(selected_players)

        for beacon in self.__beacon_manager.list_beacons:
            address = str(beacon.address)
            self.__player_manager[address] = PlayerManager(beacon, etappe_count, self.__finish_width, self.__callback_etappe, self.__callback_finish)


    def __setup_mqtt(self):
        #Setup MQTT and subscribe to receive measurement messages
        self.__mqtt_client = MqttClient(self.__callback_mqtt)


    
    # SETUP
    #=================================================================================================================
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


    # LOOP
    #=================================================================================================================
    def start_game_loop(self):
        #Start game
        self.__mqtt_client.subscribe()
        self.start_scanning_player_distance()

    def stop_game_loop(self):
        #Stop game
        self.__mqtt_client.unsubscribe()
        self.stop_scanning_player_distance()
    

    def start_scanning_player_distance(self):
        #Start scanning for disances
        print(f'Start scanning for distances')
        self.__is_loop_scan_active = True
        self.__start_esp_scan()
        self.__create_thread_scanning_player_distance()
    

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
        #Scan for player beacons during game to retrieve distance
        results = self.__rpi_scanner.scan_rssi()
        for result in results:
            #Publish to MQTT to save
            self.__mqtt_client.publish_to_pi(result)


    # DEBUG
    #=================================================================================================================
    def print_registered_results(self):
        for key in self.__player_manager.keys():
            self.__player_manager[key].print_manager()
    

    def print_etappe(self, player_manager):
        print(f'Etappe done - {player_manager}')


    def print_finished(self, player_manager):
        print(f'Finished - {player_manager}')


    # MQTT
    #=================================================================================================================
    def __callback_mqtt(self, msg):
        now = datetime.now()
        jsonObj = json.loads(msg.payload)

        address = str(jsonObj["address"])
        beacon = self.__beacon_manager.get_beacon_by_address(address)
        if beacon == None:
            return

        jsonObj['timestamp'] =str(now.strftime("%Y-%m-%d %H:%M:%S"))
        jsonObj['txPower'] = beacon.txPower

        deviceId = jsonObj["deviceId"].strip()
        if deviceId in ["device_rpi", "device_esp_1"]:
            if address not in self.__player_manager.keys():
                return

            measureObj = BleMeasurement(jsonObj)
            try:  #Add txPower to measurement 
                measureObj.set_tx_power(beacon.txPower)
            except:1

            self.__player_manager[address].append_result(measureObj)
            
        else:
            print(f'No corresponding device was found for this MQTT message => {jsonObj}')


    # ESP CONTROL
    #=================================================================================================================
    def __start_esp_scan(self):   
        self.__mqtt_client.sendMessage("esp_scan_start")

    def __stop_esp_scan(self):
        self.__mqtt_client.sendMessage("esp_scan_stop")



    # CLEAR
    #=================================================================================================================
    def clear_results(self):
        #Clear only results
        for key in self.__player_manager.keys():
            self.__player_manager[key].clear_results()

    def clear(self):
        self.__player_manager = {}
        self.__beacon_manager = BeaconManager()
