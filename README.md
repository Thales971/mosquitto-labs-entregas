# Mosquitto Labs — Entregas (Senai)

Repositório com as entregas das atividades de **MQTT / Mosquitto** do curso.

**Aluno:** Thales Torsatto (`Thales971`)  
**Instituição:** Senai Valinhos

## Labs inclusas

| Pasta | Atividade |
|-------|-----------|
| `00-broker-instalacao` | Instalação e configuração do Mosquitto (listener 1883, firewall, testes pub/sub) |
| `05.1-celular-mqtt` | PC ↔ celular nos tópicos `teste/do_pc` e `teste/do_celular` |
| `06.1-wokwi-hivemq` | ESP32 + DHT22 no Wokwi → HiveMQ + MQTTX (`aulas/professortupi/...`) |
| `07.1-mosquitto-local-arduino` | Sketch Arduino + Mosquitto **local** (`aulas/professor/...`); simulador se sem hardware |
| `08.1-dashboard-mqtt-web` | WebSockets porta **9001** + dashboard HTML/JS (Paho) |

## Observações

- Prints de terminal são de **Prompt/CMD reais** do Windows.
- Nas labs 7.1 e 8.1, sem ESP32/DHT físico em casa: publicação nos tópicos via simulador Python; broker, WebSockets e dashboard são reais.
- IP local usado nas labs recentes: `192.168.15.5` (pode mudar — conferir com `ipconfig`).

## Como abrir o dashboard (8.1)

1. Mosquitto com `listener 9001` + `protocol websockets`
2. Publicar nos tópicos (ESP ou `esp32_simulado_mosquitto_local.py`)
3. Abrir `08.1-dashboard-mqtt-web/dashboard_mqtt/index.html` (ajustar `MQTT_HOST` se o IP mudou)