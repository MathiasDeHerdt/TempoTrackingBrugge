#include "WiFi.h"

const char* ssid = "rpi-hotspot";
const char* password =  "rasp-p@s2w0rd";

void setup() {
  Serial.begin(115200);
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.println("Connecting to WiFi..");
  }

  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: " + String(WiFi.localIP()));
}


void loop() {
  while(true) {
    delay(1000); // Delay a second between loops.
  }

  Serial.println();
  Serial.println("closing connection");
}
