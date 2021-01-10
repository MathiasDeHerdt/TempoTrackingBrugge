import json
from ble_helper import BleHelper

class BleBeacon:
    def __init__(self, json):
        self.address = json['address']
        self.name = json['name']

        self.rssi = json['rssi']
        self.txPower = json['txPower']

        self.major = json['major']
        self.minor = json['minor']
        helper = BleHelper()
        self.distance = helper.distance_from_rssi(self.rssi)

    @property
    def address(self):
        return self.address

    @property
    def name(self):
        return self.name

    @property
    def rssi(self):
        return self.rssi

    @property
    def txPower(self):
        return self.txPower

    @property
    def major(self):
        return self.major

    @property
    def minor(self):
        return self.minor

    @property
    def distance(self):
        return self.distance