



# =========================================================
# Import - custom imports
# =========================================================
from repo.datarepo import DataRepository
import json

# =========================================================
# Class
# =========================================================
class DatabaseManager:
    # =========================================================
    #region --- INIT ==========================================================================================================================================
    def __init__(self):
        self.__ = DataRepository
    #endregion


    # =========================================================
    #region --- INIT ==========================================================================================================================================
    def get_game_settings_by_date(self, date):
        try:
            data = DataRepository.read_game_by_date(date)
            return data, 200

        except Exception as e:
            print(f'Exception => {e}')
            return None, 500
    

    def get_game_beacon_list(self):
        try:
            data = DataRepository.read_beacon()
            return {'BeaconList' : data}, 200

        except Exception as e:
            print(f'Exception => {e}')
            return {'BeaconList' : []}, 500


    def get_game_player_list(self, gameID):
        try:
            data = DataRepository.read_player_by_game(gameID)
            return {'PlayerList' : data}, 200

        except Exception as e:
            print(f'Exception => {e}')
            return {'PlayerList' : []}, 500
    #endregion


    # =========================================================
    #region --- Database ==========================================================================================================================================
    def store_finish(self, jsonObj):
        try:
            TotalTime = jsonObj['TotalTime']
            AvgSpeed = jsonObj['AvgSpeed']
            PlayerID = jsonObj['PlayerID']

            print(f"finish {PlayerID} naar database")
            DataRepository.insert_result(TotalTime, AvgSpeed, PlayerID)
            return {'Message' : "Finish was stored"}, 200

        except Exception as e:
            print(f'Exception => {e}')
            return {'Message' : "failed to append finish"}, 500

    
    def store_etappe(self, jsonObj):
        try:
            timePerEtappe = jsonObj['TimePerEtappe']
            speedPerEtappe = jsonObj['SpeedPerEtappe']
            playerID = jsonObj['PlayerID']

            print(f"etappe {playerID} naar database")
            DataRepository.insert_etappe(timePerEtappe, speedPerEtappe, playerID)
            return {'Message' : "Etappe was stored"}, 200

        except Exception as e:
            print(f'Exception => {e}')
            return {'Message' : "failed to append etappe"}, 500
    

    def store_game_settings(self, jsonObj):
        try:
            group_name = jsonObj['GroupName']
            player_count = jsonObj['PlayerCount']
            ettape_count = jsonObj['EtappeCount']
            date = jsonObj['Date']

            print(f"game {group_name} naar database")
            DataRepository.insert_game(player_count, ettape_count, group_name, date)
            return {'Message' : "Game settings was stored"}, 200

        except Exception as e:
            print(f'Exception => {e}')
            return {'Message' : "failed to append game settings"}, 500


    def store_player(self, jsonObj):
        try:
            playerName = jsonObj['name']
            teamName = jsonObj['team']
            beaconId = jsonObj['BeaconID']
            gameId = jsonObj['GameID']

            print(f"user {playerName} naar database")
            DataRepository.insert_player(playerName, teamName, beaconId, gameId)
            return {'Message' : "Player was stored"}, 200

        except Exception as e:
            print(f'Exception => {e}')
            return  {'Message' : "failed to append player"}, 500


    def store_beacon(self, jsonObj):
        try:
            uuid = jsonObj['uuid']
            name = jsonObj['name']
            address = jsonObj['address']
            major = jsonObj['major']
            minor = jsonObj['minor']
            tx_power = jsonObj['txPower']

            data = DataRepository.read_beacon_by_uuid(uuid)
            print(f"beacon {uuid} - {address} naar database")

            if data is None:
                DataRepository.insert_beacon(major, minor, uuid, address, tx_power)
                msg = "Beacon was stored"
                print(msg)
                return {'Message' : msg}, 200
            else:
                DataRepository.update_beacon_by_uuid(major, minor, uuid, address, tx_power)
                msg = "Beacon was updated"
                print(msg)
                return {'Message' : msg}, 200

        except Exception as e:
            print(f'Exception => {e}')
            return {'Message' : "failed to append beacon"}, 500

    #endregion