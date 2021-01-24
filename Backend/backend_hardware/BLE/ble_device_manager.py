#print("Importing beacon_manager....")

from .ble_result_manager import ResultManager

class DeviceManager():
    def __init__(self, deviceId, etappe_count):
        self.__deviceId = deviceId
        self.__list_result_manager = []

    def append_beacon(self, beacon):
        self.__list_result_manager.append(ResultManager(beacon))

    def append_beacon_list(self, list_beacons):
        for beacon in list_beacons:
            self.append_beacon(beacon)

    def clear(self):
        self.__list_result_manager = []

    def clear_results(self):
        for result_manager in self.__list_result_manager:
                return result_manager.clear_results()

    def append_result(self, result):
        deviceId = result.deviceId.strip()
        if deviceId == self.__deviceId:
            for result_manager in self.__list_result_manager:
                return result_manager.append_result(result)
        return False

    def __str__(self):
        ret = f'--\ndeviceId: {self.__deviceId}\n'
        for result_manager in self.__list_result_manager:
            ret += str(result_manager)
        ret += f'--\n'
        return ret

    @property
    def results(self):
        list_results = {}
        for result_manager in self.__list_result_manager:
            objDict = result_manager.results_dictionnary
            list_results[objDict['address']] = objDict['results']
        return list_results