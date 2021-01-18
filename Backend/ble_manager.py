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
        self.__rpi_scanner = RpiScanManager(10, 1, "device_rpi")
        self.__finish_width = 1.2

        self.__is_loop_scan_active = False


    def initialize(self, etappe_count):
        #Setup Ble Manager
        self.__setup_mqtt()
        for beacon in self.__beacon_manager.list_beacons:
            self.__player_manager[str(beacon.address)] = PlayerManager(beacon, etappe_count, self.__finish_width)


    def __setup_mqtt(self):
        #Setup MQTT and subscribe to receive measurement messages
        self.__mqtt_client = MqttClient(self.__callback_mqtt)


    
    # SETUP
    #=================================================================================================================
    def scan_finish_width(self):
        #Calculate with of the finishing line
        self.__finish_width = self.__scan_for_finish_distance()
        print(f'Finish width = {self.__finish_width}')
    

    def __scan_for_finish_distance(self):
        #Calculate average scanned distance to ESP sensor
        self.scan_for_sensors()
        try:
            esp_beacon = self.__beacon_manager.get_beacon_by_uuid(self.__BEACON_UUID_ESP_1)
            list_scans = self.__rpi_scanner.scan_rssi_by_address(esp_beacon.address, 25)
            return self.__calculate_finish_width(esp_beacon.txPower, list_scans)
        except:
            print("No finish wdith could be calculated")
            return self.__finish_width


    def __calculate_finish_width(self, txPower, list_scans):
        #Calculate average scanned distance to ESP sensor
        finish_width = 0
        for scan in list_scans:
            jsonObj = json.loads(scan)
            jsonObj['txPower'] = txPower
            measure = BleMeasurement(jsonObj)
            finish_width += measure.distance
        finish_width = finish_width / len(list_scans)
        return finish_width


    def scan_for_sensors(self):
        list_esp_scans = self.__scan_for_beacon_by_uuid(self.__BEACON_UUID_ESP_1)
        try:
            esp_dev = list_esp_scans[0]
            self.__beacon_manager.append(esp_dev)
            esp_beacon = self.__beacon_manager.get_beacon_by_address(esp_dev.address)
            esp_beacon.setTxPower(-65) #tx from ble is flawed
        except:
            print("No ESP was detected")


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
    
    
    # MQTT
    #=================================================================================================================
    def __callback_mqtt(self, msg):
        now = datetime.now()
        jsonObj = json.loads(msg.payload)
        jsonObj['timestamp'] =str(now.strftime("%Y-%m-%d %H:%M:%S"))

        deviceId = jsonObj["deviceId"].strip()
        address = str(jsonObj["address"])

        if deviceId in ["device_rpi", "device_esp_1"]:
            if address not in self.__player_manager.keys():
                return

            measureObj = BleMeasurement(jsonObj)
            try:  #Add txPower to measurement
                beacon = self.__beacon_manager.get_beacon_by_address(address)
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
    def __clear_results(self):
        #Clear only results
        for key in self.__player_manager.keys():
            self.__player_manager[key].clear_results()

    def clear(self):
        self.__player_manager = {}
        self.__beacon_manager = BeaconManager()
