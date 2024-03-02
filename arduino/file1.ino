
#include <ESP8266WiFi.h>
#include <Wire.h>
#include <MFRC522.h>
#include <ESP8266HTTPClient.h>
#include <ArduinoJson.h>

#define SS_PIN 0
#define RST_PIN 2

MFRC522 mfrc522(SS_PIN, RST_PIN);
const char *ssid = "hamro_wifi";
const char *password = "Hello@3691";
const char *serverUrlVerify = "http://192.168.1.74:5001/items/verifyUID";
const char *serverUrlAddItem = "http://192.168.1.74:5001/items/checked";

void setup() {
  Serial.begin(115200);
  connectToWiFi();
  SPI.begin();
  mfrc522.PCD_Init();
}

void connectToWiFi() {
  Serial.println("Connecting to WiFi...");
  WiFi.begin(ssid, password);
  int attemptCounter = 0;

  while (WiFi.status() != WL_CONNECTED && attemptCounter < 20) {
    delay(1000);
    Serial.print(".");
    attemptCounter++;
  }

  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\nConnected to WiFi");
  } else {
    Serial.println("\nFailed to connect to WiFi. Check your credentials.");
  }
}

String readCardUID() {
  String cardUID = "";

  if (mfrc522.PICC_IsNewCardPresent() && mfrc522.PICC_ReadCardSerial()) {
    for (byte i = 0; i < mfrc522.uid.size; i++) {
      cardUID += String(mfrc522.uid.uidByte[i] < 0x10 ? "0" : "");
      cardUID += String(mfrc522.uid.uidByte[i], HEX);
    }

    mfrc522.PICC_HaltA();
    mfrc522.PCD_StopCrypto1();
  }

  return cardUID;
}

bool verifyUser(String uid) {
  StaticJsonDocument<200> jsonDocument;
  jsonDocument["userID"] = uid;

  String jsonString;
  serializeJson(jsonDocument, jsonString);

  HTTPClient http;
  WiFiClient wifiClient;
  http.begin(wifiClient, serverUrlVerify);
  http.addHeader("Content-Type", "application/json");
  Serial.println("Verifying user...");

  int httpCode = http.POST(jsonString);
  Serial.println("Verification Response Code: " + String(httpCode));

  if (httpCode == HTTP_CODE_OK) {
    String response = http.getString();
    Serial.println("Verification Response: " + response);
    return response == "correct";
  } else {
    Serial.println("Verification failed");
    return false;
  }

  http.end();
}

void loop() {
  if (WiFi.status() == WL_CONNECTED) {
    String uid = readCardUID();

    if (uid.length() > 0 && verifyUser(uid)) {
      Serial.println("Card UID: " + uid);

      // Create a JSON document for the item information
      StaticJsonDocument<200> jsonDocument;
      jsonDocument["userID"] = uid;

      String jsonString;
      serializeJson(jsonDocument, jsonString);

      // Send the item information to the server
      HTTPClient http;
      WiFiClient wifiClient;
      http.begin(wifiClient, serverUrlAddItem);
      http.addHeader("Content-Type", "application/json");
      Serial.println("Connecting to server...");
        Serial.println(jsonString);
      int httpCode = http.POST(jsonString);
      Serial.println("Server Response Code: " + String(httpCode));

      if (httpCode == HTTP_CODE_OK) {
        // Process server response as needed
        String response = http.getString();
        Serial.println("Server Response: " + response);

        // Parse the response JSON
   // Parse the response JSON
DynamicJsonDocument responseJson(200);
deserializeJson(responseJson, response);

// Check if the response is an array
if (responseJson.is<JsonArray>()) {
  JsonArray itemsArray = responseJson.as<JsonArray>();

  // Iterate over the array
  for (JsonVariant item : itemsArray) {
    // Get itemID and quantity for each item
    String itemID = item["item_id"].as<String>();
    int quantity = item["quantity"].as<int>();

    Serial.println("Item: " + itemID);
    Serial.println("Quantity: " + String(quantity));
  }
} else {
  // Handle the case where the response is not an array
  Serial.println("Invalid response format. Expected an array.");
}

        // Add your actions for itemID and quantity here
      } else {
        Serial.println("HTTP request failed");
      }

      http.end();
    }

    delay(1000); // Adjust delay as needed
  } else {
    // Attempt to reconnect if not connected
    connectToWiFi();
  }
}