import paho.mqtt.client as mqtt
import json
import urllib.request

from ble_helper import BleHelper
from ble_beacon import BleBeacon

class MqttClient:
    def __init__(self):
        self.topic_publish = '/tempotracking4/pi_to_esp'
        self.topic_subscribe = '/tempotracking4/esp_to_pi'
        self.host = '169.254.10.1'
        self.host = '192.168.1.101' #address with router, still need to set static
        self.client = mqtt.Client()
        self.client.on_connect = self.on_connect
        self.client.on_message = self.on_message
        self.client.connect(self.host, 1883, 60)


    def on_connect(self, client, userdata, flags, resultCode):
        print(f'Connected with result code {str(resultCode)}\n')


    def on_message(self, client, userdata, msg):
        print(f"Topic: {msg.topic} - Payload: {str(msg.payload)}")
        beacon = self.create_beacon(msg.payload)
        beacon.debug()


    def sendMessage(self, message):
        print(f'Send message: {message}')
        self.client.publish(self.topic_publish, json.dumps(message))


    def subscribe(self):
        self.client.subscribe(self.topic_subscribe)
        self.client.loop_start()

    def create_beacon(self, payload):
        return BleBeacon(payload)