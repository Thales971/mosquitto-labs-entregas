#!/usr/bin/env python3
"""Cliente MQTT simulado (substitui ESP32 físico) -> Mosquitto local Lab 7.1."""
import json
import random
import socket
import time

try:
    import paho.mqtt.client as mqtt
except ImportError:
    raise SystemExit("Instale: pip install paho-mqtt")

MQTT_HOST = "127.0.0.1"
MQTT_PORT = 1883
TOPIC_TEMP = "aulas/professor/temperatura"
TOPIC_HUM = "aulas/professor/umidade"
TOPIC_AIR = "aulas/professor/qualidade_ar"
INTERVAL = 3.0

def main():
    client_id = f"Grupo01_Cliente_SIM_{random.randint(0, 0xFFFF):04x}"
    client = mqtt.Client(client_id=client_id, protocol=mqtt.MQTTv311)
    client.connect(MQTT_HOST, MQTT_PORT, 60)
    client.loop_start()
    print(f"Conectado ao Mosquitto local {MQTT_HOST}:{MQTT_PORT} como {client_id}")
    print(f"Publicando em {TOPIC_TEMP}, {TOPIC_HUM}, {TOPIC_AIR} a cada {INTERVAL}s")
    print("(Ctrl+C para parar)\n")
    try:
        while True:
            temp = round(22.0 + random.uniform(-1.5, 8.0), 1)
            hum = round(45.0 + random.uniform(-5.0, 25.0), 1)
            gas = int(random.uniform(400, 2200))
            client.publish(TOPIC_TEMP, f"{temp:.1f}")
            client.publish(TOPIC_HUM, f"{hum:.1f}")
            client.publish(TOPIC_AIR, str(gas))
            led = "ON" if (temp > 30.0 or gas > 1800) else "OFF"
            print(f"Temp: {temp:.1f} C | Umid: {hum:.1f} % | Ar: {gas} | LED={led}")
            time.sleep(INTERVAL)
    except KeyboardInterrupt:
        print("\nEncerrado.")
    finally:
        client.loop_stop()
        client.disconnect()

if __name__ == "__main__":
    main()
