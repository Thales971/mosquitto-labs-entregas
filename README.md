# Dashboard MQTT (HTML + CSS + JS)

Dashboard web em tempo real para Mosquitto via **WebSockets** (Paho MQTT).

## Arquivos

- `index.html` — estrutura da página
- `style.css` — estilos dos cards
- `app.js` — conexão MQTT e atualização dos valores

## Configuração

Em `app.js`, ajuste se precisar:

```js
const MQTT_HOST = "192.168.15.5";
const MQTT_PORT = 9001;
```

Mosquitto precisa ter:

```
listener 9001
protocol websockets
```

## Como abrir

Abra `index.html` no navegador (ou sirva a pasta com um server HTTP local).