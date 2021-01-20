import paho.mqtt.client as mqtt
import json
import urllib.request


class MqttClient:
    def __init__(self, callback_subscribe):
        self.topic_publish = '/tempotracking4/pi_to_esp'
        self.topic_subscribe = '/tempotracking4/esp_to_pi'
        self.host = '169.254.10.1'
        self.host = '192.168.1.2' #address with router, still need to set static
        self.client = mqtt.Client()
        self.client.on_connect = self.on_connect
        self.client.on_message = self.on_message
        self.client.connect(self.host, 1883, 60)
        self.callback_subscribe = callback_subscribe


    def on_connect(self, client, userdata, flags, resultCode):
        print(f'Connected with result code {str(resultCode)}\n')


    def on_message(self, client, userdata, msg):
        #print(f"Topic: {msg.topic} - Payload: {str(msg.payload)}")
        self.callback_subscribe(msg)


    def sendMessage(self, message):
        print(f'Send message: {message}')
        self.client.publish(self.topic_publish, json.dumps(message))


    def subscribe(self):
        self.client.subscribe(self.topic_subscribe)
        self.client.loop_start()

    def unsubscribe(self):
        self.client.loop_stop()
        self.client.unsubscribe(self.topic_subscribe)

    def publish_to_pi(self, message):
        self.client.publish(self.topic_subscribe, message)