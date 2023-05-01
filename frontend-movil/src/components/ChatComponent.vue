

<script>
import { IonIcon } from '@ionic/vue';
import { send } from 'ionicons/icons';
import Stomp from 'stompjs';


export default {
  data() {
    return {
      message: ''

    }
  },
  props: {
    show: {
      type: Boolean,
      required: true
    },
    stompClient: {
      type: Object,
      required: true
    },
    idPartida: {
      type: String,
      required: true
    }
  },
  methods: {
    actualizarChat(data) {
      const chatElement = this.$refs.chat; // hay que crear la referencia en la view (es un modal)
      const messageElement = document.createElement("div");
      messageElement.classList.add("message");
      messageElement.textContent = data;
      chatElement.appendChild(messageElement);
    },
    sendMessage() {
    this.stompClient.send("/app/chat/" + this.idPartida, {}, JSON.stringify({
    usuario: "<usuario>",
    mensaje: this.message
  }));

  console.log('enviando msg');

  this.message = '';
}


  }
}
</script>

<template>
  <Transition name="victorias">
    <div v-if="show" class="modal-mask">
      <div class="modal-container" ref="chat">
        <a class="close-icon-img" @click="$emit('close')">
          <img src="../../public/assets/close.png" alt="cerrar popup">
        </a>

        <form class="chat-input" @submit.prevent="sendMessage">

          <ion-input v-model="message" placeholder="Escribe un mensaje..."></ion-input>
          <ion-button type="submit">
            <ion-icon name="send"></ion-icon>
            Enviar
          </ion-button>

        </form>
      </div>
    </div>
  </Transition>
</template>

<style>
@import '../theme/estilos.css';
</style>
