

class ResultManager():
    def __init__(self, beacon):
        self.__beacon = beacon #BleBeacon
        self.__results = [] #BleMeasurement

    def append_result(self, result):
        if self.checkResultToBeacon(result):
            self.__results.append(result)
            return True
        return False

    def checkResultToBeacon(self, result):
        #print(f'{result.address} trying to add {result}')
        if result.address == self.beacon.address:
            return True
        return False

    def __str__(self):
        ret = f'{self.__beacon}\n'
        for result in self.__results:
            ret += f'{result}\n'
        return ret

    @property
    def beacon(self):
        return self.__beacon