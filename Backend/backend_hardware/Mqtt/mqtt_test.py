#!/usr/bin/env python3

import math
import sys
import time
from mqtt_client import MqttClient
from Helpers.ble_beacon import BleBeacon
from MathProject import math_race

list_beacon_esp_1 = []
list_beacon_esp_2 = []
   
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


def callback_mqtt(msg):
    beacon = BleBeacon(msg.payload)
    #beacon.debug()
    if(beacon.deviceId =="device_esp_1"):
        list_beacon_esp_1.append(beacon)
    else:
        list_beacon_esp_2.append(beacon)


if __name__ == '__main__':
    print(sys.path)
    try:
        print("Start program!...")
        mqttClient = MqttClient(callback_mqtt)
        mqttClient.subscribe()

        time.sleep(10)
        index1 = len(list_beacon_esp_1) - 1
        b1 = list_beacon_esp_1[index1]
        index2 = len(list_beacon_esp_2) - 1
        b2 = list_beacon_esp_2[index2]

        a = b1.distance
        b = b2.distance
        c = 0.5

        angle_a = math_race.get_triangle_corner_angle(a, b, c)
        angle_b = math_race.get_triangle_corner_angle(b, c, a)
        angle_c = math_race.get_triangle_corner_angle(c, a, b)
        print(f'angle_a = {angle_a} - {math.degrees(angle_a)}')
        print(f'angle_b = {angle_b} - {math.degrees(angle_b)}')
        print(f'angle_c = {angle_c} - {math.degrees(angle_c)}')


        distance_to_finish = math_race.get_triangle_height(b, angle_a)
        print(f'Distance to finish: {distance_to_finish}m')

        run()
        print("finish program")
    except Exception as e:
        print("An exception occurred") 
        print(e)