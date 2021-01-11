import math

class BleHelper:
    def __init__(self):
        self.txPower = -65
        self.nValue = 4 #range2 - 4 , afhankelijk van factoren in omgeving die storing verooorzaken

    def distance_from_rssi(self, rssi, nValue):
        ratioDB = self.txPower - rssi
        distance = pow(10, (ratioDB / (10 * nValue)))
        return distance
    
    def distance_from_rssi2(self, rssi, nValue):
        ratioDB = self.txPower - rssi
        ratioLinear = pow(10, (ratioDB / 10.0))
        distance = math.sqrt(ratioLinear)
        return distance