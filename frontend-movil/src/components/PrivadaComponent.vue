<script>
  import axios from 'axios';
  import router from "@/router";
export default {
  props: {
    show: Boolean,
    idJugador: Number
  },
  methods: {
    crearPrivada(){
      console.log("jugar:", this.codigoPartida, this.passwdPartida, this.idJugador);
      axios.post('https://lamesa-backend.azurewebsites.net/partida/crear', {
          nombre: this.codigoPartida,
          password: this.passwdPartida,
          jugador: this.idJugador,
          configuracionB: "SOLO_SEGUROS",
          configuracionF: "NORMAL"
        })
        .then((response) => {
          const success = response.status === 200;
          if (success) {
            router.push({ path: '/partida', query: { id: response.data.id, color: response.data.color, jugadores: response.data.jugadores, hostPrivada:true } });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    unirsePrivada(){
      console.log("unirse:", this.codigoPartida, this.passwdPartida, this.idJugador);
      axios.post('https://lamesa-backend.azurewebsites.net/partida/conectar', {
          nombre: this.codigoPartida,
          password: this.passwdPartida,
          jugador: this.idJugador,
          configuracionB: "SOLO_SEGUROS",
          configuracionF: "NORMAL"
        })
        .then((response) => {
          const success = response.status === 200;
          if (success) {
            router.push({ path: '/partida', query: { id: response.data.id, color: response.data.color, jugadores: response.data.jugadores, hostPrivada:false } });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }  
  }
}
</script>

<template>
  <Transition name="privada">
    <div v-if="show" class="modal-mask">
      <div class="modal-container">
        <a class="close-icon-img" @click="$emit('close')">
          <img src="../../public/assets/close.png" alt="cerrar popup">
        </a>
        <input v-model="codigoPartida" placeholder="Nombre de partida" style="width: 100%; margin-top: 10px;">
        <input v-model="passwdPartida" placeholder="Contraseña" style="width: 100%;">

        <div>
          <ion-button id="publica" class="boton-submenu" style="width: 48%;" @click="crearPrivada" >
              CREAR
          </ion-button>
          <ion-button id="publica" class="boton-submenu" style="width: 48%;" @click="unirsePrivada" >
              UNIRSE
          </ion-button>
        </div>
        
      </div>
    </div>
  </Transition>
</template>

<style>
@import '../theme/estilos.css';
</style>
