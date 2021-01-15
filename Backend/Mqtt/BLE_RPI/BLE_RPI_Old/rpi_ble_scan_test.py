import rpi_ble_scan
import sys

if __name__ == '__main__':
    
    try:
        dev_id = 0
        sock = rpi_ble_scan.getBLESocket(dev_id)
        print("ble thread started")
    except Exception as e:
        print("error accessing bluetooth device...")
        print(e)
        sys.exit(1)

    rpi_ble_scan.hci_le_set_scan_parameters(sock)
    rpi_ble_scan.hci_enable_le_scan(sock)

    while True:
        returnedList = rpi_ble_scan.parse_events(sock, 10)
        print("----------")
        for beacon in returnedList:
            print(str(beacon))
