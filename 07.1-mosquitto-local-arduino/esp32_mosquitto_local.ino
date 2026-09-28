#include <WiFi.h>
#include <PubSubClient.h>
#include <DHT.h>

// --- 1. PINAGEM DO HARDWARE FÃSICO ---
#define DHT_PIN 14
#define DHT_TYPE DHT11
#define MQ135_PIN 34
#define LED_PIN 2

// --- 2. REDE E BROKER LOCAL (preencher no PC) ---
const char* WIFI_SSID = "NOME_DO_WIFI";
const char* WIFI_PASS = "SENHA_DO_WIFI";

// IP do notebook (ipconfig). Exemplo anterior do lab: 192.168.15.10
const char* MQTT_SERVER = "192.168.15.5";
const int MQTT_PORT = 1883;

const char* TOPIC_TEMP = "aulas/professor/temperatura";
const char* TOPIC_HUM  = "aulas/professor/umidade";
const char* TOPIC_AIR  = "aulas/professor/qualidade_ar";

DHT dht(DHT_PIN, DHT_TYPE);
WiFiClient espClient;
PubSubClient mqttClient(espClient);

unsigned long lastMsg = 0;
const long PUBLISH_INTERVAL = 3000;

void setup_wifi() {
  delay(10);
  Serial.println();
  Serial.print("Conectando ao Wi-Fi: ");
  Serial.println(WIFI_SSID);

  WiFi.begin(WIFI_SSID, WIFI_PASS);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("\nWi-Fi Conectado!");
  Serial.print("IP do ESP32: ");
  Serial.println(WiFi.localIP());
}

void reconnect_mqtt() {
  while (!mqttClient.connected()) {
    Serial.print("Conectando ao Mosquitto Local (");
    Serial.print(MQTT_SERVER);
    Serial.print(")...");

    String clientId = "Grupo01_Cliente_";
    clientId += String(random(0xffff), HEX);

    if (mqttClient.connect(clientId.c_str())) {
      Serial.println(" Conectado com Sucesso!");
    } else {
      Serial.print(" Falha, rc=");
      Serial.print(mqttClient.state());
      Serial.println(" Tentando novamente em 5s...");
      delay(5000);
    }
  }
}

void setup() {
  Serial.begin(115200);
  pinMode(LED_PIN, OUTPUT);
  pinMode(MQ135_PIN, INPUT);
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
    int gas = analogRead(MQ135_PIN);

    if (isnan(temp) || isnan(hum)) {
      Serial.println("Erro de leitura no sensor DHT11!");
      return;
    }

    if (temp > 30.0 || gas > 1800) {
      digitalWrite(LED_PIN, HIGH);
    } else {
      digitalWrite(LED_PIN, LOW);
    }

    // Corrigido: guia usava gas (variÃ¡vel inexistente)
    Serial.printf("Temp: %.1f C | Umid: %.1f %% | Ar: %d\n", temp, hum, gas);

    char payloadTemp[8], payloadHum[8], payloadAir[8];
    snprintf(payloadTemp, sizeof(payloadTemp), "%.1f", temp);
    snprintf(payloadHum, sizeof(payloadHum), "%.1f", hum);
    snprintf(payloadAir, sizeof(payloadAir), "%d", gas);

    mqttClient.publish(TOPIC_TEMP, payloadTemp);
    mqttClient.publish(TOPIC_HUM, payloadHum);
    mqttClient.publish(TOPIC_AIR, payloadAir);
  }
}


