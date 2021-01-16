#print("Importing beacon_manager....")

class BeaconManager():
    def __init__(self):
        self.__beacons = [] #BleBeacon

    def print_beacons(self):
        for beacon in self.__beacons:
            print(beacon)

    def append_beacon(self, beacon):
        can_append = True
        for registered_beacon in self.__beacons:
            if beacon.uuid == registered_beacon.uuid and beacon.address == registered_beacon.address:
                can_append = False
                break
        
        if can_append == True:
            self.__beacons.append(beacon)
        return can_append

    def clear(self):
        self.__beacons = []

    @property
    def beacons(self):
        return self.__beacons