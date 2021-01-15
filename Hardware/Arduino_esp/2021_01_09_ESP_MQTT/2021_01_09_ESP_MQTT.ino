#include "WiFi.h"
#include <PubSubClient.h>
#include <ArduinoJson.h>

const char* ssid = "TempoTracking4";
const char* password =  "Tempo_4Brugge_5+";
//const IPAddress remote_ip(192,168,1,101);

const char* broker = "192.168.1.101";
const char* outTopic ="/tempotracking4/esp_to_pi";
const char* inTopic ="/tempotracking4/pi_to_esp";
long lastMsg = 0;

WiFiClient espClient;
PubSubClient client(espClient);

// SETUP
//----------------------------------------------------------------------------------------------------------------------
void setupWifi(){
   WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.println("Connecting to WiFi..");
  }

  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("Status: " + String(WiFi.status()));
  IPAddress ip = WiFi.localIP();
  Serial.println("IP address: " + IpAddress2String(ip));
  Serial.println(ip);
}

void setupMQTT(){
  client.setServer(broker, 1883);
  client.setCallback(callback);
}

void setup() {
  Serial.begin(115200);
  setupWifi();
  setupMQTT();
  TestJson();
}



// WIFI
//----------------------------------------------------------------------------------------------------------------------
String IpAddress2String(const IPAddress& ipAddress)
{
  return String(ipAddress[0]) + String(".") +\
  String(ipAddress[1]) + String(".") +\
  String(ipAddress[2]) + String(".") +\
  String(ipAddress[3])  ;
}



// MQTT
//----------------------------------------------------------------------------------------------------------------------
void callback(char* topic, byte* message, unsigned int lengthMessage) {
  Serial.println("Message arrived on topic: " + String(topic));
  JsonObject jsonObject = extractMessage(message, lengthMessage);

  if (String(topic) == inTopic) {
    String message = jsonObject["message"];
    Serial.println("Message: " + message);
  }
  else{
    Serial.println("Received message from unknown topic");
  }
}

void TestJson(){
  String input = "{\"sensor\":\"gps\",\"time\":152}";
  Serial.println(input);
  DynamicJsonDocument doc(1024);
  deserializeJson(doc, input);
  JsonObject obj = doc.as<JsonObject>();
  String testString = obj["sensor"];
  Serial.println(testString);
}

JsonObject extractMessage(byte* message, int lengthMessage){
  String  messageTemp;
  for (int i = 0; i < lengthMessage; i++) {
    messageTemp += String((char)message[i]);
  }
  
  messageTemp.trim();
  //messageTemp.replace("\\", "");
  //messageTemp.remove(0,1);
  //messageTemp.remove(messageTemp.length() - 1,1);
  Serial.println("Decoded: " + messageTemp);

  DynamicJsonDocument doc(1024);
  DeserializationError error = deserializeJson(doc, messageTemp);
  if (error) {
    Serial.print(F("deserializeJson() failed: "));
    Serial.println(error.f_str());
  }

  JsonObject jsonObject = doc.as<JsonObject>();
  return jsonObject;
}

void reconnect() {
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");     // Attempt to connect
    if (client.connect("ESP32Client")) {
      Serial.println("Connected");
      client.subscribe(inTopic);
    }
    else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");  // Wait 5 seconds before retrying
      delay(5000);
    }
  }
}


// LOOP
//----------------------------------------------------------------------------------------------------------------------
void loop() {
  if (!client.connected()) {
    reconnect();
  }
  client.loop();


  long now = millis();
  if (now - lastMsg > 5000) {
    lastMsg = now;

    char jsonStringOut[] = "{\"message\":\"Hello from ESP32\"}"; 
    client.publish(outTopic, jsonStringOut);
  }
}
