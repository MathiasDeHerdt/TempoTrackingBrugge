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


# =========================================================
# Import - custom imports
# =========================================================
from repo.datarepo import DataRepository


# =========================================================
# Import - hardware
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
playercount = 0
etappecount = 0

playerName = ""
teamName = ""


is_game_running = False
finish_width = 0
player_finished_count = 0


# =========================================================
# Global variables - Hardware
# =========================================================
game_manager = GameManager()


# =========================================================
# Hardware functions
# =========================================================
def StartLedstrip():
    print("Ledstrip is starting")
    os.system('sudo python3 /home/cortana/tempotrack/backend/helpers/rgb.py')
    print("Done!")


def scan_for_players():
    #get a list of beacons within range
    list_beacons = game_manager.scan_for_players()


def start_game_loop(player_array):
    #start the game loop
    global game_manager
    global is_game_running
    global etappecount
    global finish_width

    game_manager.initialize_game(
        etappecount, 
        finish_width, 
        player_array, 
        callback_game_player_etappe, 
        callback_game_player_finish)

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
    global player_finished_count

    print(f'Etappe done - game callback! - {callObj}')
    player_finished_count += 1


def callback_game_player_finish(callObj):
    #callback when a player finished all of his/her etappes
    print(f'Finished! - game callback! - {callObj}')
    game_check_end()


def game_check_end():
    #check for condition for the game to end
    global player_finished_count
    global playercount
    global is_game_running
    
    if (player_finished_count >= playercount):
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
def all_game_settings(players, etappes, group):  # game settings
    print("--- Game settings ---")
    global playercount
    global etappecount

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
    playercount = players
    etappecount = etappes

    return playercount, etappecount


@socketio.on('F2B_player_settings')  # player settings
def all_player_settings(name, team):
    global playerName
    global teamName

    playerName = name
    teamName = team

    for i in range(len(playerName)):
        DataRepository.insert_player(playerName[i], teamName[i])
        print(f"user {playerName[i]} zit in team {teamName[i]}")

    return playerName, playercount


@socketio.on('F2B_send_player_count')  # sending player count to frontend
def send_player_count(data):
    # hier kijk ik of ik van de front een "ack" gestuurd krijg
    if data == "ack":   
        emit_to_front()

    else:
        print("no ack found, not sending anything!")


@socketio.on('F2B_start_timer')  # sending player count to frontend
def start_the_race(data):
    if data == "start!":
        # StartLedstrip()
        print("STARTING LED")

    else:
        print("no ack found, not sending anything!")


# gaat data naar frontend sturen
def emit_to_front():
    print("Sending to front")
    global playercount
    global etappecount

    global playerName
    global teamName

    # game settings
    socketio.emit('B2F_game_settings',  {
                  "Playercount": playercount, "Etappecount": etappecount})

    socketio.emit("B2F_player_settings", {
                  "Playername": playerName, "Teamname": teamName})

    # player settings
# =========================================================
# sending data to database
# =========================================================


def gamesettings_to_datebase(player, etappe, group, date):
    DataRepository.insert_game(player, etappe, group, date)
    print('inserting into database')


# =========================================================
# App run
# =========================================================
if __name__ == '__main__':
    # app.run(host="0.0.0.0", port=5000, debug=True)
    socketio.run(app, host='0.0.0.0', port=5000, debug=True)
