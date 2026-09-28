#include <WiFi.h>
#include <PubSubClient.h>
#include <DHT.h>

// --- Hardware e Wi-Fi (Wokwi) ---
#define DHT_PIN 14
#define DHT_TYPE DHT22
#define WIFI_SSID "Wokwi-GUEST"
#define WIFI_PASS ""

// --- MQTT (broker público HiveMQ) ---
#define MQTT_SERVER "broker.hivemq.com"
#define MQTT_PORT 1883
#define CLIENT_ID "Projeto_IOT_WIFI_Prof_Tupi_987"

#define TOPIC_TEMP "aulas/professortupi/temperatura"
#define TOPIC_HUM  "aulas/professortupi/umidade"

DHT dht(DHT_PIN, DHT_TYPE);
WiFiClient espClient;
PubSubClient mqttClient(espClient);

unsigned long lastMsg = 0;
const long PUBLISH_INTERVAL = 5000;

void setup_wifi() {
  delay(10);
  Serial.print("Conectando a rede: ");
  Serial.println(WIFI_SSID);

  WiFi.begin(WIFI_SSID, WIFI_PASS);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("\nWiFi Conectado!");
  Serial.print("Endereço IP: ");
  Serial.println(WiFi.localIP());
}

void reconnect_mqtt() {
  while (!mqttClient.connected()) {
    Serial.print("Tentando conexão MQTT...");

    if (mqttClient.connect(CLIENT_ID)) {
      Serial.println(" Conectado!");
    } else {
      Serial.print(" Falha, rc=");
      Serial.print(mqttClient.state());
      Serial.println(" - Tentando novamente em 5 segundos...");
      delay(5000);
    }
  }
}

void publish_data(const char* topic, float value) {
  char payload[10];
  snprintf(payload, sizeof(payload), "%.2f", value);
  mqttClient.publish(topic, payload);

  Serial.print("Publicado em ");
  Serial.print(topic);
  Serial.print(": ");
  Serial.println(payload);
}

void setup() {
  Serial.begin(115200);
  dht.begin();
  setup_wifi();
  mqttClient.setServer(MQTT_SERVER, MQTT_PORT);
}

void loop() {
  if (!mqttClient.connected()) {
    reconnect_mqtt();
  }
  mqttClient.loop();

  unsigned long now = millis();
  if (now - lastMsg > PUBLISH_INTERVAL) {
    lastMsg = now;

    float temp = dht.readTemperature();
    float hum = dht.readHumidity();

    if (isnan(temp) || isnan(hum)) {
      Serial.println("Erro ao ler do sensor DHT!");
      return;
    }

    Serial.println("--- Dados do Sensor ---");
    publish_data(TOPIC_TEMP, temp);
    publish_data(TOPIC_HUM, hum);
  }
}
