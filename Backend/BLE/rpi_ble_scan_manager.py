
from .Helpers.ble_beacon import BleBeacon, BleMeasurement
from .BLE_RPI import rpi_ble_scan
from bluepy import btle
import json

class RpiScanManager():
    def __init__(self, scan_count_initial, scan_duration, rpi_deviceId):
        self.scan_count_initial = scan_count_initial 
        self.scan_duration = scan_duration #minimum is 1 sec to avoid infinite loop
        self.scanner_measure = btle.Scanner()
        self.rpi_deviceId = rpi_deviceId

    def scan_initial(self, beacon_manager, dict_manager):
        try:
            dev_id = 0
            sock = rpi_ble_scan.getBLESocket(dev_id)
            print("BLE thread started")
        except Exception as e:
            print(f'\n-->ERROR accessing bluetooth device!<---\nErrorMessage:{e}\n\n')

        rpi_ble_scan.hci_le_set_scan_parameters(sock)
        rpi_ble_scan.hci_enable_le_scan(sock)
        
        for i in range(0, self.scan_count_initial):
            registered_beacons = rpi_ble_scan.parse_events(sock, 10)
            for registered_beacon in registered_beacons:
                #print(str(registered_beacon))
                beacon = BleBeacon(registered_beacon)
                if beacon.major == 2 and beacon.minor == 10:
                    if beacon_manager.append_beacon(beacon):
                        print(str(beacon))

        for key in dict_manager:
            dict_manager[key].append_beacon_list(beacon_manager.beacons)


    def scan_rssi(self):
        scan_results = []
        devices = self.scanner_measure.scan(self.scan_duration)
        for device in devices:
            tempDict = {
                'deviceId': self.rpi_deviceId,
                'address':str(device.addr), 
                'name': '',
                'rssi': int(str(device.rssi))
                }
            jsonObj = json.dumps(tempDict)
            scan_results.append(jsonObj)
        return scan_results


        

        