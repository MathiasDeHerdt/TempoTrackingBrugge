import bluetooth
import time

class BleManager():
    def scan(self):
        devices = bluetooth.discover_devices(lookup_names = True, lookup_class = True)
        number_of_devices = len(devices)
        print(f'devices {str(devices)}')
        for addr, name, device_class in devices:

            print("\n")

            print("Device:")

            print("Device Name: %s" % (name))

            print("Device MAC Address: %s" % (addr))

            print("Device Class: %s" % (device_class))

            print("\n")

        return


b = BleManager()
time.sleep(5)
b.scan()