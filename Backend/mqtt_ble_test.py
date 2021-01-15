

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