# =========================================================
# Import - libraries
# =========================================================
from flask import Flask, request, jsonify
from flask_socketio import SocketIO, send, emit
from flask_cors import CORS
from datetime import date, datetime
import os
import sys
import time
import json

# =========================================================
# Import - custom imports
# =========================================================
from repo.datarepo import DataRepository

# =========================================================
# Import - Hardware - Alex
# =========================================================
from backend_hardware.game_manager import GameManager


# =========================================================
# Start apps
# =========================================================
app = Flask(__name__)
app.config['SECRET_KEY'] = 'bruggetempotrack'
socketio = SocketIO(app, cors_allowed_origins='*')
CORS(app)
endpoint = '/api/v1'

# =========================================================
#region --- Global variables ==========================================================================================================================================
player_count = 0
etappe_count = 0

playerName = ""
teamName = ""

game_manager = GameManager()

list_players = []
list_beacons = []

finish_width = 0
player_finished_count = 0
is_game_running = False

game_timestamp_start = None
#endregion


# =========================================================
#region --- Hardware functions ===========================================================================================================================
def start_led_strip(): #start de ledstrip
    print("Ledstrip starting")
    os.system('sudo python3 /home/pialex/TempoTrackingBrugge/Backend/backend_hardware/helpers/rgb.py')


def scan_for_players(): #get a list of beacons within range
    scanned_beacons = game_manager.scan_for_players()
    list_beacons = []

    for beaconObj in scanned_beacons:
        jsonObj = {
            'address' : beaconObj.address, 'name' : beaconObj.name,
            'uuid' : beaconObj.uuid, 'txPower' : beaconObj.txPower,
            'major' : beaconObj.major, 'minor' : beaconObj.minor
        }
        list_beacons.append(jsonObj)

    return list_beacons


def start_game_loop(): #start the game loop
    try:
        global game_manager
        global is_game_running
        global etappe_count
        global finish_width
        global list_players
        global game_timestamp_start

        reset_game()
        #start_led_strip()

        print(f'Initializing game')
        game_manager.initialize_game(
            etappe_count, 
            finish_width, 
            list_players, 
            callback_game_player_etappe, 
            callback_game_player_finish
            )

        time.sleep(2)
        print(f'Starting game')
        game_manager.start_game_loop()
        is_game_running = True
        game_timestamp_start = datetime.now()
    except Exception as e:
        print(f'Exception => {e}')



def stop_game_loop(): #stop the running game
    global game_manager
    game_manager.stop_game_loop()


def reset_game(): #clear variables for the game loop
    global is_game_running
    global player_finished_count
    global game_manager

    is_game_running = False
    player_finished_count = 0
    game_manager.clear_results()


def clear_game_full(): #clear variables for the game loop
    global is_game_running
    global player_finished_count
    global game_manager

    is_game_running = False
    player_finished_count = 0
    game_manager.clear()


def callback_game_player_etappe(callObj): #callback when a player finished a etappe
    jsonObj = callObj.json_from_etappe()
    print(f'Etappe done - game callback! - {callObj}\njsonObj = {jsonObj}')
    send_etappe_to_front(jsonObj)


def callback_game_player_finish(callObj): #callback when a player finished all of his/her etappes
    global player_finished_count
    
    jsonObj = callObj.json_from_etappe_manager()
    print(f'Finished! - game callback! - {callObj}\njsonObj = {jsonObj}')
    send_player_finish_to_front(jsonObj)

    player_finished_count += 1
    game_check_end()


def game_check_end():  #check for condition for the game to end
    global player_finished_count
    global player_count
    global is_game_running
    
    if (player_finished_count >= player_count):
        is_game_running = False
        stop_game_loop()


def debug_game_manager(): #print the game managers for debug
    global game_manager
    game_manager.print_managers()
#endregion
            

# =========================================================
#region --- Routes ==========================================================================================================================================
@app.route(endpoint + '/game', methods=['GET'])
def get_game():
    if request.method == 'GET':
        s = DataRepository.read_game()
        return jsonify(s), 200
#endregion


# =========================================================
#region --- Socket IO ==========================================================================================================================================
@socketio.on('F2B_game_settings')
def all_game_settings(jsonObj):  # game settings
    print("--- Game settings ---")
    global player_count
    global etappe_count
    global finish_width

    # datetime ophalen
    now = datetime.now()
    # string van maken om split te kunnen doen
    x = str(now)
    # alles na "." hebben we niet nodig
    substring = x.split(".", 1)
    # enkel het eerste deel hebben we nodig yyyy-mm-dd hh:mm:ss
    dateToday = substring[0]

    # tekst = f('# players: {players}\n# etappes: {etappes}\nGroup name: {group}')
    # print(tekst)

    # gamesettings data naar de database sturen
    # gamesettings_to_datebase(players, etappes, group, dateToday)

    # global variabelen updaten met data van de frontend en daarna returnen
    player_count = jsonObj['countPlayer']
    etappe_count = jsonObj['countEtappe']
    group_name = jsonObj['groupName']
    finish_width = jsonObj['finishWidth']
    print(f'game_settings =>\n player_count = {list_beacons}\n etappe_count = {etappe_count}\n group_name = {group_name}\n finish_width = {finish_width}')


