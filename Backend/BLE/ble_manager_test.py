
import sys
print(f'System path: {sys.path}')

from Helpers.ble_beacon import BleBeacon, BleMeasurement

from ble_device_manager import DeviceManager
from ble_beacon_manager import BeaconManager
from ble_result_manager import ResultManager

from BLE_RPI import rpi_ble_scan
from bluepy import btle

beacon_manager = BeaconManager()
rpi_manager = None
rpi_deviceId = "device_rpi"

def scan_initial():
    global beacon_manager
    global rpi_manager
    global rpi_deviceId

    try:
        dev_id = 0
        sock = rpi_ble_scan.getBLESocket(dev_id)
        print("BLE thread started")
    except Exception as e:
        print(f'\n-->ERROR accessing bluetooth device!<---\nErrorMessage:{e}\n\n')
        sys.exit(1)

    rpi_ble_scan.hci_le_set_scan_parameters(sock)
    rpi_ble_scan.hci_enable_le_scan(sock)
    
    for i in range(0, 20):
        registered_beacons = rpi_ble_scan.parse_events(sock, 10)
        for registered_beacon in registered_beacons:
            #print(str(registered_beacon))
            beacon = BleBeacon(registered_beacon)
            if beacon_manager.append_beacon(beacon):
                print(str(beacon))

    rpi_manager = DeviceManager(rpi_deviceId, beacon_manager.beacons)

def scan_rssi():
    global rpi_deviceId
    scan_duration = 1
    scan_results = []
    scanner = btle.Scanner()
    devices = scanner.scan(scan_duration)
    for device in devices:
        jsonObj = {
            'deviceId':rpi_deviceId,
            'address':str(device.addr), 
            'name': '',
            'rssi': int(str(device.rssi))
            }

        measureObj = BleMeasurement(jsonObj)
        scan_results.append(measureObj)
    return scan_results

if __name__ == '__main__':
    print("Start program!...\n")

    print("Initializing scan...")
    scan_initial()
    print("Finish initial scan\n")

    print("Scanning for rssi----------")
    for index in range(0,20):
        #print(f'scan {index}...')
        results = scan_rssi()
        for result in results:
            rpi_manager.append_result(result)
    print("End rssi scan----------\n")

    print(rpi_manager)
    print("finish program\n")
        

        