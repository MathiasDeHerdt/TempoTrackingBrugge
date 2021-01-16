import json
from .ble_helper import BleHelper

#print("Importing ble_beacon.py....")

class BleMeasurement():
    def __init__(self, jsonObj):
        self.__deviceId = jsonObj['deviceId'].strip()
        self.__address = jsonObj['address'].strip()
        self.__rssi = jsonObj['rssi']
        self.__distance = BleHelper.distance_from_rssi(self.rssi, 4)
        self.__timestamp = None

    def set_timestamp(self, timestamp):
        self.__timestamp = timestamp

    @property
    def timestamp(self):
        return self.__timestamp

    @property
    def address(self):
        return self.__address

    @property
    def rssi(self):
        return self.__rssi

    @property
    def distance(self):
        return self.__distance

    @property
    def deviceId(self):
        return self.__deviceId

    def __str__(self):
        ret = f'BleMeasurement: deviceId:{self.deviceId} - address:{self.address} - rssi:{self.rssi}dB - distance:{self.distance}m'
        return ret


class BleBeacon:
    def __init__(self, jsonObj):
        self.__address = jsonObj['address'].strip()
        self.__uuid = jsonObj['uuid'].strip()
        self.__txPower = jsonObj['txpower']
        self.__major = jsonObj['major']
        self.__minor = jsonObj['minor']

    def __str__(self):
        ret = f'address:{self.address} - uuid:{self.uuid}\nmajor: {self.__major} - minor: {self.__minor} - txPower: {self.__txPower}dB'
        return ret

    @property
    def address(self):
        return self.__address

    @property
    def uuid(self):
        return self.__uuid

    @property
    def txPower(self):
        return self.__txPower

    @property
    def major(self):
        return self.__major

    @property
    def minor(self):
        return self.__minor