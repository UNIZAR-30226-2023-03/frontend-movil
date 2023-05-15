<template>
  <Transition name="victorias">
    <div v-if="show" class="modal-mask-small">
      <div class="modal-container-small" style="text-align: center;">
        <a class="close-icon-img" @click="$emit('close'); mostrarConfirmacion = false">
          <img src="../../public/assets/close.png" alt="cerrar popup">
        </a>

        <div v-if="!mostrarConfirmacion">
          <ion-button v-if="miTurno" @click="pausa()" size="small" style="width: 50%;">PAUSAR</ion-button>
         
          <p></p>
          <ion-button color="danger" @click="mostrarConfirmacion = true" size="small"
            style="width: 50%;">SALIR</ion-button>
        </div>
        <div v-else>
          <p>¿Estás seguro de que deseas salir de la partida?</p>
          <ion-button color="success" @click="$emit('close'); mostrarConfirmacion = false" size="small"
            style="width: 50%;">NO</ion-button>
          <ion-button color="danger" @click="$emit('close'); salir(); mostrarConfirmacion = false" size="small"
            style="width: 50%;">Si</ion-button>

        </div>
      </div>
    </div>
  </Transition>
</template>


<script>
import { IonButton } from '@ionic/vue';
import axios from "axios";
import router from "@/router";
import Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import Cookies from "js-cookie";

export default {
  components: {
    IonButton
  },
  data() {
    return {
      message: null,
      messages: [],
      mostrarConfirmacion: false
  
    }
  },
  props: {
    show: {
      type: Boolean,
      required: true
    },
    miTurno: {
      type: Boolean,
      required: true
    },
    partida: {
      type: Number,
      required: true
    }
  },
  mounted() {
    console.log('Cargado popup confirmacion');
    this.mostrarConfirmacion = false;

  },
  methods: {
    pausa() {
      if (this.miTurno) {
        console.log('Pausandoo');
        axios.post(
          "https://lamesa-backend.azurewebsites.net/partida/pausa/"+this.partida
        )
        .then((response) => {
          const success = response.status === 200;
          if (success) {
            console.log('PARTIDA PAUSADA');
          }
        })
        .catch((error) => {
          console.log(error);
        });
      }else{
        console.log('no es tu turno y no puedes pausar');
      }
    },
    salir() {
      console.log('Saliendoo');
      this.mostrarConfirmacion = true;
      const sessionId = Cookies.get('sessionId');
      axios.post(
        "https://lamesa-backend.azurewebsites.net/partida/salir",
        {
          "jugador": sessionId,
          "partida": this.partida
        }
      )
        .then((response) => {
          const success = response.status === 200;
          // console.log("Socket stomp: ",this.stompClient);
          if (success) {
            this.emit('cerrarStomp');
            // this.stompClient.disconnect();
            // console.log("Socket connection closed");
            router.push({
            path: '/menu'
          });
          }
        })
        .catch((error) => {
          console.log(error);
        });

    },
    Prueba() {
      console.log('Prueba msg: ' + this.message);

    }
  }
}
</script>

<style>@import '../theme/estilos.css';</style>
