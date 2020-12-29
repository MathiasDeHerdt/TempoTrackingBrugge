from bluepy import btle
test_pheri = "d9:aa:73:97:3b:0a"
test_uuid = "e9dab8c2-403d-416e-8029-7ebf83b01681"
txPower = -65.0


def scan_for_devices():
    scanner = btle.Scanner()
    devices = scanner.scan(10)
    for device in devices:
        dev_addr = str(device.addr)
        dev_rssi = str(device.rssi)
        distance = calculateAccuracy(txPower, device.rssi)
        print(("DEV = {}, RSSI = {}").format(dev_addr, dev_rssi))
        print(("Distance = {} m").format(distance))

def calculateAccuracy(txPower, rssi):
    if rssi == 0:
        return -1.0; #if we cannot determine accuracy, return -1.

    ratio = rssi * 1.0 / txPower
    if ratio < 1.0:
        return ratio **10

    else:
        accuracy =  0.89976 * (ratio ** 7.7095) + 0.111;    
        return accuracy

try:
    scan_for_devices()
    print("finish program")
except Exception as e:
  print("An exception occurred") 
  print(e)

