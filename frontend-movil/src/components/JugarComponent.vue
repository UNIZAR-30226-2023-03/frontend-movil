<script>
export default {
  props: {
    show: Boolean
  },
  methods: {

  }
}
</script>

<template>
  <Transition name="jugar">
    <div v-if="show" class="modal-mask">
      <div class="modal-container">
        <a class="close-icon-img" @click="$emit('close')">
          <img src="../../public/assets/close.png" alt="cerrar popup">
        </a>
        <div style=" display:flex;">
        <ion-button id="privada" class="boton-submenu" @click="$emit('partidaPrivada')">
            Privada
        </ion-button>
        </div>
        <div style=" display:flex;">
          <ion-button id="publica" class="boton-submenu" @click="$emit('partidaPublica')">
            Pública
        </ion-button>
        </div>
        
      </div>
    </div>
  </Transition>
</template>

<style>
@import '../theme/estilos.css';
</style>
