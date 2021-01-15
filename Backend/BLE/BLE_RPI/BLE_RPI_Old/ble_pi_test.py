
import sys

from BLE_RPI.ble_pi_bluepy import PiScannerBle

if __name__ == '__main__':
    print(sys.path)
    try:
        print("Start program!...\n")
        pi_scanner = PiScannerBle()
        while True:
            pi_scanner.scan_for_devices()
        print("finish program\n")
    except Exception as e:
        print("An exception occurred") 
        print(e)