import paho.mqtt.client as mqtt
import json
import urllib.request


class MqttClient:
    def __init__(self):
        self.topic_publish = 'test/message'
        self.topic_subscribe = 'test/message'
        self.host = '169.254.10.1'
        self.client = mqtt.Client()
        self.client.on_connect = self.on_connect
        self.client.on_message = self.on_message
        self.client.connect(self.host, 1883, 60)


    def on_connect(self, client, userdata, flags, resultCode):
        print("Connected with result code " + str(resultCode))


    def on_message(self, client, userdata, msg):
        print( f"Topic: {msg.topic} - Payload: {str(msg.payload)}")


    def sendMessage(self, message):
        print(f'Send message: {message}')
        self.client.publish(self.topic_publish, json.dumps(message))


    def subscribe(self):
        self.client.subscribe(self.topic_subscribe)
        self.client.loop_start()