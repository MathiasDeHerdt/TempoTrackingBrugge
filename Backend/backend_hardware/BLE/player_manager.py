from datetime import datetime
from .etappe_manager import Etappe, EtappeManager
from .Helpers.ble_helper import BleHelper

class PlayerManager():
    # =========================================================
    #region --- INIT ==========================================================================================================================================
    def __init__(self, beacon, etappe_count, finish_width, callback_etappe = None,  callback_finished = None):
        self.__beacon = beacon #BleBeacon
        self.__finish_width = finish_width
        self.__dict_scan_results = {} #Dictionnary of all scan results grouped by scan device
        self.__etappe_manager = EtappeManager(etappe_count, beacon) #Keeps track of players etappes

        self.__list_device_id_rssi = ["device_esp_1", "device_esp_2"]

        if callback_etappe == None:
            callback_etappe = self.print_etappe
            print("Playermanager has default callback_etappe")
        self.__callback_etappe_done = callback_etappe

        if callback_finished == None:
            callback_finished = self.print_finished
            print("Playermanager has default callback_finished")
        self.__callback_player_finished = callback_finished
    #endregion


    # =========================================================
    #region --- CLEAR ==========================================================================================================================================
    def clear_results(self):
        etappe_count = self.__etappe_manager.etappe_count
        self.__etappe_manager = EtappeManager(etappe_count, self.__beacon)
    #endregion


    # =========================================================
    #region --- APPEND ==========================================================================================================================================
    def append_result(self, scan_result):
        if self.__etappe_manager.has_finished():
            return

        if self.__beacon.address == scan_result.address:
            #Get device id from scan result + check if key exists
            device_id = scan_result.device_id
            if device_id not in self.__dict_scan_results.keys():
                self.__dict_scan_results[device_id] = []


            #Add scan result to list
            self.__dict_scan_results[device_id].append(scan_result)

            #Check difference in time
            other_device_id = self.__list_device_id_rssi[0]
            if  (device_id == self.__list_device_id_rssi[0]):
                other_device_id = self.__list_device_id_rssi[1]

            if other_device_id not in self.__dict_scan_results.keys():
                return

            #Get closest result to check the general distance
            tstamp1 = scan_result.time_stamp
            compare_result = self.__get_closest_measure(tstamp1, other_device_id)
            response, etappeObj, managerObj = self.__etappe_manager.append_measure(scan_result, compare_result, self.__finish_width)
            print(f'response - {response}')

            #Use callbacks when an etappe is finished
            if response == 2: #race done
                self.__callback_etappe_done(etappeObj)
                self.__callback_player_finished(managerObj)
            if response == 1: #etappe done
                self.__callback_etappe_done(etappeObj)


    def __get_closest_measure(self, tstamp1, other_device_id):
        compare_result = None
        for result in self.__dict_scan_results[other_device_id]:
            #Check difference in seconds with previous results
            tstamp2 = result.time_stamp
            td_seconds = BleHelper.get_timestamp_difference(tstamp2, tstamp1)

            #Add to etappe measurements as long as they were before
            if (td_seconds < 2):
                if (td_seconds > 0):
                    compare_result = result
                else:
                    return compare_result
        return compare_result
    #endregion


    # =========================================================
    #region --- PRINT ==========================================================================================================================================
    def print_manager(self):
        print(f'beacon: \n{self.__beacon}')
        self.print_results()


    def print_results(self):
        for key in self.__dict_scan_results.keys():
            print(f'key = {key}')
            rssi = 0
            i = 0
            for scan_result in self.__dict_scan_results[key]:
                print(f'{scan_result}')
                rssi += scan_result.rssi
                i += 1
            rssi = rssi / i
            print(f'rssi average = {rssi}')


    def print_etappe(self, player_manager):
        print("Etappe done!")


    def print_finished(self, player_manager):
        print("Finished!")
    #endregion