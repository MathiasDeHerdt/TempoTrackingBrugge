import paho.mqtt.client as mqtt
import json
import urllib.request
import sys


def on_connect(client, userdata, flags, rc):
    print("Connected with result code "+str(rc))


def on_message(client, userdata, msg):
    print(msg.topic+" "+str(msg.payload))


def menu(keuze):
    if keuze == 1:
        sendMessage()

    if keuze == 9:
        sys.exit()


def sendMessage():
    bericht = "hey from python"

    client.publish('test/message', json.dumps(bericht))


def run():
    keuze = 0
    while keuze != 9:
        print("\n\nChoose an option:")
        print("1. send message")
        print("9. Exit")
        keuze = int(input())
        menu(keuze)


if __name__ == '__main__':
    client = mqtt.Client()
    client.on_connect = on_connect
    client.on_message = on_message
    client.connect("169.254.10.1", 1883, 60)
    client.subscribe("test/message")
    client.loop_start()
    # client.loop_forever()
    run()
