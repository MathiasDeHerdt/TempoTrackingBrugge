
import sys
print(f'System path: {sys.path}')

from ble_device_manager import DeviceManager
from ble_beacon_manager import BeaconManager
from ble_result_manager import ResultManager

from rpi_ble_scan_manager import RpiScanManager
from Helpers.ble_beacon import BleBeacon, BleMeasurement

import json

beacon_manager = BeaconManager()

rpi_deviceId = "device_rpi"
rpi_manager = DeviceManager(rpi_deviceId)

rpi_scanner = RpiScanManager(10, 1, rpi_deviceId)

if __name__ == '__main__':
    print("Start program!...\n")

    print("Initializing scan...")
    rpi_scanner.scan_initial(beacon_manager, rpi_manager)
    print("Finish initial scan\n")

    print("Scanning for rssi----------")
    for index in range(0,20):
        results = rpi_scanner.scan_rssi()
        for result in results:
            resultObj = BleMeasurement(json.loads(result))
            rpi_manager.append_result(resultObj)
    print("End rssi scan----------\n")

    print(rpi_manager)
    print("finish program\n")