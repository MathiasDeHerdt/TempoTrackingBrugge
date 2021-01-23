import time
import threading

from .ble_manager import BleManager


class GameManager:
    # =========================================================
    #region --- INIT ==========================================================================================================================================
    def __init__(self):
        self.__ble_manager = self.__create_ble_manager()
        self.__is_game_active = False
        self.__thread_player_scan = None

    def __create_ble_manager(self):
        manager = BleManager()
        return manager
    #endregion


    # =========================================================
    #region --- SETUP GAME ==========================================================================================================================================
    def initialize_game(self, etappe_count, finish_width, selected_players, callback_etappe, callback_finish):
        self.__ble_manager.initialize(etappe_count, finish_width, selected_players, callback_etappe, callback_finish)
    
    def scan_for_players(self):
        print("scan for players")
        player_beacons = self.__ble_manager.scan_for_players()
        return player_beacons

    def clear(self):
        print("clear GameManager")
        self.__ble_manager.clear()

    def clear_results(self):
        print("clear results")
        self.__ble_manager.clear_results()
    #endregion


    # =========================================================
    #region --- LOOP GAME ==========================================================================================================================================
    def start_game_loop(self):
        try:
            self.__ble_manager.start_game_loop()
            print("Game started")
        except Exception as e:
            print(f'Exception => {e}')
        
    

    def stop_game_loop(self):
        self.__ble_manager.stop_game_loop()
        print("Game stop")
    #endregion


    # PRINT
    #=================================================================================================================
    def print_managers(self):
        self.__ble_manager.print_registered_results()
    #endregion


        

