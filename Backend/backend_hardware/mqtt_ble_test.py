

import sys
print(f'System path: {sys.path}')
import math
import time
import json
import threading

from BLE.ble_device_manager import DeviceManager
from BLE.ble_beacon_manager import BeaconManager
from BLE.ble_result_manager import ResultManager

from BLE.rpi_ble_scan_manager import RpiScanManager
from BLE.Helpers.ble_beacon import BleBeacon, BleMeasurement

from Mqtt.mqtt_client import MqttClient

from MathProject import math_race

beacon_manager = BeaconManager()
rpi_scanner = RpiScanManager(10, 1, "device_rpi")

dict_manager = {
    "device_rpi" : DeviceManager("device_rpi"),
    "device_esp_1" : DeviceManager("device_esp_1"),
    "device_esp_2" : DeviceManager("device_esp_2")
}

mqttClient = None
   
def menu(keuze):
    global dict_manager
    global mqttClient
    if keuze == 1:
        mqttClient.sendMessage("{\"message\":\"hello world\"}")
    if keuze == 2:
        for key in dict_manager:
            print(dict_manager[key])
            print(f'+++++++++++++++++++++++++++++++')
    if keuze == 3:  
            print("finish check")
            rpi_results = (dict_manager["device_rpi"]).results
            esp_results = (dict_manager["device_esp_2"]).results

            for beacon in beacon_manager.beacons:
                address = str(beacon.address).strip()
                print(f'Checking distances for {address}')
                try:
                    #print(f'rpi_results {rpi_results}')
                    rpi_results_beacon = rpi_results[address]
                    #print(f'rpi_results_beacon {rpi_results_beacon}')

                    #print(f'esp_results {esp_results}')
                    esp_results_beacon = esp_results[address]
                    #print(f'esp_results_beacon {esp_results_beacon}')
                    finish_width = 1.3

                    getDistanceFinish(rpi_results_beacon, esp_results_beacon, finish_width)
                except:
                    print(f'Failed to get distance for {address}')
                    continue

    if keuze == 9:
        sys.exit()


def run():
    keuze = 0
    while keuze != 9:
        print("\n\nChoose an option:")
        print("1. send message")
        print("9. Exit")
        keuze = int(input())
        menu(keuze)


def callback_mqtt(msg):
    global dict_manager
    jsonObj = json.loads(msg.payload)
    deviceId = jsonObj["deviceId"].strip()

    if deviceId in ["device_rpi", "device_esp_1", "device_esp_2"]:
        measureObj = BleMeasurement(jsonObj)
        dict_manager[deviceId].append_result(measureObj)
    else:
        print(f'No corresponding device was found for this MQTT message')

def begin_scan():
    x = threading.Thread(target=thread_scan)
    x.start()

def thread_scan():
    global mqttClient
    results = rpi_scanner.scan_rssi()
    for result in results:
        mqttClient.publish_to_pi(result)
    x = threading.Thread(target=thread_scan)
    x.start()

def getDistanceFinish(rpi_results_beacon, esp_results_beacon, width_finish):
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
            writeDistance(index, width_finish, rpi_results_beacon, esp_results_beacon)
        except:
            print(f'Failed distance check at index {index}')
            continue

def writeDistance(index, width_finish, rpi_results_beacon, esp_results_beacon):
    was_changed = 0
    distance_to_rpi = rpi_results_beacon[index].distance
    #print(f'distance_to_rpi {distance_to_rpi}')
    distance_to_esp = esp_results_beacon[index].distance
    #print(f'distance_to_esp {distance_to_esp}')

    #correctionArray = math_race.calculate_sides(distance_to_rpi, distance_to_esp, width_finish)
    #was_changed = correctionArray[0]
    #distance_to_rpi = correctionArray[1]
    #distance_to_esp = correctionArray[2]

    angle_opp_esp = math_race.get_triangle_corner_angle(distance_to_esp, distance_to_rpi, width_finish)
    angle_opp_rpi = math_race.get_triangle_corner_angle(distance_to_rpi, width_finish, distance_to_esp)
    angle_opp_finish = math_race.get_triangle_corner_angle(width_finish, distance_to_esp, distance_to_rpi)
    #print(f'Angle opposite to esp = {math.degrees(angle_opp_esp)}*')
    #print(f'Angle opposite to rpi = {math.degrees(angle_opp_rpi)}*')
    #print(f'Angle opposite to finish = {math.degrees(angle_opp_finish)}*')

    height_from_point_rpi = math_race.get_triangle_height(distance_to_rpi, angle_opp_esp)
    height_from_point_esp = math_race.get_triangle_height(distance_to_esp, angle_opp_rpi)
    #print(f'height_rpi = {height_from_point_rpi}m - height_esp = {height_from_point_esp}m')
    distance_to_finish = (height_from_point_rpi + height_from_point_esp) / 2.0
    debug_msg = f'distance to finish = {distance_to_finish}m'
    if(was_changed != 0):
        debug_msg += f'------Distances did not follow maximum rules'
    print(debug_msg)

if __name__ == '__main__':
    try:
        print("Start program!...")

        print("Setup MQTT")
        mqttClient = MqttClient(callback_mqtt)

        print("Initializing scan...")
        rpi_scanner.scan_initial(beacon_manager, dict_manager)

        print("MQTT subscribe")
        mqttClient.subscribe()

        print("Scanning RPI thread")
        begin_scan()


        time.sleep(10)
        run()
        print("finish program")
    except Exception as e:
        print("An exception occurred") 
        print(e)