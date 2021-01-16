import sys
import math
import time
import json
import threading
from datetime import datetime

from BLE.ble_device_manager import DeviceManager
from BLE.ble_beacon_manager import BeaconManager
from BLE.ble_result_manager import ResultManager

from BLE.rpi_ble_scan_manager import RpiScanManager
from BLE.Helpers.ble_beacon import BleBeacon, BleMeasurement

from Mqtt.mqtt_client import MqttClient

from MathProject import math_race


print("Importing tracking_manager....")

class TrackingManager:
    # INIT
    #=================================================================================================================
    def __init__(self):
        self.mqttClient = None

        self.rpi_scanner = RpiScanManager(10, 1, "device_rpi")
        self.current_rpi_rssi_scan = None
        self.is_rssi_scan_active = False

        self.finish_width = 1.3

        self.beacon_manager = BeaconManager()
        self.dict_manager = {
            "device_rpi" : DeviceManager("device_rpi"),
            "device_esp_1" : DeviceManager("device_esp_1"),
            "device_esp_2" : DeviceManager("device_esp_2")
        }


    def initialize(self):
        print("Setup MQTT...")
        self.mqttClient = MqttClient(self.callback_mqtt)

        print("MQTT subscribe...")
        self.mqttClient.subscribe()

    def stop(self):
        self.stop_scanning()

    # SCAN
    #=================================================================================================================
    def register_beacons_for_game(self):
        print("Scanning for beacons to measure...")
        self.rpi_scanner.scan_initial(self.beacon_manager, self.dict_manager)

    def begin_scanning_for_distance(self):
        self.is_rssi_scan_active = True
        self.execute_menu_command(4)
        self.current_rpi_rssi_scan = threading.Thread(target=self.thread_scan)
        self.current_rpi_rssi_scan.start()

    def thread_scan(self):
        results = self.rpi_scanner.scan_rssi()
        for result in results:
            self.mqttClient.publish_to_pi(result)
        if self.is_rssi_scan_active == True:
            self.current_rpi_rssi_scan = threading.Thread(target=self.thread_scan)
            self.current_rpi_rssi_scan.start()
        else:
            print("Stopping RSSI scan on RPI")

    def start_esp_scan(self):
        self.mqttClient.sendMessage("esp_scan_start")

    def stop_esp_scan(self):
        self.mqttClient.sendMessage("esp_scan_stop")

    def stop_scanning(self):
        self.is_rssi_scan_active = False
        self.stop_esp_scan()

    # REGISTERING
    #=================================================================================================================
    def callback_mqtt(self, msg):
        timestamp = datetime.now()
        jsonObj = json.loads(msg.payload)
        deviceId = jsonObj["deviceId"].strip()

        if deviceId in ["device_rpi", "device_esp_1", "device_esp_2"]:
            measureObj = BleMeasurement(jsonObj)
            measureObj.set_timestamp(timestamp)
            self.dict_manager[deviceId].append_result(measureObj)
        else:
            self.execute_menu_command(5)
            print(f'No corresponding device was found for this MQTT message')


    # COMMANDS
    #=================================================================================================================
    def show_menu_commands(self):
        msg = f'\n\nChoose an option:\n'
        msg += "1. ignore commands\n"
        msg += "2. print dictionnary manager + beacons + measurements\n"
        msg += "3. print distances for grouped scans\n"
        msg += "4. send MQTT to esp to start\n"
        msg += "5. send MQTT to esp to stop\n"
        msg += "9. exit system"
        print(msg)

        keuze = int(input())
        return self.execute_menu_command(keuze)

    def execute_menu_command(self, keuze):
        if keuze == 1:
            pass
        if keuze == 2:
            for key in self.dict_manager:
                print(self.dict_manager[key])
        if keuze == 3:  
                print("finish check")
                rpi_results = (self.dict_manager["device_rpi"]).results
                esp_results = (self.dict_manager["device_esp_2"]).results

                for beacon in self.beacon_manager.beacons:
                    address = str(beacon.address).strip()
                    print(f'Checking distances for {address}')
                    try:
                        rpi_results_beacon = rpi_results[address]
                        esp_results_beacon = esp_results[address]

                        self.getDistanceFinish(rpi_results_beacon, esp_results_beacon, self.finish_width)
                    except:
                        print(f'Failed to get distance for {address}')
                        continue
        if keuze == 4:
            self.start_esp_scan()
        if keuze == 5:
            self.stop_esp_scan()

        if keuze == 9:
            self.stop()
            return keuze
        
        return 0


    # DISTANCE
    #=================================================================================================================
    def getDistanceFinish(self, rpi_results_beacon, esp_results_beacon, width_finish):
        length_rpi_results = len(rpi_results_beacon)
        length_esp_results = len(esp_results_beacon)

        length_list = 0
        if length_esp_results > length_rpi_results:
            length_list = length_rpi_results
        else:
            length_list = length_esp_results

        #print(f'length_list {length_list}')
        for index in range(0, length_list):
            try:
                self.writeDistance(index, width_finish, rpi_results_beacon, esp_results_beacon)
            except:
                print(f'Failed distance check at index {index}')
                continue

    def writeDistance(self, index, width_finish, rpi_results_beacon, esp_results_beacon):
        was_changed = 0
        distance_to_rpi = rpi_results_beacon[index].distance
        distance_to_esp = esp_results_beacon[index].distance

        #correctionArray = math_race.calculate_sides(distance_to_rpi, distance_to_esp, width_finish)
        #was_changed = correctionArray[0]
        #distance_to_rpi = correctionArray[1]
        #distance_to_esp = correctionArray[2]

        angle_opp_esp = math_race.get_triangle_corner_angle(distance_to_esp, distance_to_rpi, width_finish)
        angle_opp_rpi = math_race.get_triangle_corner_angle(distance_to_rpi, width_finish, distance_to_esp)
        angle_opp_finish = math_race.get_triangle_corner_angle(width_finish, distance_to_esp, distance_to_rpi)

        height_from_point_rpi = math_race.get_triangle_height(distance_to_rpi, angle_opp_esp)
        height_from_point_esp = math_race.get_triangle_height(distance_to_esp, angle_opp_rpi)
        #print(f'height_rpi = {height_from_point_rpi}m - height_esp = {height_from_point_esp}m')
        distance_to_finish = (height_from_point_rpi + height_from_point_esp) / 2.0
        debug_msg = f'distance to finish = {distance_to_finish}m'
        if(was_changed != 0):
            debug_msg += f'------Distances did not follow maximum rules'
        print(debug_msg)