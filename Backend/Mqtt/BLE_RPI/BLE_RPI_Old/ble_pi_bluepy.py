from bluepy import btle
import math

from Helpers.ble_helper import BleHelper

deviceId = "device_rpi"

class PiScannerBle:
    def __init__(self):
        self.deviceId = "device_rpi"

    def scan_for_devices(self):
        print("Scanning for devices...")
        scanner = btle.Scanner()
        devices = scanner.scan(1)
        for device in devices:
            self.get_try(device)
        print("End scan...\n\n")


    def get_try(self, device):
        address = device.addr
        rssi = device.rssi
        helper = BleHelper()
        distance = helper.distance_from_rssi(rssi, 4)
        
        print(f'address : {address}, rssi : {rssi}, distance : {distance}')


    def get_details(self, device):
        address = device.addr
        rssi = device.rssi
        txPower = 0
        name = ""
        print("Extract beacon data")
        ibeacon_data = device.getScanData()[3][2][8:50]    
        uuid = ibeacon_data[0:32]
        major = int(ibeacon_data[32:36], 16)
        minor = int(ibeacon_data[36:40], 16)
        #service_data = device.getScanData()[2][2][6:14]

        print("Create MQTT publish message")
        mqttMessage = '{'
        mqttMessage += f'"deviceId":{str(self.deviceId )}, "address":{str(address)},'
        mqttMessage += f'"name":{str(name)}, "rssi":{str(rssi)}, "txPower":{str(txPower)},'
        mqttMessage += f'"major":{str(major)}, "minor":{str(minor)}, "uuid":{str(uuid)},'
        mqttMessage += '}'
        print(f'{mqttMessage}\n')

