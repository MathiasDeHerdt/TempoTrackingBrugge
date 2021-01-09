from mqtt_client import MqttClient
import sys

mqttClient = MqttClient()
   
def menu(keuze):
    global mqttClient
    if keuze == 1:
        mqttClient.sendMessage('{ "message" : "hello world" }')

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
    mqttClient.subscribe()
    run()