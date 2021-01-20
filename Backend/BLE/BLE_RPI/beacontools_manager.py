import time
from beacontools import BeaconScanner, IBeaconFilter, IBeaconAdvertisement, EddystoneTLMFrame, EddystoneFilter, EddystoneUIDFrame, BluetoothAddressType

uuid_smartphone = "17105c40-98cc-4564-b7a0-da5f05c87a45"

def callback(bt_addr, rssi, packet, additional_info):
    print("<%s, %d> %s %s" % (bt_addr, rssi, packet, additional_info))


print("scan0")
scanner = BeaconScanner(
    callback,
    scan_parameters={"address_type": BluetoothAddressType.RANDOM}
)
scanner.start()
time.sleep(5)
scanner.stop()

# scan for all iBeacon advertisements from beacons with certain properties:
# - uuid
# - major
# - minor
# at least one must be specified.
print("scan1")
scanner = BeaconScanner(callback, 
    device_filter=IBeaconFilter(uuid=uuid_smartphone)
)
scanner.start()
time.sleep(5)
scanner.stop()
print("scan2")
scanner = BeaconScanner(callback, 
    device_filter=IBeaconFilter(major=2)
)
scanner.start()
time.sleep(5)
scanner.stop()

# scan for all iBeacon advertisements regardless from which beacon
print("scan3")
scanner = BeaconScanner(callback,
    packet_filter=IBeaconAdvertisement
)
scanner.start()
time.sleep(5)
scanner.stop()


# scan for all TLM frames of beacons
print("scan4")
scanner = BeaconScanner(callback, 
    packet_filter=[EddystoneTLMFrame, EddystoneUIDFrame]
)
scanner.start()
time.sleep(5)
scanner.stop()


print("scan5")
scanner = BeaconScanner(
    callback,
    bt_device_id=0
)
scanner.start()
time.sleep(5)
scanner.stop()