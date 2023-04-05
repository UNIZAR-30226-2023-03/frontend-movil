<script>
export default {
  props: {
    show: Boolean
  },
  methods: {
    // Any additional methods you need can be defined here
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
        <a style="padding:15px; color: white;" class="jugar-button" id="privada" @click="showModalJugar = true">
            Privada
        </a>
        </div>
        <div style=" display:flex;">
          <a style="padding:15px; color: white;" class="jugar-button" id="publica" @click="showModalJugar = true">
            Pública
        </a>
        </div>
        
      </div>
    </div>
  </Transition>
</template>

<style>
@import '../theme/estilos.css';
</style>
