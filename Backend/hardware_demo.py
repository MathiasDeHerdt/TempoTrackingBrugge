
import os
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
    'GroupName' : 'Demo',
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
    response, code = database_manager.get_settings_by_date(game_settings['Date'])
    database_game_settings = response['Settings']
    print(f'Database game => \n{database_game_settings}')


def test_player_list(list_scan):
    global list_beacons
    global list_players
    global database_beacons
    global database_players
    global database_manager
    global database_game_settings

    list_players = []
    database_beacons = []
    index = 1
    for beaconObj in list_scan:
        jsonObj = {
            'address' : beaconObj.address, 'name' : beaconObj.name,
            'uuid' : beaconObj.uuid, 'txPower' : beaconObj.txPower,
            'major' : beaconObj.major, 'minor' : beaconObj.minor
        }
        list_beacons.append(jsonObj)
        database_manager.store_beacon(jsonObj)

        response, code = database_manager.get_beacon_by_uuid(beaconObj.uuid)
        database_beacons.append(response['Beacon'])

    print(f'Database beacons => \n{database_beacons}')

    game_settings['PlayerCount'] = len(database_beacons)
    test_game_settings()

    gameID = database_game_settings['GameID']
    for beaconObj in database_beacons:
        jsonObj = {
            'PlayerName' : f'player{index}',
            'TeamName' : f'ag2r-citroen-team',
            'BeaconID' : beaconObj['BeaconID'],
            'GameID' : gameID,
        }
        list_players.append(jsonObj)
        database_manager.store_player(jsonObj)
        index += 1

    response, code = database_manager.get_players_by_gameID(gameID)
    database_players = response['PlayerList']
    print(f'Database players => \n{database_players}')
#endregion


# =========================================================
#region --- Print ==========================================================================================================================================
def print_test_game():
    global game_settings
    Date = game_settings['Date']
    print('\n=========================================================================================================\n')

    #Print game settings
    response, code = database_manager.get_settings_by_date(Date)
    Settings = response['Settings']
    print_game_settings(Settings)
    GameID = Settings['GameID']
    print('>----------\n')

    #Print beacons
    response, code = database_manager.get_beacon_list()
    BeaconList = response['BeaconList']
    for b in BeaconList:
        print_beacon(b)
    print('\n=========================================================================================================\n')

    #Print players
    response, code = database_manager.get_players_by_gameID(GameID)
    PlayerList = response['PlayerList']
    for p in PlayerList:
        print_player(p)
        PlayerID = p['PlayerID']
        print('>----------')

        #Print etappes
        response, code = database_manager.get_etappes_by_player(PlayerID)
        EtappeList = response['EtappeList']
        for e in EtappeList:
            print_etappe(e)
            print('-')
        print('>----------')

        #Print results/finish
        response, code = database_manager.get_results_by_player(PlayerID)
        ResultList = response['ResultList']
        for r in ResultList:
            print_finish(r)

        print('\n=============================================================n')

    print('\n')



def print_game_settings(jsonObj):
    #Print game settings json
    GameID = jsonObj['GameID']
    GroupName = jsonObj['GroupName']
    PlayerCount = jsonObj['PlayerCount'] 
    EtappeCount = jsonObj['EtappeCount']
    Date = jsonObj['Date']

    msg = f'GameID = {GameID} --- GroupName = {GroupName}\n'
    msg += f'PlayerCount = {PlayerCount} --- EtappeCount = {EtappeCount}\n'
    msg += f'Date = {Date}\n'
    print(msg)


def print_player(jsonObj):
    #Print player json
    PlayerID = jsonObj['PlayerID']
    PlayerName = jsonObj['PlayerName']
    TeamName = jsonObj['TeamName'] 
    BeaconID = jsonObj['BeaconID']
    GameID = jsonObj['GameID']

    msg = f'PlayerID = {PlayerID} --- PlayerName = {PlayerName} --- BeaconID = {BeaconID}\n'
    msg += f'TeamName = {TeamName}\n'
    msg += f'GameID = {GameID}\n'
    print(msg)


def print_beacon(jsonObj):
    #Print beacon json
    BeaconID = jsonObj['BeaconID']
    Major = jsonObj['Major']
    Minor = jsonObj['Minor'] 
    UUID = jsonObj['UUID']
    Address = jsonObj['Address']
    Tx_power = jsonObj['Tx_power']

    msg = f'BeaconID = {BeaconID}\n'
    msg += f'Major = {Major} --- Minor = {Minor}\n'
    msg += f'UUID = {UUID} --- Address = {Address}\n'
    msg += f'Tx_power = {Tx_power}dB\n'
    print(msg)


def print_finish(jsonObj):
    #Print finish result json
    ResultID = jsonObj['ResultID']
    TotalTime = jsonObj['TotalTime']
    AvgSpeed = jsonObj['AvgSpeed'] 
    PlayerID = jsonObj['PlayerID']

    msg = f'ResultID = {ResultID} --- PlayerID = {PlayerID}\n'
    msg += f'TotalTime = {TotalTime}s --- AvgSpeed = {AvgSpeed}km/h\n'
    print(msg)


def print_etappe(jsonObj):
    #Print etappe json

    EtappeID = jsonObj['EtappeID']
    TimePerEtap = jsonObj['TimePerEtap']
    SpeedPerEtap = jsonObj['SpeedPerEtap'] 
    PlayerID = jsonObj['PlayerID']

    msg = f'PlayerID = {PlayerID} --- EtappeID = {EtappeID}\n'
    msg += f'TimePerEtap = {TimePerEtap}s --- SpeedPerEtappe = {SpeedPerEtap}km/h\n'
    print(msg)
#endregion


# =========================================================
#region --- Callback functions ==========================================================================================================================================
def callback_etappe(callObj):
    global database_players
    global database_beacons

    jsonObj = callObj.json_from_etappe()

    speedPerEtappe = BleHelper.get_speed(game_settings['RaceDistance'], jsonObj['TimePerEtap'])
    speedPerEtappe = speedPerEtappe * 3.6 #km/h
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
    response, code = database_manager.store_etappe(jsonObj)
    print_etappe(jsonObj)


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
def start_led_strip(): #start de ledstrip
    print("Ledstrip starting")
    os.system('sudo python3 /home/pialex/TempoTrackingBrugge/Backend/backend_hardware/helpers/rgb.py')

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

        start_led_strip()

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

        #game.print_managers()
        game.stop_game_loop()

        print_test_game()
#endregion