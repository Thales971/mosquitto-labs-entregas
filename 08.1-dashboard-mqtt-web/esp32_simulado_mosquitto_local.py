"""Simula ESP32 publicando temperatura/umidade/qualidade_ar no Mosquitto local (lab 8.1)."""
import time
import random
import paho.mqtt.client as mqtt

BROKER = "127.0.0.1"
PORT = 1883
TOPICS = {
    "aulas/professor/temperatura": lambda: f"{random.uniform(22.0, 28.0):.1f}",
    "aulas/professor/umidade": lambda: f"{random.uniform(45.0, 70.0):.1f}",
    "aulas/professor/qualidade_ar": lambda: str(random.randint(800, 1800)),
}

client = mqtt.Client(mqtt.CallbackAPIVersion.VERSION2, client_id="esp32_sim_lab81")
client.connect(BROKER, PORT, 60)
client.loop_start()
print(f"Publicando em {BROKER}:{PORT} (Ctrl+C para parar)", flush=True)
try:
    while True:
        for topic, gen in TOPICS.items():
            val = gen()
            client.publish(topic, val, qos=0)
            print(f"{topic} -> {val}", flush=True)
        time.sleep(3)
except KeyboardInterrupt:
    pass
finally:
    client.loop_stop()
    client.disconnect()