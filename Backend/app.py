# Imports
from flask import Flask, request, jsonify
import random
from flask_cors import CORS

# Custom imports
from Repository.datarepository import DataRepository

# Start app
app = Flask(__name__)
CORS(app)


endpoint = '/api/v1'


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


if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000, debug=True)
