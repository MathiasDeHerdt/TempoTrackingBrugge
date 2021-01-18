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


# =========================================================
# Hardware functions
# =========================================================
def StartLedstrip():
    print("Ledstrip is starting")
    os.system('sudo python3 /home/cortana/tempotrack/backend/helpers/rgb.py')
    print("Done!")

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

    tekst = f'# players: {players}\n# etappes: {etappes}\nGroup name: {group}'
    print(tekst)

    # gamesettings data naar de database sturen
    # gamesettings_to_datebase(players, etappes, group, dateToday)

    # global variabelen updaten met data van de frontend en daarna returnen
    playercount = players
    etappecount = etappes

    return playercount, etappecount


@socketio.on('F2B_player_settings')  # player settings
def all_player_settings(name, team):
    print("--- Player settings ---")
    tekst = f'Player name: {name}\nTeam name: {team}'
    print(tekst)


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
    global playercount
    global etappecount

    # game settings
    socketio.emit('B2F_game_settings',  {
                  "Playercount": playercount, "Etappecount": etappecount})

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
