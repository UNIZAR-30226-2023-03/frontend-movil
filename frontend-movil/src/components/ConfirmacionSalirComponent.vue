<template>
  <Transition name="victorias">
    <div v-if="show" class="modal-mask">
      <div class="modal-container" style="text-align: center;" >
        <a class="close-icon-img" @click="$emit('close'); mostrarConfirmacion = false">
          <img src="../../public/assets/close.png" alt="cerrar popup">
        </a>
        
        <div v-if="!mostrarConfirmacion">
          <ion-button  @click="pausa()" size="small" style="width: 50%;" >PAUSAR</ion-button>
        <p></p>
        <ion-button color="danger" @click="mostrarConfirmacion = true"  size="small" style="width: 50%;" >SALIR</ion-button>
        </div>
        <div v-else> 
          <p>¿Estás seguro de que deseas salir de la partida?</p>
          <ion-button color="success" @click="$emit('close'); mostrarConfirmacion = false" size="small" style="width: 50%;" >NO</ion-button>
          <ion-button color="danger"  @click="$emit('close'); salir(); mostrarConfirmacion = false" size="small" style="width: 50%;" >Si</ion-button>
        
        </div>
      </div>
    </div>
  </Transition>
</template>


<script>
import { IonButton } from '@ionic/vue';

import Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';

export default {
  components:{
    IonButton
  },
  data() {
    return {
      message:  null,
      stompClient: null,
      messages: [],
      mostrarConfirmacion: false
    }
  },
  props: {
    show: {
      type: Boolean,
      required: true
    }
  },
  mounted() {
    console.log('Cargado popup confirmacion');
    this.mostrarConfirmacion = false;
  },
  methods: {
    pausa(){
      console.log('Pausandoo');
    },
    salir(){
      console.log('Saliendoo');
      this.mostrarConfirmacion = true;
    },
    Prueba() {
      console.log('Prueba msg: '+this.message);
    }
  }
}
</script>

<style>
@import '../theme/estilos.css';
</style>
