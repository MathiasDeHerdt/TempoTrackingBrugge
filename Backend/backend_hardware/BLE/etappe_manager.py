import sys

from .Helpers.ble_beacon import BleMeasurement, BleBeacon
from .Helpers.ble_helper import BleHelper


class EtappeManager:
    # INIT
    #=================================================================================================================
    def __init__(self, etappe_count):
        self.__etappe_index = 0
        self.__etappe_count = etappe_count
        self.__etappe_array = [Etappe()] * etappe_count

    def append_measure(self, measure1, measure2, finish_width):
        #Skip if max ettape count exeeded
        if self.__etappe_index >= self.__etappe_count:
            return 2

        #Update etappe if needed
        self.__etappe_array[self.__etappe_index].append_measure(measure1, measure2, finish_width)
        has_finished_etappe = self.__etappe_array[self.__etappe_index].has_finished_etappe()
        
        #Go to next etappe if possible and tell etappe has been completed
        if has_finished_etappe == True:
            self.__etappe_index += 1
            if self.__etappe_index >= self.__etappe_count:
                return 2
            return 1

        #No etappe completed
        return 0

    def has_finished(self):
        if self.__etappe_index >= self.__etappe_count:
                return True
        return False

    @property
    def etappe_count(self):
        return self.__etappe_count


class Etappe:
    # INIT
    #=================================================================================================================
    def __init__(self):
        self.first_distance = None
        self.shortest_distance = 1000
        self.last_distance = None

        self.last_measure = None


    def append_measure(self, measure1, measure2, finish_width):
        self.last_measure = measure1
        try:
            #print(f'{measure1} - {measure2} - {finish_width}')
            distance = self.get_distance(measure1, measure2, finish_width)
            if distance == None:
                return
            #print(f'distance to finish - {distance}m')
                
            self.last_distance = distance

            if (self.first_distance == None):
                self.first_distance = distance
            elif (self.shortest_distance > distance):
                self.shortest_distance = distance

        except Exception as e:
            print(f'Failed to append measurement in ettape_manager ==> {e}')


    def has_finished_etappe(self):
        #print(f'first_distance - {self.first_distance} - shortest_distance - {self.shortest_distance} - last_distance - {self.last_distance}')
        if  (self.first_distance == None) | (self.shortest_distance == None) | (self.last_distance == None):
            return False

        offset = self.last_distance - self.shortest_distance
        if (offset >= 2): #treshhold = 3
            print(f'treshhold passed = {offset} - {self.shortest_distance}m - {self.last_distance}m')
            return True

        return False


    def etappe_finish_time(self):  
        return self.last_measure.timestamp


    def get_distance(self, measure1, measure2, finish_width):
        a_original = measure1.distance
        b_original = measure2.distance
        #print(f'a_original - {a_original} \n b_original - {b_original} \n finish_width - {finish_width}')

        
        height_a = self.get_distance_for_side(a_original, b_original, finish_width)
        height_b = self.get_distance_for_side(b_original, a_original, finish_width)
        #print(f'height_a - {height_a} \n height_b - {height_b}')

        #if (height_a != None & height_b != None):
        #    if (height_b > height_a):
        #        height_fin =  height_b
        #    elif (height_a > height_b):
        #        height_fin =  height_a
        #elif (height_a == None & height_b != None):
        #     height_fin =  height_b
        #elif (height_b == None & height_a != None):
        #     height_fin =  height_a
            
        #return height_fin
        return (height_b + height_a) / 2.0

    def get_distance_for_side(self, a_original, b_original, finish_width):
        b_new = BleHelper.check_constraints_side(a_original, b_original, finish_width)

        angle_b = BleHelper.get_triangle_corner_angle(a_original, b_new, finish_width)

        return BleHelper.get_triangle_height(a_original, angle_b)

