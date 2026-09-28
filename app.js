// --- CONFIGURAÇÕES DE CONEXÃO ---
// IP do notebook onde o Mosquitto está rodando (lab 8.1)
const MQTT_HOST = "192.168.15.5";
const MQTT_PORT = 9001; // Porta WebSocket configurada no mosquitto.conf

// Tópicos exatos publicados pelo ESP32
const TOPIC_TEMP = "aulas/professor/temperatura";
const TOPIC_HUM  = "aulas/professor/umidade";
const TOPIC_AIR  = "aulas/professor/qualidade_ar";

// Criação do ID de Cliente único para o navegador
const clientID = "WebDash_" + Math.random().toString(16).substr(2, 8);

// Inicializa o cliente MQTT Paho
const client = new Paho.MQTT.Client(MQTT_HOST, Number(MQTT_PORT), clientID);

client.onConnectionLost = onConnectionLost;
client.onMessageArrived = onMessageArrived;

client.connect({
  onSuccess: onConnect,
  onFailure: onFailure
});

function onConnect() {
  const statusDiv = document.getElementById("status");
  statusDiv.innerText = "Status: Conectado ao Mosquitto";
  statusDiv.className = "status connected";

  client.subscribe(TOPIC_TEMP);
  client.subscribe(TOPIC_HUM);
  client.subscribe(TOPIC_AIR);
}

function onFailure(responseObject) {
  const statusDiv = document.getElementById("status");
  statusDiv.innerText = "Status: Falha na conexão (" + responseObject.errorMessage + ")";
  statusDiv.className = "status disconnected";
}

function onConnectionLost(responseObject) {
  if (responseObject.errorCode !== 0) {
    const statusDiv = document.getElementById("status");
    statusDiv.innerText = "Status: Conexão Perdida";
    statusDiv.className = "status disconnected";
  }
}

function onMessageArrived(message) {
  const topic = message.destinationName;
  const payload = message.payloadString;

  if (topic === TOPIC_TEMP) {
    document.getElementById("temp").innerText = payload;
  } else if (topic === TOPIC_HUM) {
    document.getElementById("hum").innerText = payload;
  } else if (topic === TOPIC_AIR) {
    document.getElementById("air").innerText = payload;
  }
}