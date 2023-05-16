<script>
import {IonButton} from '@ionic/vue';

export default {
  components: {
    IonButton
  },
  props: {
    show: Boolean
  },
  methods: {

  }
}
</script>

<template>
  <Transition name="jugar">
    <div v-if="show" class="modal-mask-small">
      <div class="modal-container-small">
        <a class="close-icon-img" @click="$emit('close')">
          <img src="../../public/assets/close.png" alt="cerrar popup">
        </a>
        <div style=" display:flex;">
        <ion-button id="privada" class="boton-submenu" @click="$emit('torneoCrear')">
            Crear torneo
        </ion-button>
        </div>
        <div style=" display:flex;">
          <ion-button id="publica" class="boton-submenu" @click="$emit('torneoLista')">
            Unirse a torneo
        </ion-button>
        </div>
        
      </div>
    </div>
  </Transition>
</template>

<style>
@import '../theme/estilos.css';
</style>
