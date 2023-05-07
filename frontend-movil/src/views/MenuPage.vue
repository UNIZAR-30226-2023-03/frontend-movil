<template>
<div class="pantalla-menu">
    <div class="containerMenu1">
        
        <a class="boton2 boton-menu-nombre boton-menu" id="show-modalV" @click="showModalVict = true">
          {{ this.$route.query.username }} 
        </a>
        <a class="boton1 boton-menu-notis boton-menu"  @click="goShop">
            <img  src="../../public/assets/tienda.png" >
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
      <a  @click="showModalVict = true">
        <img :class="{ 'small-image': showModalVict }" style="border-radius: 10px" src="../../public/assets/tablero.png" alt="skin del tablero">
        </a>
        
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
    <Jugar :show="showModalJugar" @close="showModalJugar = false" @partidaPrivada="showModalJugar = false; showModalPrivada = true" @partidaPublica="jugar">
    </Jugar>
    <Privada :show="showModalPrivada" :nombreUsuario="nombreUsuario" :idJugador="idUsuario" @close="showModalPrivada = false">
    </Privada>
  </Teleport>
</div>
  </template>
  
  <script>
  import axios from 'axios';
  import router from "@/router";
  import Notificacion from "@/components/NotificacionesComponent.vue"
  import Victorias from "@/components/VictoriasComponent.vue"
  import Jugar from "@/components/JugarComponent.vue"
  import Privada from "@/components/PrivadaComponent.vue"
  
  export default {
    components: {
      Notificacion,
      Victorias,
      Jugar,
      Privada
    },
    data() {
      return {
        tableroActivo: '1',
        idUsuario: this.$route.query.userId,
        nombreUsuario: this.$route.query.username,
        showModalNoti: false,
        showModalVict: false,
        showModalJugar: false,
        showModalPrivada: false
      }
    },
    methods:{
      jugar(){
        console.log("jugar publica:", this.codigoPartida, this.passwdPartida, this.idJugador);
        axios.post('https://lamesa-backend.azurewebsites.net/partida/publica', {
            jugador: this.idJugador,
            configuracionB: "SOLO_SEGUROS",
            configuracionF: "NORMAL"
          })
          .then((response) => {
            const success = response.status === 200;
            if (success) {
              router.push({ path: '/partida', query: { nombreUsuario:this.nombreUsuario, id: response.data.id, color: response.data.color, jugadores: response.data.jugadores, hostPrivada:false } });
            }
          })
          .catch((error) => {
            console.log(error);
          });
      },
      goShop(){
      console.log("a la tiendaaaa");
      router.push({ path: '/tienda' });
      


    }    
    
    },

    mounted() {
      console.log('IdUsuario: ',this.idUsuario)
      console.log('NombreUsuario: ', this.nombreUsuario)
    }
  }
  </script>

<style>
@import '../theme/prueba.css';
@import '../theme/estilosInicio.css';
.small-image {
  transform: scale(0.9);
  transition: transform 0.2s ease-in-out;
}
</style>
  