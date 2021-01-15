import json
from .ble_helper import BleHelper

print("Importing ble_beacon.py....")

class BleMeasurement():
    def __init__(self, jsonObj):
        self.__address = jsonObj['address']
        self.__rssi = jsonObj['rssi']
        self.__distance = BleHelper.distance_from_rssi(self.rssi, 4)
    
    @property
    def address(self):
        return self.__address

    @property
    def rssi(self):
        return self.__rssi

    @property
    def distance(self):
        return self.__distance

    def __str__(self):
        ret = f'BleMeasurement: address:{self.address} - rssi:{self.rssi}dB - distance:{self.distance}m'
        return ret


class BleBeacon:
    def __init__(self, jsonObj):
        self.__deviceId = jsonObj['deviceId']
        self.__address = jsonObj['address']
        self.__name = jsonObj['name']
        self.__txPower = jsonObj['txPower']
        self.__major = jsonObj['major']
        self.__minor = jsonObj['minor']


    def debug(self):
        print(f'--')
        print(f'deviceId: {self.__deviceId}')
        print(f'address: {self.__address} - name: {self.__name}')
        print(f'major: {self.__major} - minor: {self.__minor} - txPower: {self.__txPower}dB')
        print(f'--')

    @property
    def deviceId(self):
        return self.__deviceId

    @property
    def address(self):
        return self.__address

    @property
    def name(self):
        return self.__name

    @property
    def txPower(self):
        return self.__txPower

    @property
    def major(self):
        return self.__major

    @property
    def minor(self):
        return self.__minor