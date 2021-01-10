class BleHelper:
    def __init__(self):
        self.txPower = -65
        self.nValue = 2 #range2 - 4 

    def distance_from_rssi(self, rssi):
        distance = pow(10, ((self.txPower - rssi) / (10 * self.nValue)))
        return distance
    