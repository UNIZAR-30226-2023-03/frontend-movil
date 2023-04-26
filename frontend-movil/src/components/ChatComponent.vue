

<script>
import { IonIcon } from '@ionic/vue';
import { send } from 'ionicons/icons';

export default {
  data() {
    return {
      message: '',
      socket,
      stompClient

    }
  },
  props: {
    show: Boolean
  },
  methods: {
    actualizarChat(data) {
      let chatElement = this.$refs.chat; // hay que crear la referencia en la view (es un modal)
      let messageElement = document.createElement("div");
      messageElement.classList.add("message");
      messageElement.textContent = data;
      chatElement.appendChild(messageElement);
    },
    sendMessage() {

      stompClient.send("/app/chat/" + idPartida, {}, JSON.stringify({
        usuario: "<usuario>",
        mensaje: this.message
      }));

      console.log('enviando msg')

      this.message = '';
    },
    mounted() {
      const url = "https://lamesa-backend.azurewebsites.net/";
      console.log("connecting to the game");
      this.socket = new SockJS(url + "/ws");
      this.stompClient = Stomp.over(socket);


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
