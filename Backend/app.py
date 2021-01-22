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

CORS(app)

socketio = SocketIO(app, cors_allowed_origins='*')

endpoint = '/api/v1'

# =========================================================
# Global variables
# =========================================================
player_count = 0
etappe_count = 0

playerName = ""
teamName = ""


is_game_running = False
finish_width = 0
player_finished_count = 0

list_beacons = []
list_uuid = []


# =========================================================
# Global variables - Hardware
# =========================================================
game_manager = GameManager()


# =========================================================
# Hardware functions
# =========================================================
def start_led_strip():
    print("Ledstrip starting")
    os.system('sudo python3 /home/pialex/TempoTrackingBrugge/Backend/backend_hardware/helpers/rgb.py')


def scan_for_players():
    #get a list of beacons within range
    scanned_beacons = game_manager.scan_for_players()
    list_beacons = []

    for beaconObj in scanned_beacons:
        jsonObj = {
            'address' : beaconObj.address,
            'name' : beaconObj.name,
            'uuid' : beaconObj.uuid,
            'txPower' : beaconObj.txPower,
            'major' : beaconObj.major,
            'minor' : beaconObj.minor
        }
        list_beacons.append(jsonObj)

    return list_beacons



def start_game_loop():
    #start the game loop
    global game_manager
    global is_game_running
    global etappe_count
    global finish_width
    global list_uuid

    #reset_game()
    print(f'Initializing game')
    game_manager.initialize_game(
        etappe_count, 
        finish_width, 
        list_uuid, 
        callback_game_player_etappe, 
        callback_game_player_finish
        )

    time.sleep(2)
    print(f'Starting game')
    game_manager.start_game_loop()
    is_game_running = True


def stop_game_loop():
    #stop the running game
    global game_manager

    game_manager.stop_game_loop()


def reset_game():
    #clear variables for the game loop
    global is_game_running
    global player_finished_count
    global game_manager

    is_game_running = False
    player_finished_count = 0
    game_manager.clear_results()


def clear_game_full():
    #clear variables for the game loop
    global is_game_running
    global player_finished_count
    global game_manager

    is_game_running = False
    player_finished_count = 0
    game_manager.clear()


def callback_game_player_etappe(callObj):
    #callback when a player finished a etappe
    print(f'Etappe done - game callback! - {callObj}')


def callback_game_player_finish(callObj):
    #callback when a player finished all of his/her etappes
    global player_finished_count
    
    print(f'Finished! - game callback! - {callObj}')
    player_finished_count += 1
    game_check_end()


def game_check_end():
    #check for condition for the game to end
    global player_finished_count
    global player_count
    global is_game_running
    
    if (player_finished_count >= player_count):
        is_game_running = False
        stop_game_loop()


def debug_game_manager():
    #print the game managers for debug
    global game_manager
    game_manager.print_managers()
            

# =========================================================
# Routes
# =========================================================


@app.route(endpoint + '/game', methods=['GET'])
def get_game():
    if request.method == 'GET':
        s = DataRepository.read_game()
        return jsonify(s), 200

# =========================================================
# socketio communication between front and back
# =========================================================


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

    return player_count, etappe_count


@socketio.on('F2B_player_settings')  # player settings
def all_player_settings(jsonObj):
    global playerName
    global teamName
    global list_beacons
    global list_uuid

    print(f'all_player_settings - {jsonObj}')

    received_list = jsonObj['beacons']
    list_uuid = []
    filtered_list_beacon = []

    for jsonObj in received_list:
        name = jsonObj['name']
        team = jsonObj['team']
        uuid = jsonObj['uuid']
        print(f'name = {name} - team = {team} - uuid = {uuid}')

        list_uuid.append(uuid)
        database_store_player(jsonObj)

    for uuid in list_uuid:
        for beacon in list_beacons:
            if beacon['uuid'] == uuid:
                filtered_list_beacon.append(beacon)
                database_store_beacon(beacon)
                break

    list_beacons = filtered_list_beacon
    print(f'list_beacons - {list_beacons}')
    print(f'list_uuid - {list_uuid}')


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
        

@socketio.on('F2B_settingsPage_loaded')
def settings_loaded(data):
    print("SETTINGS PAGE LOADED")
    print(data)


# gaat data naar frontend sturen
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

    # player settings


# =========================================================
# Frontent functions - socket - Alex
# =========================================================
@socketio.on('F2B_beacons_request')  # sending player count to frontend
def socket_beacons_request():
    # Roep de hardware scan op
    print("F2B_beacons_request - request for beacon scan received")
    global list_beacons

    list_beacons = scan_for_players()
    jsonDict = {'beacons' : list_beacons}
    print(f'jsonDict - {jsonDict}')
    socketio.emit('B2F_beacons_found', jsonDict) #, broadcast = True)


# =========================================================
# database functions - sending data to database
# =========================================================
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


# =========================================================
# App run
# =========================================================
if __name__ == '__main__':
    # app.run(host="0.0.0.0", port=5000, debug=True)
    socketio.run(app, host='0.0.0.0', port=5000, debug=True)
