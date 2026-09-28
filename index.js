/* EstaÃ§Ã£o IoT 2TDS2 â€” Lab 9.1 â€” MQTT Paho WebSocket */

(function () {
  "use strict";

  var MQTT_HOST = "192.168.15.5";
  var MQTT_WS_PORT = 9001;
  var SENHA_KEY = "senhaGrupo";
  var SENHA_PLACEHOLDER = "ITCOI-2TDS2-FELIPE";

  var TOPICS = [
    "aulas/professor/temperatura",
    "aulas/professor/umidade",
    "aulas/professor/qualidade_ar"
  ];

  var client = null;
  var reconnectTimer = null;

  var elStatusDot = document.getElementById("status-dot");
  var elStatusTexto = document.getElementById("status-texto");
  var elTemp = document.getElementById("val-temp");
  var elUmid = document.getElementById("val-umid");
  var elGas = document.getElementById("val-gas");
  var elSenha = document.getElementById("senha-professor");
  var elSenhaMsg = document.getElementById("senha-msg");
  var btnSalvar = document.getElementById("btn-salvar-senha");
  var btnSobre = document.getElementById("btn-sobre");
  var btnDash = document.getElementById("btn-dashboard");
  var paginaSobre = document.getElementById("pagina-sobre");
  var paginaDash = document.getElementById("pagina-dashboard");

  function mostrarPagina(nome) {
    var ehSobre = nome === "sobre";
    paginaSobre.hidden = !ehSobre;
    paginaDash.hidden = ehSobre;
    paginaSobre.classList.toggle("ativa", ehSobre);
    paginaDash.classList.toggle("ativa", !ehSobre);
    btnSobre.classList.toggle("ativo", ehSobre);
    btnDash.classList.toggle("ativo", !ehSobre);
  }

  btnSobre.addEventListener("click", function () {
    mostrarPagina("sobre");
  });
  btnDash.addEventListener("click", function () {
    mostrarPagina("dashboard");
  });

  function carregarSenha() {
    var salva = localStorage.getItem(SENHA_KEY);
    if (salva) {
      elSenha.value = salva;
      elSenhaMsg.textContent = "Senha carregada do localStorage (chave: senhaGrupo).";
    } else {
      elSenha.placeholder = SENHA_PLACEHOLDER;
      elSenhaMsg.innerHTML =
        "Chave: <code>senhaGrupo</code>. Placeholder: " +
        SENHA_PLACEHOLDER +
        " (substituir pela senha do professor, se diferente).";
    }
  }

  btnSalvar.addEventListener("click", function () {
    var valor = elSenha.value.trim();
    if (!valor) {
      elSenhaMsg.textContent = "Digite uma senha antes de salvar.";
      return;
    }
    localStorage.setItem(SENHA_KEY, valor);
    elSenhaMsg.textContent = "Senha salva em localStorage (senhaGrupo).";
  });

  function setStatus(conectado) {
    if (conectado) {
      elStatusDot.classList.add("conectado");
      elStatusTexto.textContent = "Conectado";
    } else {
      elStatusDot.classList.remove("conectado");
      elStatusTexto.textContent = "Desconectado";
    }
  }

  function onMessage(message) {
    var topic = message.destinationName;
    var payload = message.payloadString;
    if (topic === TOPICS[0]) {
      elTemp.textContent = payload;
    } else if (topic === TOPICS[1]) {
      elUmid.textContent = payload;
    } else if (topic === TOPICS[2]) {
      elGas.textContent = payload;
    }
  }

  function agendarReconnect() {
    if (reconnectTimer) return;
    reconnectTimer = setTimeout(function () {
      reconnectTimer = null;
      conectarMqtt();
    }, 5000);
  }

  function conectarMqtt() {
    if (typeof Paho === "undefined" || !Paho.MQTT) {
      setStatus(false);
      elStatusTexto.textContent = "Desconectado (Paho nÃ£o carregou)";
      return;
    }

    var clientId = "web_" + Math.random().toString(16).substr(2, 8);
    client = new Paho.MQTT.Client(MQTT_HOST, MQTT_WS_PORT, clientId);

    client.onConnectionLost = function () {
      setStatus(false);
      agendarReconnect();
    };
    client.onMessageArrived = onMessage;

    client.connect({
      timeout: 5,
      useSSL: false,
      onSuccess: function () {
        setStatus(true);
        for (var i = 0; i < TOPICS.length; i++) {
          client.subscribe(TOPICS[i]);
        }
      },
      onFailure: function () {
        setStatus(false);
        agendarReconnect();
      }
    });
  }

  carregarSenha();
  if (location.hash === "#dashboard") {
    mostrarPagina("dashboard");
  } else {
    mostrarPagina("sobre");
  }
  // Prefill demo senha if empty (entrega/lab) — grupo troca pela senha real do professor
  if (!localStorage.getItem(SENHA_KEY)) {
    localStorage.setItem(SENHA_KEY, SENHA_PLACEHOLDER);
  }
  conectarMqtt();
})();

