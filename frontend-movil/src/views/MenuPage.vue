<template>
<div class="pantalla-menu">
    <div class="containerMenu1">
        
        <a class="boton2 boton-menu-nombre boton-menu" id="show-modalV" @click="showModalVict = true">
            Nombre mio 
        </a>
        <a class="boton1 boton-menu-notis boton-menu" id="show-modalN" @click="showModalNoti = true">
            <img src="../../public/assets/noti.png" alt="cerrar popup">
        </a>
    </div>
    <div class="containerMenu2">
        <a class="boton2 boton-menu-vict boton-menu" id="show-modalV" @click="showModalVict = true">
            <img src="../../public/assets/medallas.png" alt="cerrar popup">
        </a>
        <a class="boton1 boton-menu-notis boton-menu" id="show-modalN" @click="showModalNoti = true">
            <img src="../../public/assets/amigos.png" alt="cerrar popup">
        </a>
    </div>
    <div class="containerTablero">
        <img style="border-radius: 10px" src="../../public/assets/tablero.png" alt="skin del tablero">
    </div>
    <div class="containerBotonesJugar">
        <a class="login-button" id="torneo" @click="showModalNoti = true">
            Torneo
        </a>
        <a class="login-button" id="jugar" @click="showModalJugar = true">
            Jugar
        </a>
    </div>
  
  <Teleport to="body">
    <Notificacion :show="showModalNoti" @close="showModalNoti = false">
    </Notificacion>
    <Victorias :show="showModalVict" @close="showModalVict = false">
    </Victorias>
    <Jugar :show="showModalJugar" @close="showModalJugar = false">
    </Jugar>
  </Teleport>
</div>
  </template>
  
  <script>
  import Notificacion from "@/components/NotificacionesComponent.vue"
  import Victorias from "@/components/VictoriasComponent.vue"
  import Jugar from "@/components/JugarComponent.vue"
  
  export default {
    components: {
      Notificacion,
      Victorias,
      Jugar
    },
    data() {
      return {
        showModalNoti: false,
        showModalVict: false,
        showModalJugar: false
      }
    }
  }
  </script>

<style>
@import '../theme/prueba.css';
@import '../theme/estilosInicio.css';
</style>
  