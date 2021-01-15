# bluetooth low energy scan
import sys
from bluetooth.ble import DiscoveryService

service = DiscoveryService()

if __name__ == '__main__':
    print(sys.path)
    try:
        print("Start program!...\n")
        while True:
            print("Scan...")
            scan_duration = 1 #int
            devices = service.discover(scan_duration)
            for address, name in devices.items():
                print("name: {}, address: {}".format(name, address))
            print("Scan finished!\n")
        print("finish program\n")
    except Exception as e:
        print("An exception occurred") 
        print(e)
