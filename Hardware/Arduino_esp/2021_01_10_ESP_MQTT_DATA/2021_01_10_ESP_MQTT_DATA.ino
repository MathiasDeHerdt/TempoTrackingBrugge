#include "WiFi.h"
#include <PubSubClient.h>

#include <BLEDevice.h>
#include <BLEUtils.h>
#include <BLEScan.h>
#include <BLEAdvertisedDevice.h>
#include <BLEUUID.h>
#include <BLEBeacon.h>

// BLE VARIABLES
int scanTime = 1; //In seconds
int delayLoop = 100;
BLEScan* pBLEScan;
const int MAJOR_DESIRED = 2;
const int MINOR_DESIRED = 10;
// WIFI VARIABLES
const char* ssid = "TempoTracking4";
const char* password =  "Tempo_4Brugge_5+";
WiFiClient espClient;
// MQTT VARIABLES
const char* broker = "192.168.1.101";
const char* outTopic ="/tempotracking4/esp_to_pi";
const char* inTopic ="/tempotracking4/pi_to_esp";
PubSubClient client(espClient);
// OTHER VARIABLES
long lastMsg = 0;

// BLE
//===================================================================================================================
class MyAdvertisedDeviceCallbacks: public BLEAdvertisedDeviceCallbacks {
      void onResult(BLEAdvertisedDevice advertisedDevice) {
        Serial.printf("\n Advertised Device: %s \n", advertisedDevice.toString().c_str());
      }
};

void setupBle(){
  Serial.println("Start BLE scanning....");

  BLEDevice::init("");
  pBLEScan = BLEDevice::getScan(); //create new scan
  //pBLEScan->setAdvertisedDeviceCallbacks(new MyAdvertisedDeviceCallbacks());
  pBLEScan->setActiveScan(true); //active scan uses more power, but get results faster
  pBLEScan->setInterval(100);
  pBLEScan->setWindow(99);  // less or equal setInterval value

  Serial.println("BLE scanning setup!");
}

void loopBLE() {
  // put your main code here, to run repeatedly:
  BLEScanResults foundDevices = pBLEScan->start(scanTime, false);
  Serial.println("Start scan!-----------------------------------------------------------------------------------------------");
  Serial.println("Devices found: " + String(foundDevices.getCount()) + " - scan done!");

  checkFoundBleDevices(foundDevices);
  delay(delayLoop);

  pBLEScan->clearResults();   // delete results fromBLEScan buffer to release memory
  Serial.println("Clear scan!-----------------------------------------------------------------------------------------------\n\n");
}

void checkFoundBleDevices(BLEScanResults foundDevices){
  int count = foundDevices.getCount();
  for (int i = 0; i < count; i++) {
    BLEAdvertisedDevice advertisedDevice = foundDevices.getDevice(i);
      
    BLEBeacon myBeacon;
    myBeacon.setData(advertisedDevice.getManufacturerData());
    int major = getMajor(myBeacon);
    int minor = getMinor(myBeacon);
  
    if(checkBeacon(major, minor))
    {
      extractBeacon(advertisedDevice, myBeacon);
    }
  }
}

int getMajor(BLEBeacon myBeacon){
    uint16_t majorUINT = myBeacon.getMajor();
    return majorUINT / 256;
}

int getMinor(BLEBeacon myBeacon){
    uint16_t minorUINT = myBeacon.getMinor();
    return minorUINT / 256;
}

bool checkBeacon(int major, int minor){
  if(MAJOR_DESIRED == major && MINOR_DESIRED == minor){
    return true;
  }
  return false;
}

void extractBeacon(BLEAdvertisedDevice advertisedDevice, BLEBeacon myBeacon){
  String nameDevice = advertisedDevice.getName().c_str();
  String address = advertisedDevice.getAddress().toString().c_str();
  int rssi = advertisedDevice.getRSSI();
  int txPower = advertisedDevice.getTXPower();
  int major = getMajor(myBeacon);
  int minor = getMinor(myBeacon);
  String stringUUID = "null";
  if(advertisedDevice.haveServiceUUID())
  {
    BLEUUID uuidObj = advertisedDevice.getServiceUUID();
    stringUUID = String(uuidObj.toString().c_str());
  }
          
  Serial.println("address:" + address + " name:" + nameDevice + "");
  Serial.println("rssi: " + String(rssi));
  Serial.println("txPower: " + String(txPower));
  Serial.println("major: " + String(major) + " minor: " + String(minor));
      
  String mqttAddress = "\"address\":\"" + address + "\"";
  String mqttName = "\"name\":\"" + nameDevice + "\"";
  String mqttRSSI = "\"rssi\":" + String(rssi);
  String mqttTx = "\"txPower\":" + String(txPower);
  String mqttMajor = "\"major\":" + String(major);
  String mqttMinor = "\"minor\":" + String(minor);
  String mqttUUID = "\"UUID\":\"" + stringUUID + "\"";
      
  String mqqtMessage = "{" ;
  mqqtMessage += mqttAddress + "," ;
  mqqtMessage += mqttName + "," ;
  mqqtMessage += mqttRSSI + "," ;
  mqqtMessage += mqttTx + "," ;
  mqqtMessage += mqttMajor + ",";
  mqqtMessage += mqttMinor + ",";
  mqqtMessage += mqttUUID;
  mqqtMessage +=  "}";
      
  sendMessageMqtt(mqqtMessage);
}

// WIFI
//===================================================================================================================
void setupWifi(){
   WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.println("Connecting to WiFi..");
  }

  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("Status: " + String(WiFi.status()));
  Serial.print(WiFi.localIP());
}

// MQTT
//===================================================================================================================
void setupMQTT(){
  client.setServer(broker, 1883);
  client.setCallback(callback);
}

void callback(char* topic, byte* message, unsigned int lengthMessage) {
  Serial.println("Message arrived on topic: " + String(topic));
  String messageString = extractMessage(message, lengthMessage);

  if (String(topic) == inTopic) {
    Serial.println("Message: " + messageString);
  }
  else{
    Serial.println("Received message from unknown topic");
  }
}

String extractMessage(byte* message, int lengthMessage){
  String messageTemp;
  for (int i = 0; i < lengthMessage; i++) {
    messageTemp += String((char)message[i]);
  }
  
  messageTemp.trim();
  return messageTemp;
}

void reconnect() {
  while (!client.connected()) {
    Serial.println("Attempting MQTT connection...");     // Attempt to connect
    if (client.connect("ESP32Client")) {
      Serial.println("Connected");
      client.subscribe(inTopic);
    }
    else {
      Serial.println("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");  // Wait 5 seconds before retrying
      delay(5000);
    }
  }
}

void checkConnected(){
  if (!client.connected()) {
    reconnect();
  }
  client.loop();
}

void sendMessageMqtt(String mqttMessage){
  int messageLength = mqttMessage.length() + 1; 
  char jsonStringOut[messageLength];
  mqttMessage.toCharArray(jsonStringOut, messageLength);
  client.publish(outTopic, jsonStringOut);
}

// MAIN
//===================================================================================================================
void setup() {
  Serial.begin(115200);
  setupWifi();
  setupMQTT();
  setupBle();
}

void loop() {
  checkConnected();
  loopBLE();
}
