
import sys
print(f'System path: {sys.path}')

from Helpers.ble_beacon import BleBeacon, BleMeasurement
from BLE_RPI import rpi_ble_scan
from bluepy import btle

registered_beacons = []

def scan_initial():
    global registered_beacons
    try:
        dev_id = 0
        sock = rpi_ble_scan.getBLESocket(dev_id)
        print("BLE thread started")
    except Exception as e:
        print(f'\n-->ERROR accessing bluetooth device!<---\nErrorMessage:{e}\n\n')
        sys.exit(1)

    rpi_ble_scan.hci_le_set_scan_parameters(sock)
    rpi_ble_scan.hci_enable_le_scan(sock)
    
    returnedList = rpi_ble_scan.parse_events(sock, 10)
    global registered_beacons
    for beacon in returnedList:
            print(str(beacon))
            registered_beacons.append(beacon)

def scan_rssi():
    scan_duration = 1
    scan_results = []
    scanner = btle.Scanner()
    devices = scanner.scan(scan_duration)
    for device in devices:
        jsonObj = {
            'address':str(device.addr), 
            'rssi': int(str(device.rssi)), 
            }

        measureObj = BleMeasurement(jsonObj)
        scan_results.append(measureObj)
    return scan_results

if __name__ == '__main__':
    print("Start program!...\n")
    print("Initializing scan...")
    scan_initial()
    print("Finish initial scan\n")
    while True:
        print("Scanning for rssi----------")
        results = scan_rssi()
        for result in results:
            print(result)
        print("End rssi scan----------\n")
    print("finish program\n")
        

        
