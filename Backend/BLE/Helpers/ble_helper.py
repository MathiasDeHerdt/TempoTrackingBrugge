import math


class BleHelper():
    nValue = 4 #range2 - 4 , afhankelijk van factoren in omgeving die storing verooorzaken

    @staticmethod
    def distance_from_rssi(rssi, nValue, txPower):
        ratioDB = txPower - rssi
        distance = pow(10, (ratioDB / (10 * nValue)))
        return distance

    @staticmethod
    def distance_from_rssi2(rssi, nValue, txPower):
        ratioDB = txPower - rssi
        ratioLinear = pow(10, (ratioDB / 10.0))
        distance = math.sqrt(ratioLinear)
        return distance