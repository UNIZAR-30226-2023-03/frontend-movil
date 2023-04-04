<script>
export default {
  props: {
    show: Boolean
  }
}
</script>

<template>
  <Transition name="notificaciones">
    <div v-if="show" class="modal-mask">
      <div class="modal-container">
        <a class="close-icon-img" @click="$emit('close')">
          <img src="../../public/assets/close.png" alt="cerrar popup">
        </a>
        <div class="modal-header">
          <slot name="header">default header</slot>
        </div>

        <div class="modal-body">
          <slot name="body">default body</slot>
        </div>

        <div class="modal-footer">
          <slot name="footer">default footer</slot>
        </div>
      </div>
    </div>
  </Transition>
</template>


<style>
@import '../theme/estilos.css';
</style>