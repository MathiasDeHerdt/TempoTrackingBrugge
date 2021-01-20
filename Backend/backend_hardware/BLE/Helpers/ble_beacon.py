import json
from .ble_helper import BleHelper

#print("Importing ble_beacon.py....")

class BleMeasurement():
    def __init__(self, jsonObj):
        self.__device_id = jsonObj['deviceId'].strip()
        self.__address = jsonObj['address'].strip()
        self.__rssi = jsonObj['rssi']
        self.__time_stamp = jsonObj['timestamp']
        txPower = jsonObj['txPower']
        self.set_tx_power(txPower)

    def set_tx_power(self, txPower):
        self.__txPower = txPower
        nValue = 3
        self.__distance = BleHelper.distance_from_rssi(self.__rssi, self.__txPower, nValue)

    @property
    def time_stamp(self):
        return self.__time_stamp

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
    def device_id(self):
        return self.__device_id

    def __str__(self):
        ret = f'BleMeasurement: deviceId:{self.device_id} - address:{self.address} - timestamp:{self.__time_stamp} - rssi:{self.rssi}dB - txPower:{self.__txPower}dB - distance:{self.distance}m'
        return ret


class BleBeacon:
    def __init__(self, jsonObj):
        self.__address = jsonObj['address'].strip()
        self.__name = jsonObj['name']
        self.__uuid = jsonObj['uuid'].strip()
        self.__txPower = jsonObj['txPower']
        self.__major = jsonObj['major']
        self.__minor = jsonObj['minor']

    def setTxPower(self, txPower):
        self.__txPower = txPower

    def __str__(self):
        ret = f'address:{self.address} - name:{self.name} - uuid:{self.uuid}\nmajor: {self.__major} - minor: {self.__minor} - txPower: {self.__txPower}dB'
        return ret

    @property
    def address(self):
        return self.__address

    @property
    def name(self):
        return self.__name

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