<template>
  <Transition name="victorias">
    <div v-if="show" class="modal-mask">
      <div class="modal-container" ref="chat">
        <a class="close-icon-img" @click="$emit('close')">
          <img src="../../public/assets/close.png" alt="cerrar popup">
        </a>

        <div class="messages-container">
          <div v-for="(msg, index) in messages" :key="index" class="message">
            {{ msg.usuario }}: {{ msg.mensaje }}

          </div>
        </div>

        <form class="chat-input" @submit.prevent="sendMessage">
          <div class="input-container">
            <input v-model="message" placeholder="Escribe un mensaje...">
            <ion-button type="submit">Enviar</ion-button>
          </div>
        </form>

      </div>
    </div>
  </Transition>
</template>


<script>
import { IonButton } from '@ionic/vue';

import Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';

export default {
  components: {
    IonButton
  },
  data() {
    return {
      message: null,
      stompClient: null,
      messages: []
    }
  },
  props: {
    show: {
      type: Boolean,
      required: true
    },
    idPartida: {
      type: String,
      required: true
    },
    nombreUsuario: {
      type: String,
      required: true
    }
  },
  mounted() {
    const url = "https://lamesa-backend.azurewebsites.net/";
    console.log("connecting to the game");
    const socket = new SockJS(url + "/ws");
    this.stompClient = Stomp.over(socket);
    this.stompClient.connect({}, () => {
      console.log("connected to the game");
      this.stompClient.subscribe("/topic/chat/" + this.idPartida, (data) => {
        this.actualizarChat(JSON.parse(data.body));
      });
    });
  },
  methods: {
    actualizarChat(data) {
      this.messages.push(data);
    },

    sendMessage() {
      console.log("Id Partida:" + this.idPartida);
      console.log("Stomp:" + this.stompClient);
      console.log('enviando msg: ' + this.$data.message);
      this.stompClient.send("/app/chat/" + this.idPartida, {}, JSON.stringify({
        usuario: this.nombreUsuario,
        mensaje: this.$data.message
      }));



      this.message = '';
    },
    Prueba() {
      console.log('Prueba msg: ' + this.message);
    }
  }
}
</script>

<style>
@import '../theme/estilos.css';

/* .modal-container {
  display: flex;
  flex-direction: column;
} */

.messages-container {
  flex: 1;
  overflow-y: auto;
}

.message {
  text-align: left;
  margin-bottom: 10px;
}

.chat-input {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
}

.input-container {
  display: flex;
  align-items: center;
}
</style>
