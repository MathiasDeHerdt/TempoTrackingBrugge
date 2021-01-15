import math

print("Importing ble_helper.py....")


class BleHelper():
    txPower = -65
    nValue = 4 #range2 - 4 , afhankelijk van factoren in omgeving die storing verooorzaken

    @staticmethod
    def distance_from_rssi(rssi, nValue):
        ratioDB = BleHelper.txPower - rssi
        distance = pow(10, (ratioDB / (10 * nValue)))
        return distance

    @staticmethod
    def distance_from_rssi2(rssi, nValue):
        ratioDB = BleHelper.txPower - rssi
        ratioLinear = pow(10, (ratioDB / 10.0))
        distance = math.sqrt(ratioLinear)
        return distance