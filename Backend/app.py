# =========================================================
# Import - libraries
# =========================================================
from flask import Flask, request, jsonify
import random
from flask_cors import CORS


# =========================================================
# Import - custom imports
# =========================================================
from Repository.datarepository import DataRepository


# =========================================================
# Start apps
# =========================================================
app = Flask(__name__)
CORS(app)

endpoint = '/api/v1'


# =========================================================
# Routes
# =========================================================
@app.route(endpoint + '/team', methods=['GET'])
def get_team():
  if request.method == 'GET':
    s = DataRepository.read_team()
    return jsonify(s), 200

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


# =========================================================
# App run
# =========================================================
if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000, debug=True)