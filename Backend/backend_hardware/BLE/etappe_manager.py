import sys
import threading
import time

from .Helpers.ble_beacon import BleMeasurement, BleBeacon
from .Helpers.ble_helper import BleHelper
from datetime import datetime

class EtappeManager:
    # INIT
    #=================================================================================================================
    def __init__(self, etappe_count):
        self.__etappe_index = 0
        self.__etappe_count = etappe_count
        self.__etappe_array = [Etappe()] * etappe_count
        
        self.__is_timed_out = False
        self.__time_out_count = 5
        self.__time_out_thread = None
        self.__start_time_out_timestamp = None


    def start_time_out(self, start_timestamp):
        print(f'Etappe manager timeout - start')
        self.__is_timed_out = True
        self.__start_time_out_timestamp = start_timestamp
        self.__time_out_thread = threading.Thread(target=self.thread_time_out)
        self.__time_out_thread.start()


    def thread_time_out(self):
        time.sleep(self.__time_out_count)
        print(f'Etappe manager timeout - done')
        self.__is_timed_out = False


    def append_measure(self, measure_device_1, measure_device_2, finish_width):
        #Dont allow new measurements to be used when timed out
        if(self.__is_timed_out == True):
            return 0, None, self

        #Skip if max ettape count exeeded
        if self.__etappe_index >= self.__etappe_count:
            etappe_obj = self.__etappe_array[self.__etappe_count - 1]
            return 2, etappe_obj, self

        #Update etappe if needed
        etappe_obj = self.__etappe_array[self.__etappe_index]
        etappe_obj.append_measure(measure_device_1, measure_device_2, finish_width)
        has_finished_etappe = etappe_obj.has_finished_etappe()

        #Go to next etappe if possible and tell etappe has been completed
        if has_finished_etappe == True:
            self.__etappe_index += 1
            self.start_time_out(measure_device_1.time_stamp)

            if self.__etappe_index >= self.__etappe_count:
                return 2, etappe_obj, self
            return 1, etappe_obj, self

        #No etappe completed
        return 0, None, self


    def has_finished(self):
        #Check if all etappes succeeded
        if self.__etappe_index >= self.__etappe_count:
                return True
        return False


    @property
    def etappe_count(self):
        #get etappe count
        return self.__etappe_count


class Etappe:
    # INIT
    #=================================================================================================================
    def __init__(self):
        self.first_distance = None
        self.shortest_distance = 1000
        self.last_distance = None

        self.first_measure_obj = None
        self.last_measure_obj = None

        self.__treshhold = 3
        self.__finish_timestamp = None
        self.__has_finished = False


    def append_measure(self, measure_device_1, measure_device_2, finish_width):
        self.last_measure_obj = measure_device_1
        if(measure_device_1 == None) or (measure_device_2 == None):
            #print(f'measure_device_1 or measure_device_2 was NONE - {measure_device_1} - {measure_device_2}')
            return

        try:
            #Get variables
            #print(f'Distance get')
            distance_1 = measure_device_1.distance
            distance_2 = measure_device_2.distance
            address =  measure_device_1.address

            #Use average to balance the result
            #print(f'Distance average')
            distance = (distance_1 + distance_2) / 2.0
            if distance == None:
                return
            print(f'distance to finish = {distance}m --- address = {address}')
                
            #Assign distance
            self.last_distance = distance

            if (self.first_distance == None):
                self.first_distance = distance
                self.first_measure_obj = measure_device_1

            elif (self.shortest_distance > distance):
                self.shortest_distance = distance

        except Exception as e:
            print(f'Failed to append measurement in ettape_manager ==> {e}')


    def has_finished_etappe(self):
        if (self.first_distance == None) | (self.shortest_distance == None) | (self.last_distance == None):
            return False

        offset = self.last_distance - self.shortest_distance
        if (offset >= self.__treshhold):
            self.__has_finished = True
            self.__finish_timestamp = self.last_measure_obj.time_stamp
            #self.__finish_timestamp = self.calc_finish_timestamp()
            print(f'timestamp = {self.__finish_timestamp}, treshhold passed = {offset} - {self.shortest_distance}m - {self.last_distance}m')
            return True

        return False


    def calc_finish_timestamp(self):
        tstamp_last = self.last_measure_obj.time_stamp
        tstamp_first = self.first_measure_obj.time_stamp
        time_difference = BleHelper.get_timestamp_difference(tstamp_last, tstamp_first)
        distance_first_to_last = self.last_distance + self.first_distance
        speed = BleHelper.get_speed(distance_first_to_last, time_difference)  #in m/s

        distance_first_to_short = self.first_distance - self.shortest_distance
        time_to_finish = BleHelper.get_time(distance_first_to_short, speed)
        return BleHelper.datetime_to_string(BleHelper.add_seconds_to_timestamp(tstamp_first, time_to_finish))


    def get_finish_time(self):  
        return self.__finish_timestamp


        # def append_measure(self, measure1, measure2, finish_width):
        # self.last_measure = measure1
        # try:
        #     #print(f'{measure1} - {measure2} - {finish_width}')
        #     #print(f'address = {measure1.address}')
        #     distance = self.get_distance(measure1, measure2, finish_width)
        #     if distance == None:
        #         return
        #     print(f'distance to finish = {distance}m --- address = {measure1.address}')
                
        #     self.last_distance = distance

        #     if (self.first_distance == None):
        #         self.first_distance = distance
        #     elif (self.shortest_distance > distance):
        #         self.shortest_distance = distance

        # except Exception as e:
        #     print(f'Failed to append measurement in ettape_manager ==> {e}')


    # def get_distance(self, measure1, measure2, finish_width):
    #     a_original = measure1.distance
    #     b_original = measure2.distance
    #     #print(f'a_original - {a_original} \n b_original - {b_original} \n finish_width - {finish_width}')

        
    #     height_a = self.get_distance_for_side(a_original, b_original, finish_width)
    #     height_b = self.get_distance_for_side(b_original, a_original, finish_width)
    #     #print(f'height_a - {height_a} \n height_b - {height_b}')

    #     #if (height_a != None & height_b != None):
    #     #    if (height_b > height_a):
    #     #        height_fin =  height_b
    #     #    elif (height_a > height_b):
    #     #        height_fin =  height_a
    #     #elif (height_a == None & height_b != None):
    #     #     height_fin =  height_b
    #     #elif (height_b == None & height_a != None):
    #     #     height_fin =  height_a
            
    #     #return height_fin
    #     return (height_b + height_a) / 2.0

    # def get_distance_for_side(self, a_original, b_original, finish_width):
    #     b_new = BleHelper.check_constraints_side(a_original, b_original, finish_width)

    #     angle_b = BleHelper.get_triangle_corner_angle(a_original, b_new, finish_width)

    #     return BleHelper.get_triangle_height(a_original, angle_b)

