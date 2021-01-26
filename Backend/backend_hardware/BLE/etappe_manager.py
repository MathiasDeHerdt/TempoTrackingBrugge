import sys
import threading
import time

from .Helpers.ble_beacon import BleMeasurement, BleBeacon
from .Helpers.ble_helper import BleHelper
from datetime import datetime

class EtappeManager:
    # =========================================================
    #region --- INIT ==========================================================================================================================================
    def __init__(self, etappe_count, beacon):
        self.__beacon = beacon
        self.__start_timestamp = None

        self.__etappe_index = 0
        self.__etappe_count = etappe_count
        self.__etappe_array = [None] * etappe_count
        for index in range(0, etappe_count):
            self.__etappe_array[index] = Etappe(index + 1, beacon)
        
        self.__is_timed_out = False
        self.__time_out_count = 5
        self.__time_out_thread = None
        self.__time_out_timestamp = None
    #endregion


    # =========================================================
    #region --- PROPERTIES ==========================================================================================================================================
    @property
    def etappe_count(self):
        #get etappe count
        return self.__etappe_count


    @property
    def etappe_list(self):
        #get etappe count
        return self.__etappe_array
    #endregion


    # =========================================================
    #region --- SET FUNCTIONS ==========================================================================================================================================
    def set_start_timestamp(self, timestamp):
        #Timestamp when manager should become active = start of race
        self.__start_timestamp = timestamp
        self.__etappe_array[0].set_start_timestamp(timestamp)
    #endregion


    # =========================================================
    #region --- FUNCTIONS ==========================================================================================================================================
    def start_time_out(self, start_timestamp):
        #Start timeout when player crossed finish
        print(f'Etappe manager timeout - start')
        self.__is_timed_out = True
        self.__time_out_timestamp = start_timestamp
        self.__time_out_thread = threading.Thread(target=self.thread_time_out)
        self.__time_out_thread.start()


    def thread_time_out(self):
        #Stop timout
        time.sleep(self.__time_out_count)
        print(f'Etappe manager timeout - done')
        self.__is_timed_out = False


    def append_measure(self, measure_device_1, measure_device_2, finish_width):
        #Dont allow new measurements to be used when timed out
        if self.__is_timed_out == True:
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
            else:
                timestamp = BleHelper.datetime_to_string(datetime.now())
                self.__etappe_array[self.__etappe_index].set_start_timestamp(timestamp)
            return 1, etappe_obj, self

        #No etappe completed
        return 0, None, self


    def has_finished(self):
        #Check if all etappes succeeded
        if self.__etappe_index >= self.__etappe_count:
                return True
        return False
    #endregion


    # =========================================================
    #region --- JSON FUNCTIONS ==========================================================================================================================================
    def json_from_etappe_manager(self):
        list_etappe = self.etappe_list
        avgSpeed = 0
        totalTime = 0
        jsonList = []
        playerID = -1

        for etappe in list_etappe:
            jsonEtappe = etappe.json_from_etappe()
            jsonList.append(jsonEtappe)
            avgSpeed += jsonEtappe['SpeedPerEtap']
            totalTime += jsonEtappe['TimePerEtap']
            playerID = jsonEtappe['PlayerID']

        avgSpeed = float(avgSpeed) / self.etappe_count

        jsonObj = {
            'PlayerID' : playerID,
            'TotalTime' : totalTime,
            'AvgSpeed' : avgSpeed,
            'EtappeCount' : self.etappe_count,
            'EtappeList' : jsonList,
            'Address' : self.__beacon.address,
            'UUID' : self.__beacon.uuid
        }
        return jsonObj
    #endregion




class Etappe:
    # =========================================================
    #region --- INIT ==========================================================================================================================================
    __treshhold = 3

    def __init__(self, etappe_number, beacon):
        self.__beacon = beacon
        self.__has_finished = False
        self.__etappe_number = etappe_number

        self.__playerID = -1
        self.__speed = 0
        self.__timePerEtappe = 0

        self.first_distance = None
        self.shortest_distance = 1000
        self.last_distance = None

        self.first_measure_obj = None
        self.last_measure_obj = None

        self.__start_timestamp = None
        self.__finish_timestamp = None
    #endregion


    # =========================================================
    #region --- PROPERTIES ==========================================================================================================================================
    @property
    def timestamp(self):
        #get etappe timestamp
        return self.__finish_timestamp


    @property
    def number(self):
        #get etappe number
        return self.__etappe_number
    #endregion


    # =========================================================
    #region --- SET FUNCTIONS ==========================================================================================================================================
    def set_playerID(self, PlayerID):
        self.__playerID = PlayerID

    def set_speed(self, speed):
        self.__speed = speed

    def set_start_timestamp(self, timestamp):
        self.__start_timestamp = timestamp
    #endregion


    # =========================================================
    #region --- FUNCTIONS ==========================================================================================================================================
    def append_measure(self, measure_device_1, measure_device_2, finish_width):
        self.last_measure_obj = measure_device_1
        if(measure_device_1 == None) or (measure_device_2 == None):
            return

        try:
            #Get variables
            distance_1 = measure_device_1.distance
            distance_2 = measure_device_2.distance
            address =  measure_device_1.address

            #Use average to balance the result
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
        #Check if all values are filled
        if (self.first_distance == None) | (self.shortest_distance == None) | (self.last_distance == None):
            return False

        #Check if player finished
        offset = self.last_distance - self.shortest_distance
        if (offset >= Etappe.__treshhold):
            self.__has_finished = True
            self.__finish_timestamp = self.last_measure_obj.time_stamp
            #self.__finish_timestamp = self.calc_finish_timestamp()
            print(f'timestamp = {self.__finish_timestamp}, treshhold passed = {offset} - {self.shortest_distance}m - {self.last_distance}m')
            self.__timePerEtappe = BleHelper.get_timestamp_difference(self.__start_timestamp, self.__finish_timestamp)
            return True

        #No finish
        return False


    def calc_finish_timestamp(self):
        #Get player speed
        tstamp_last = self.last_measure_obj.time_stamp
        tstamp_first = self.first_measure_obj.time_stamp
        time_difference = BleHelper.get_timestamp_difference(tstamp_last, tstamp_first)
        distance_first_to_last = self.last_distance + self.first_distance
        speed = BleHelper.get_speed(distance_first_to_last, time_difference)  #in m/s

        #Determine when player passed the finish
        distance_first_to_short = self.first_distance - self.shortest_distance
        time_to_finish = BleHelper.get_time(distance_first_to_short, speed)
        return BleHelper.datetime_to_string(BleHelper.add_seconds_to_timestamp(tstamp_first, time_to_finish))
    #endregion


    # =========================================================
    #region --- JSON FUNCTIONS ==========================================================================================================================================
    def json_from_etappe(self):
        jsonObj = {
            'EtappeID' : -1,
            'Address' : self.__beacon.address,
            'UUID' : self.__beacon.uuid,
            'TimeStamp' : self.__finish_timestamp,
            'TimePerEtap' : self.__timePerEtappe,
            'SpeedPerEtap' : self.__speed,
            'PlayerID' : self.__playerID,
            'Number' : self.__etappe_number
        }
        return jsonObj
    #endregion