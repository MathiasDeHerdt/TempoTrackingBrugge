/*
   Based on Neil Kolban example for IDF: https://github.com/nkolban/esp32-snippets/blob/master/cpp_utils/tests/BLE%20Tests/SampleScan.cpp
   Ported to Arduino ESP32 by Evandro Copercini
*/

#include <BLEDevice.h>
#include <BLEUtils.h>
#include <BLEScan.h>
#include <BLEAdvertisedDevice.h>

//http://www.neilkolban.com/esp32/docs/cpp_utils/html/class_b_l_e_advertised_device.html
int scanTime = 1; //In seconds
BLEScan* pBLEScan;

class MyAdvertisedDeviceCallbacks: public BLEAdvertisedDeviceCallbacks {
    void onResult(BLEAdvertisedDevice advertisedDevice) {
      int rssi = advertisedDevice.getRSSI();
      int txPower = advertisedDevice.getTXPower();
      String nameDevice = advertisedDevice.getName().c_str();
      String address = advertisedDevice.getAddress().toString().c_str();
      float distance = DistanceFromRssi(txPower, rssi);
      
      Serial.printf("Advertised Device: %s \n", advertisedDevice.toString().c_str());
      Serial.printf("Device Name: %s  Adress: %s \\n", nameDevice, address);
      Serial.printf("TxPower: %s RSSI: %s \n", String(txPower), String(rssi));
      Serial.printf("Distance: %s m \n", String(distance));
    }
  
    float DistanceFromRssi(float txPower, float rssi){
      //https://iotandelectronics.wordpress.com/2016/10/07/how-to-calculate-distance-from-the-rssi-value-of-the-ble-beacon/
      txPower = -65; //txpower
      float N = 2; //range2 - 4 
      float distance = pow(10,((txPower - rssi) / (10 * N)));
      return distance;
    }
};


void setup() {
  Serial.begin(115200);
  Serial.println("Scanning...");

  BLEDevice::init("");
  pBLEScan = BLEDevice::getScan(); //create new scan
  pBLEScan->setAdvertisedDeviceCallbacks(new MyAdvertisedDeviceCallbacks());
  pBLEScan->setActiveScan(true); //active scan uses more power, but get results faster
  pBLEScan->setInterval(100);
  pBLEScan->setWindow(99);  // less or equal setInterval value
}

void loop() {
  // put your main code here, to run repeatedly:
  BLEScanResults foundDevices = pBLEScan->start(scanTime, false);
  Serial.print("Devices found: ");
  Serial.println(foundDevices.getCount());
  Serial.println("Scan done!");
  pBLEScan->clearResults();   // delete results fromBLEScan buffer to release memory
  delay(200);
}


//https://forum.arduino.cc/index.php?topic=571087.0
