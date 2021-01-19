from datetime import datetime
from .etappe_manager import Etappe, EtappeManager

class PlayerManager():
    # INIT
    #=================================================================================================================
    def __init__(self, beacon, etappe_count, finish_width, callback_etappe = None,  callback_finished = None):
        self.__beacon = beacon #BleBeacon
        self.__finish_width = finish_width
        self.__dict_scan_results = {} #Dictionnary of all scan results grouped by scan device
        self.__etappe_manager = EtappeManager(etappe_count) #Keeps track of players etappes

        if callback_etappe == None:
            callback_etappe = self.print_etappe
            print("Playermanager has default callback_etappe")
        self.__callback_etappe_done = callback_etappe

        if callback_finished == None:
            callback_finished = self.print_finished
            print("Playermanager has default callback_finished")
        self.__callback_player_finished = callback_finished

    def clear_results(self):
        etappe_count = self.__etappe_manager.etappe_count
        self.__etappe_manager = EtappeManager(etappe_count)


    # APPEND
    #=================================================================================================================
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
            other_device_id = "device_esp_1"
            if  (device_id != "device_rpi"):
                other_device_id = "device_rpi"

            if other_device_id not in self.__dict_scan_results.keys():
                return


            tstamp1 = datetime.strptime(scan_result.time_stamp, "%Y-%m-%d %H:%M:%S")
            for compare_result in self.__dict_scan_results[other_device_id]:

                tstamp2 = datetime.strptime(compare_result.time_stamp, "%Y-%m-%d %H:%M:%S")
                td = tstamp2 - tstamp1
                td_seconds = int(round(td.total_seconds()))


                #Add to etappe measurements
                if (td_seconds < 2 & td_seconds > 0):
                    response = self.__etappe_manager.append_measure(scan_result, compare_result, self.__finish_width)
                    print(f'response - {response}')

                    if response == 2: #race done
                        self.__callback_etappe_done(self)
                        self.__callback_player_finished(self)
                    if response == 1: #etappe done
                        self.__callback_etappe_done(self)

                    return


    # PRINT
    #=================================================================================================================
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
