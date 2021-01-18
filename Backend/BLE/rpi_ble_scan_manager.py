
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
        self.sock = None

    def __initialize_scan(self):
        try:
            dev_id = 0
            self.sock = rpi_ble_scan.getBLESocket(dev_id)
        except Exception as e:
            print(f'\n-->ERROR accessing bluetooth device!<---\nErrorMessage:{e}\n\n')

        rpi_ble_scan.hci_le_set_scan_parameters(self.sock)
        rpi_ble_scan.hci_enable_le_scan(self.sock)


    def __scan_details(self):
        list_beacons_found = []
        self.__initialize_scan() #Needs to happen, otherwise will get stuck
        for i in range(0, self.scan_count_initial):
            registered_beacons = rpi_ble_scan.parse_events(self.sock, 5)
            for registered_beacon in registered_beacons:
                beacon = BleBeacon(registered_beacon)
                list_beacons_found.append(beacon)
        return list_beacons_found

    def __scan_details_filter_major_minor(self, major = 2, minor = 10):
        filter_list = []
        list_beacons_found = self.__scan_details()
        for beacon in list_beacons_found:
            if beacon.major == 2 and beacon.minor == 10:
                filter_list.append(beacon)
        return filter_list

    def __scan_details_by_uuid(self, uuid):
        filter_list = []
        list_beacons_found = self.__scan_details()
        for beacon in list_beacons_found:
            if beacon.uuid == uuid:
                filter_list.append(beacon)
        return filter_list

    def scan_beacon_uuid(self, uuid):
        return self.__scan_details_by_uuid(uuid)

    def scan_beacon_details(self):
        return self.__scan_details()

    def scan_beacon_details_filter(self):
        return self.__scan_details_filter_major_minor()


    def __scan_rssi(self):
        list_beacons = []
        devices = self.scanner_measure.scan(self.scan_duration)
        for device in devices:
            devObj = {
                'deviceId': self.rpi_deviceId,
                'address':str(device.addr), 
                'name': '',
                'rssi': int(str(device.rssi))
                }
            list_beacons.append(devObj)
        return list_beacons


    def scan_rssi(self):
        list_beacons = self.__scan_rssi()
        scan_results = []

        for devObj in list_beacons:
            jsonObj = json.dumps(devObj)
            scan_results.append(jsonObj)
        return scan_results


    def scan_rssi_by_address(self, address, count = 1):
        scan_results = []
        for i in range(0, count):
            list_beacons = self.__scan_rssi()

            for devObj in list_beacons:
                if(devObj["address"] == address):
                    jsonObj = json.dumps(devObj)
                    scan_results.append(jsonObj)
        return scan_results

        

        