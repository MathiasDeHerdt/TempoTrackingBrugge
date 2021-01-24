
import sys
import time
from datetime import datetime
print(f'System path: {sys.path}')

from database_manager import DatabaseManager
from backend_hardware.game_manager import GameManager
from backend_hardware.BLE.Helpers.ble_helper import BleHelper


# =========================================================
#region --- Variables ==========================================================================================================================================
stop = False
player_finished_count = 0

list_beacons = [{'uuid' : '17105c4098cc4564b7a0da5f05c87a45'}]
list_players = [{'uuid' : '17105c4098cc4564b7a0da5f05c87a45'}]
database_beacons = None
database_players = None

game = None
database_manager = DatabaseManager()

#test
now = datetime.now()
x = str(now)
substring = x.split(".", 1)
date_today = substring[0]
print(f'date_today = {date_today}')

game_settings = {
    'GroupName' : 'hardwareTestGroup',
    'PlayerCount' : 0,
    'EtappeCount' : 3,
    'Date' : date_today,
    'RaceDistance' : 5,
    'FinishWidth' : 1.5
}

database_game_settings = None
#endregion


# =========================================================
#region --- Test functions ==========================================================================================================================================
def test_game_settings():
    global game_settings
    global database_game_settings
    global database_manager

    database_manager.store_game_settings(game_settings)
    database_game_settings, code = database_manager.get_game_settings_by_date(game_settings['Date'])
    print(f'Database game => \n{database_game_settings}')


def test_player_list(list_scan):
    global list_beacons
    global list_players
    global database_beacons
    global database_players
    global database_manager
    global database_game_settings

    list_players = []
    index = 1
    for beaconObj in list_scan:
        jsonObj = {
            'address' : beaconObj.address, 'name' : beaconObj.name,
            'uuid' : beaconObj.uuid, 'txPower' : beaconObj.txPower,
            'major' : beaconObj.major, 'minor' : beaconObj.minor
        }
        list_beacons.append(jsonObj)
        database_manager.store_beacon(jsonObj)

    response, code = database_manager.get_game_beacon_list()
    database_beacons = response['BeaconList']
    print(f'Database beacons => \n{database_beacons}')

    game_settings['PlayerCount'] = len(database_beacons)
    test_game_settings()

    gameID = database_game_settings['GameID']
    for beaconObj in database_beacons:
        jsonObj = {
            'name' : f'player{index}',
            'team' : f'team{index}',
            'BeaconID' : beaconObj['BeaconID'],
            'GameID' : gameID
        }
        list_players.append(jsonObj)
        database_manager.store_player(jsonObj)
        index += 1

    response, code = database_manager.get_game_player_list(gameID)
    database_players = response['PlayerList']
    print(f'Database players => \n{database_players}')
#endregion


# =========================================================
#region --- Print ==========================================================================================================================================
def print_etappe(jsonObj):
    #Print etappe json
    TimePerEtappe = jsonObj['TimePerEtappe']
    SpeedPerEtappe = jsonObj['SpeedPerEtappe'] 
    PlayerID = jsonObj['PlayerID']

    msg = f'\n>----------\n'
    msg += f'PlayerID = {PlayerID}\n'
    msg += f'TimePerEtappe = {TimePerEtappe}\n'
    msg += f'SpeedPerEtappe = {SpeedPerEtappe}\n'
    msg += f'>----------\n'
    print(msg)
#endregion


# =========================================================
#region --- Callback functions ==========================================================================================================================================
def callback_etappe(callObj):
    global database_players
    global database_beacons

    jsonObj = callObj.json_from_etappe()

    speedPerEtappe = BleHelper.get_speed(game_settings['RaceDistance'], jsonObj['TimePerEtappe'])
    playerID = -1
    for p in database_players:
        for b in database_beacons:
            if b['BeaconID'] == p['BeaconID']:
                if b['UUID'] == jsonObj['UUID']:
                    playerID = p['PlayerID']
                    break

    callObj.set_speed(speedPerEtappe)
    callObj.set_playerID(playerID)
    jsonObj = callObj.json_from_etappe()

    #print(f'\nEtappe done - game callback! \njsonObj = {jsonObj}\n')
    print_etappe(jsonObj)
    response, code = database_manager.store_etappe(jsonObj)


def callback_finish(callObj):
    global player_finished_count

    jsonObj = callObj.json_from_etappe_manager()
    print(f'\nFinished! - game callback! \njsonObj = {jsonObj}\n')

    response, code = database_manager.store_finish(jsonObj)

    player_finished_count += 1
    condition_stop()

#endregion


# =========================================================
#region --- Other functions ==========================================================================================================================================
def condition_stop():
    global stop
    global player_finished_count
    global list_players
    
    if (player_finished_count >= len(list_players)):
        stop = True

def reset_game():
    #clear variables for the game loop
    global stop
    global player_finished_count
    global game

    stop = False
    player_finished_count = 0
    game.clear_results()
#endregion


# =========================================================
#region --- RUN ==========================================================================================================================================
if __name__ == '__main__':
    game = GameManager()

    player_beacons = game.scan_for_players()
    for p in player_beacons:
        print(p)

    test_player_list(player_beacons) #test data

    for i in range(0,1):
        reset_game()

        game.initialize_game(
            game_settings['EtappeCount'], 
            game_settings['FinishWidth'], 
            list_beacons, 
            callback_etappe, 
            callback_finish)

        time.sleep(1)
        timestamp = BleHelper.datetime_to_string(datetime.now())
        game.start_game_loop(timestamp)
        while stop == False:
            time.sleep(2)

        print(f'\n\n Scan results during the race: \n')
        #game.print_managers()
        game.stop_game_loop()
#endregion