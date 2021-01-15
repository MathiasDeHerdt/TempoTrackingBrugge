#!/usr/bin/env python3

import sys
from mqtt_client import MqttClient

   
def menu(keuze):
    global mqttClient
    if keuze == 1:
        mqttClient.sendMessage("{\"message\":\"hello world\"}")

    if keuze == 9:
        sys.exit()


def run():
    keuze = 0
    while keuze != 9:
        print("\n\nChoose an option:")
        print("1. send message")
        print("9. Exit")
        keuze = int(input())
        menu(keuze)


if __name__ == '__main__':
    print(sys.path)
    try:
        print("Start program!...")
        mqttClient = MqttClient()
        mqttClient.subscribe()
        run()
        print("finish program")
    except Exception as e:
        print("An exception occurred") 
        print(e)