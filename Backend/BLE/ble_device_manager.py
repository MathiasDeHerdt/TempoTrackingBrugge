from ble_result_manager import ResultManager

class DeviceManager():
    def __init__(self, deviceId):
        self.__deviceId = deviceId
        self.__list_result_manager = []

    def append_beacon(self, beacon):
        self.__list_result_manager.append(ResultManager(beacon))

    def append_beacon_list(self, list_beacons):
        for beacon in list_beacons:
            self.append_beacon(beacon)

    def append_result(self, result):
        if result.deviceId ==  self.__deviceId:
            for result_manager in self.__list_result_manager:
                if result_manager.checkResultToBeacon(result):
                    return result_manager.append_result(result)
        return False

    def __str__(self):
        ret = f'--\ndeviceId: {self.__deviceId}\n'
        for result_manager in self.__list_result_manager:
            ret += str(result_manager)
        ret += f'--\n'
        return ret