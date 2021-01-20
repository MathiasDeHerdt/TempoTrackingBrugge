#!/usr/bin/env python3
import sys
from bluepy.btle import Scanner, DefaultDelegate, ScanEntry

class DecodeErrorException(Exception):
     def __init__(self, value):
         self.value = value
     def __str__(self):
         return repr(self.value)

class ScanDelegate(DefaultDelegate):
    def __init__(self):
        DefaultDelegate.__init__(self)

    def handleDiscovery(self, dev, isNewDev, isNewData):
        if isNewDev:
            print(f'Discovered device, {dev.addr}')
        elif isNewData:
            print(f'Received new data from, {dev.addr}')

def printAttempt(device, name, tag):
    print(f'{name}---------------------------------------------------')
    getValueText = dev.getValueText(tag)
    getValue = dev.getValue(tag)
    getDescription = dev.getDescription(tag)
    print(f'getValueText={getValueText}')
    print(f'getValue={getValue}')
    print(f'getDescription={getDescription}')

scanner = Scanner().withDelegate(ScanDelegate())
if __name__ == '__main__':
    print(sys.path)
    try:
        print("Start program!...\n")
        while True:
            print("Scan...")
            scan_duration = 5.0
            devices = scanner.scan(scan_duration)
            for dev in devices:
                address = dev.addr
                addrType = dev.addrType
                rssi = dev.rssi
                iface = dev.iface

                print(f'Device {str(address)} ({str(addrType)}), RSSI={str(rssi)} dB, iface={iface}')
                printAttempt(dev, "uuid", 7)
                printAttempt(dev, "txPower", ScanEntry.TX_POWER)
                printAttempt(dev, "PUBLIC_TARGET_ADDRESS", ScanEntry.PUBLIC_TARGET_ADDRESS)
                printAttempt(dev, "RANDOM_TARGET_ADDRESS", ScanEntry.RANDOM_TARGET_ADDRESS)

                scan_data = dev.getScanData()
                print(f'{str(scan_data)}')
                try:
                    ibeacon_data = scan_data[3][2][8:50]
                    uuid = ibeacon_data[0:32]
                    major = int(ibeacon_data[32:36], 16)
                    minor = int(ibeacon_data[36:40], 16)
                    print(f'uuid:{uuid} , major:{major} , minor:{minor}')
                except Exception as e:
                    print("Failed to get major/minor") 

                for index in range(0, 100):
                    try:
                        printAttempt(dev, "index", index)
                    except Exception as e:
                        print("Fml...............................................") 
                        break
                print("\n\n\n")

            print("Scan finished!\n")
        print("finish program\n")
    except Exception as e:
        print("An exception occurred") 
        print(e)
