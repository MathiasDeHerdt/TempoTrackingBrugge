import math
from datetime import datetime, timedelta

#https://www.driehoekberekenen.nl/hoogte/
#https://xaktly.com/MathNonRightTrig.html


class BleHelper():
    nValue = 4 #range2 - 4 , afhankelijk van factoren in omgeving die storing verooorzaken

    # RSSI TO DISTANCE CALCULATION
    #=================================================================================================================
    @staticmethod
    def distance_from_rssi(rssi, txPower, nValue):
        ratioDB = txPower - rssi
        distance = pow(10, (ratioDB / (10 * nValue)))
        return distance


    # DISTANCE TO FINISH / TRIANGLE MATH
    #=================================================================================================================
    @staticmethod
    def get_triangle_corner_angle(a, b, c):
        try:
                a2 = pow(a,2)
                b2 = pow(b,2)
                c2 = pow(c,2)
                angle_a = math.acos((b2 + c2 - a2) / (2 * b * c)) #angle of A
                return angle_a
        except:
            return None

    @staticmethod
    def get_max_side(a, b):
         #Get maximum side length given a and b, side length may not be longer than this
        return a + b

    @staticmethod
    def get_min_side(a, b):
        #Get minimum side length given a and b, side length may not be shorter than this
        if(a > b):
            return a - b
        return b - a

    @staticmethod
    def check_constraints_side(distance_to_a, distance_to_b, finish_width):
        max_side = BleHelper.get_max_side(distance_to_a, finish_width)
        min_side = BleHelper.get_min_side(distance_to_a, finish_width)

        if(distance_to_b >= max_side):
            distance_to_b = max_side - 0.001

        elif(min_side >= distance_to_b):
            distance_to_b = min_side + 0.001

        return distance_to_b


    @staticmethod
    def calculate_sides(distance_to_rpi, distance_to_esp, width_finish):
        max_rpi_finish = BleHelper.get_max_side(distance_to_esp, width_finish)
        min_rpi_finish = BleHelper.get_min_side(distance_to_esp, width_finish)

        max_esp_finish = BleHelper.get_max_side(distance_to_rpi, width_finish)
        min_esp_finish = BleHelper.get_min_side(distance_to_rpi, width_finish)

        was_changed = 0
        if(distance_to_rpi > max_rpi_finish):
            distance_to_rpi = max_rpi_finish - 0.001
            was_changed = 1
        if(min_rpi_finish > distance_to_rpi):
            distance_to_rpi = min_rpi_finish + 0.001
            was_changed = 1

        if(distance_to_esp > max_esp_finish):
            distance_to_esp = max_esp_finish - 0.001
            was_changed = 1
        if(min_esp_finish > distance_to_esp):
            distance_to_esp = min_esp_finish + 0.001
            was_changed = 1

        return [was_changed, distance_to_rpi, distance_to_esp]


    @staticmethod
    def get_triangle_height(side_a, angle_b):
        try:
            height = side_a * math.sin(angle_b)
            return height
        except:
            return None


    @staticmethod
    def get_speed(distance, time):
        try:
            return float(distance) / float(time)
        except:
            return None


    @staticmethod
    def get_time(distance, speed):
        try:
            return distance/speed
        except:
            return None


    @staticmethod
    def add_seconds_to_timestamp(timestamp_string, seconds, format_timestamp = "%Y-%m-%d %H:%M:%S"): 
        tstamp = datetime.strptime(timestamp_string, format_timestamp)
        added_seconds = timedelta(0, seconds)
        return tstamp + added_seconds

    @staticmethod
    def get_timestamp_difference(timestamp_1_string, timestamp_2_string, format_timestamp = "%Y-%m-%d %H:%M:%S"): 
        tstamp1 = BleHelper.get_timestamp_format(timestamp_1_string, format_timestamp)
        tstamp2 = BleHelper.get_timestamp_format(timestamp_2_string, format_timestamp)
        td = tstamp2 - tstamp1
        td_seconds = int(round(td.total_seconds())) #in seconds
        return  td_seconds

    @staticmethod
    def get_timestamp_format(timestamp_string, format_timestamp = "%Y-%m-%d %H:%M:%S"): 
        return datetime.strptime(timestamp_string, format_timestamp)

    @staticmethod
    def datetime_to_string(timestamp, format_timestamp = "%Y-%m-%d %H:%M:%S"):
        return str(timestamp.strftime(format_timestamp))
