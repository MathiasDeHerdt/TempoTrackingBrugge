from bluepy import btle
import math
txPower = -65.0


def scan_for_devices():
    scanner = btle.Scanner()
    devices = scanner.scan(0.5)
    for device in devices:
        dev_addr = str(device.addr)
        dev_rssi = str(device.rssi)
        distance = calculateAccuracy(txPower, device.rssi)
        print(("DEV = {}, RSSI = {}").format(dev_addr, dev_rssi))
        print(("Distance = {} m").format(distance))

def calculateAccuracy(txPower, rssi):
    distance = math.pow(10, ((txPower - rssi) / (10 * 2)))
    return distance

try:
    while True:
        scan_for_devices()
    print("finish program")
except Exception as e:
  print("An exception occurred") 
  print(e)

