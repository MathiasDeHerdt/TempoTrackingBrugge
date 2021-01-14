# =========================================================
# Import - libraries
# =========================================================
from flask import Flask, request, jsonify
from flask_socketio import SocketIO, send, emit
import random
from flask_cors import CORS


# =========================================================
# Import - custom imports
# =========================================================
from Repository.DataRepository import DataRepository


# =========================================================
# Start apps
# =========================================================
app = Flask(__name__)
app.config['SECRET_KEY'] = 'tempotracking'

CORS(app)

socketio = SocketIO(app, cors_allowed_origins='*')


endpoint = '/api/v1'


# =========================================================
# Routes
# =========================================================
@app.route(endpoint + '/beacon', methods=['GET'])
def get_beacon():
    if request.method == 'GET':
        s = DataRepository.read_beacon()
        return jsonify(s), 200


@app.route(endpoint + '/player', methods=['GET'])
def get_player():
    if request.method == 'GET':
        s = DataRepository.read_player()
        return jsonify(s), 200


@app.route(endpoint + '/result', methods=['GET'])
def get_result():
    if request.method == 'GET':
        s = DataRepository.read_result()
        return jsonify(s), 200


@app.route(endpoint + '/beacon_player', methods=['GET'])
def get_beacon_player():
    if request.method == 'GET':
        s = DataRepository.read_beacon_player()
        return jsonify(s), 200


@app.route(endpoint + '/player_result', methods=['GET'])
def get_player_result():
    if request.method == 'GET':
        s = DataRepository.read_player_result()
        return jsonify(s), 200


@app.route(endpoint + '/all', methods=['GET'])
def get_all_tables():
    if request.method == 'GET':
        s = DataRepository.read_all_tables()
        return jsonify(s), 200


# =========================================================
# App run
# =========================================================
if __name__ == '__main__':
    # app.run(host="0.0.0.0", port=5000, debug=True)
    socketio.run(app, host='0.0.0.0', port=5000, debug=True)