@socketio.on('F2B_player_settings')  # player settings
def all_player_settings(jsonObj):
    global playerName
    global teamName
    global list_beacons
    global list_players

    print(f'all_player_settings - {jsonObj}')

    list_players = jsonObj['beacons']
    filtered_list_beacon = []

    for jsonObj in list_players:
        name = jsonObj['name']
        team = jsonObj['team']
        uuid = jsonObj['uuid']
        print(f'name = {name} - team = {team} - uuid = {uuid}')
        #database_store_player(jsonObj)

    for player in list_players:
        for beacon in list_beacons:
            if beacon['uuid'] == player['uuid']:
                filtered_list_beacon.append(beacon)
                #database_store_beacon(beacon)
                break

    list_beacons = filtered_list_beacon
    print(f'list_beacons - {list_beacons}')
    print(f'list_players - {list_players}')


@socketio.on('F2B_send_player_count')  # sending player count to frontend
def send_player_count(data):
    # hier kijk ik of ik van de front een "ack" gestuurd krijg
    if data == "ack":
        emit_to_front()

    else:
        print("no ack found, not sending anything!")


@socketio.on('F2B_start_timer')  # start signal game
def start_the_race(data):
    if data == "start!":
        # StartLedstrip()
        print("STARTING LED")
        start_game_loop()
    else:
        print("no ack found, not sending anything!")
        

@socketio.on('F2B_settingsPage_loaded') # when settings page is loaded
def settings_loaded(data):
    print("SETTINGS PAGE LOADED")
    print(data)


@socketio.on('F2B_beacons_request')  # sending player count to frontend
def socket_beacons_request():
    # Roep de hardware scan op
    print("F2B_beacons_request - request for beacon scan received")
    global list_beacons

    list_beacons = scan_for_players()
    jsonDict = {'beacons' : list_beacons}
    print(f'jsonDict - {jsonDict}')
    socketio.emit('B2F_beacons_found', jsonDict, broadcast = True)

@socketio.on('F2B_leaderboard_loaded')
def leaderboard_loaded(data, etappe):
    global leaderboard

    if data == "ack":
        emit_to_leaderboard(etappe)

    else:
        print("Failed sending leaderboard data")
#endregion


# =========================================================
#region --- Socket IO - B2F ==========================================================================================================================================
def send_etappe_to_front(jsonObj): #Place player info in json
    player = None
    for p in list_players:
        if p['uuid'] == jsonObj['uuid']:
            player = p
            break

    #Stop if no player was found
    if player == None:
        return

    #Place player info in json
    jsonObj['name'] = p['name']
    jsonObj['team'] = p['team']

    #Send json to front
    print(f'Sending etappe to front:{jsonObj}')
    socketio.emit('B2F_etappe_done', jsonObj, broadcast = True)


def send_player_finish_to_front(jsonObj): #Place player info in json
    player = None
    for p in list_players:
        if p['uuid'] == jsonObj['uuid']:
            player = p
            break

    #Stop if no player was found
    if player == None:
        return

    #Place player info in json + also add to each etappe
    jsonObj['name'] = p['name']
    jsonObj['team'] = p['team']
    for e in jsonObj['etappes']:
        jsonObj['name'] = p['name']
        jsonObj['team'] = p['team']

    #Send json to front
    print(f'Sending etappe to front:{jsonObj}')
    socketio.emit('B2F_player_done', jsonObj, broadcast = True)


def emit_to_front():
    print("Sending to front")
    global player_count
    global etappe_count

    global playerName
    global teamName

    # game settings
    socketio.emit('B2F_game_settings',  {
                  "player_count": player_count, "etappe_count": etappe_count})

    socketio.emit("B2F_player_settings", {
                  "Playername": playerName, "Teamname": teamName})


def emit_to_leaderboard(etappe):
    print("Sending to leaderboard")
    s = DataRepository.read_leaderboard(etappe)
    socketio.emit("B2F_leaderboard_data", s)

    # player settings
#endregion


# =========================================================
#region --- Database ==========================================================================================================================================
def database_store_player(jsonObj):
    playerName = jsonObj['name']
    teamName = jsonObj['team']
    return

    DataRepository.insert_player(playerName, teamName)
    print(f"user {playerName} zit in team {teamName}")


def database_store_beacon(jsonObj):
    name = jsonObj['name']
    address = jsonObj['address']
    uuid = jsonObj['uuid']
    major = jsonObj['major']
    minor = jsonObj['minor']
    tx_power = jsonObj['txPower']
    return
    
    DataRepository.insert_player(playerName, teamName)
    print(f"user {playerName} zit in team {teamName}")


def gamesettings_to_datebase(player, etappe, group, date):
    DataRepository.insert_game(player, etappe, group, date)
    print('inserting into database')
#endregion


# =========================================================
#region --- App run ==========================================================================================================================================
if __name__ == '__main__':
    # app.run(host="0.0.0.0", port=5000, debug=True)
    socketio.run(app, host='0.0.0.0', port=5000, debug=True)
#endregion