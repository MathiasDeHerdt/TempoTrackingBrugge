import json
from .ble_helper import BleHelper

print("Importing ble_beacon.py....")

class BleBeacon:
    def __init__(self, payload):
        #print('BleBeacon created')
        jsonObj = json.loads(payload)
        helper = BleHelper()

        self.__deviceId = jsonObj['deviceId']
        self.__address = jsonObj['address']
        self.__name = jsonObj['name']
        self.__rssi = jsonObj['rssi']
        self.__txPower = jsonObj['txPower']
        self.__major = jsonObj['major']
        self.__minor = jsonObj['minor']
        self.__distance = helper.distance_from_rssi(self.rssi, 4)
        #self.__distance1 = helper.distance_from_rssi(self.rssi, 1)
        #self.__distance2 = helper.distance_from_rssi(self.rssi, 2)
        #self.__distance3 = helper.distance_from_rssi(self.rssi, 3)


    def debug(self):
        print(f'--')
        print(f'deviceId: {self.__deviceId}')
        print(f'address: {self.__address} - name: {self.__name}')
        print(f'rssi: {self.__rssi} - txPower: {self.__txPower}')
        print(f'major: {self.__major} - minor: {self.__minor}')
        print(f'distance: {self.__distance}')
        #print(f'distance2: {self.__distance2}')
        #print(f'distance3: {self.__distance3}')
        #print(f'distance4: {self.__distance4}\n')
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
    def rssi(self):
        return self.__rssi

    @property
    def txPower(self):
        return self.__txPower

    @property
    def major(self):
        return self.__major

    @property
    def minor(self):
        return self.__minor

    @property
    def distance(self):
        return self.__distance