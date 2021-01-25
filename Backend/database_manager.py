



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
    #region --- Get functions ==========================================================================================================================================
    def get_settings_by_date(self, Date):
        try:
            data = DataRepository.read_game_by_date(Date)
            return {'Settings' : data}, 200

        except Exception as e:
            print(f'Exception => {e}')
            return None, 500

    def get_beacon_list(self):
        try:
            data = DataRepository.read_beacon()
            return {'BeaconList' : data}, 200

        except Exception as e:
            print(f'Exception => {e}')
            return {'BeaconList' : []}, 500

    def get_players_by_gameID(self, GameID):
        try:
            data = DataRepository.read_player_by_game(GameID)
            return {'PlayerList' : data}, 200

        except Exception as e:
            print(f'Exception => {e}')
            return {'PlayerList' : []}, 500

    def get_etappes_by_player(self, PlayerID):
        try:
            data = DataRepository.read_etappe_by_player(PlayerID)
            return {'EtappeList' : data}, 200

        except Exception as e:
            print(f'Exception => {e}')
            return {'EtappeList' : []}, 500

    def get_results_by_player(self, PlayerID):
        try:
            data = DataRepository.read_result_by_player(PlayerID)
            return {'ResultList' : data}, 200

        except Exception as e:
            print(f'Exception => {e}')
            return {'ResultList' : []}, 500
    #endregion


    # =========================================================
    #region --- Store functions ==========================================================================================================================================
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
            TimePerEtap = jsonObj['TimePerEtap']
            SpeedPerEtap = jsonObj['SpeedPerEtap']
            PlayerID = jsonObj['PlayerID']

            print(f"etappe {PlayerID} naar database")
            response = DataRepository.insert_etappe(TimePerEtap, SpeedPerEtap, PlayerID)
            print(f"response {response}")
            return {'Message' : "Etappe was stored"}, 200

        except Exception as e:
            print(f'Exception => {e}')
            return {'Message' : "failed to append etappe"}, 500
    

    def store_game_settings(self, jsonObj):
        try:
            GroupName = jsonObj['GroupName']
            PlayerCount = jsonObj['PlayerCount']
            EtappeCount = jsonObj['EtappeCount']
            Date = jsonObj['Date']

            print(f"game {GroupName} naar database")
            DataRepository.insert_game(PlayerCount, EtappeCount, GroupName, Date)
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