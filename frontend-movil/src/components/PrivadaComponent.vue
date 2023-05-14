<script>
  import axios from 'axios';
  import router from "@/router";
  import Cookies from 'js-cookie';
  import { IonButton, IonLabel, IonSegment, IonSegmentButton } from '@ionic/vue';
export default {
  components: {
    IonLabel,
    IonSegment,
    IonSegmentButton,
    IonButton
  },
  props: {
    show: Boolean,
    nombreUsuario: String,
    idJugador: Number
  },
  data(){
    return{
      confF:"NORMAL",
      confB:"SOLO_SEGUROS",
      codigoPartida:'',
      passwdPartida:'',
      showError:false
    }
  },
  methods: {
    mostrarError(mensaje){
      this.showError = true;
      document.getElementById("mensajeError").innerHTML = mensaje;
    },
    crearPrivada(){
      console.log("jugar:", this.codigoPartida, this.passwdPartida, this.idJugador, this.confB, this.confF);
      axios.post('https://lamesa-backend.azurewebsites.net/partida/crear', {
          nombre: this.codigoPartida,
          password: this.passwdPartida,
          jugador: this.idJugador,
          configuracionB: this.confB,
          configuracionF: this.confF
        })
        .then((response) => {
          const success = response.status === 200;
          if (success) {
            Cookies.set('jugadores', response.data.jugadores);
            console.log('jugadores en partida: ',response.data.jugadores);
            router.push({ path: '/partida', query: { nombreUsuario: this.nombreUsuario, id: response.data.id, jugadores: JSON.stringify(response.data.jugadores) , color: response.data.color, hostPrivada:true } });

          }
        })
        .catch((error) => {
          this.mostrarError("No se puede crear la partida");
          console.log(error);
        });
    },
    unirsePrivada(){
      console.log("unirse:", this.codigoPartida, this.passwdPartida, this.idJugador);
      
      axios.post('https://lamesa-backend.azurewebsites.net/partida/conectar', {
          nombre: this.codigoPartida,
          password: this.passwdPartida,
          jugador: this.idJugador,
          configuracionB: this.confB,
          configuracionF: this.confF
        })
        .then((response) => {
          const success = response.status === 200;
          if (success) {
            Cookies.set('jugadores', response.data.jugadores);
            console.log('jugadores en partida: ',response.data.jugadores);
            router.push({ path: '/partida', query: {nombreUsuario: this.nombreUsuario, idJugador:this.idJugador, jugadores: JSON.stringify(response.data.jugadores) , id: response.data.id, color: response.data.color, hostPrivada:false } });
          }
        })
        .catch((error) => {
          this.mostrarError("La partida no existe");
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
        <a class="close-icon-img" @click="this.showError = false; $emit('close')">
          <img src="../../public/assets/close.png" alt="cerrar popup">
        </a>
        <h5 style="width: 100%; margin-top: 10px; margin-bottom: 0px;">Conexión</h5>
        <input v-model="codigoPartida" placeholder="Nombre de partida" style="width: 100%; margin-top: 10px;">
        <input v-model="passwdPartida" placeholder="Contraseña" style="width: 100%;">

      <h5 style="width: 100%; margin-top: 10px; margin-bottom: 0px;">Velocidad</h5>
      <ion-segment value="default">
        <ion-segment-button value="default" @click="confF='NORMAL'">
          <ion-label>Normal</ion-label>
        </ion-segment-button>
        <ion-segment-button value="segment" @click="confF='RAPIDO'">
          <ion-label>Rápida</ion-label>
        </ion-segment-button>
      </ion-segment>

      <h5 style="width: 100%; margin-top: 10px; margin-bottom: 0px;">Barreras</h5>
      <ion-segment value="default">
        <ion-segment-button value="default" @click="confB='SOLO_SEGUROS'">
          <ion-label style="font-size: smaller;">Solo seguros</ion-label>
        </ion-segment-button>
        <ion-segment-button value="segment" @click="confB='TODAS_CASILLAS'">
          <ion-label style="font-size: smaller;">Cualquier casilla</ion-label>
        </ion-segment-button>
      </ion-segment>

        <div>
          <ion-button id="publica" class="boton-submenu" style="width: 48%;" @click="crearPrivada" >
              CREAR
          </ion-button>
          <ion-button id="publica" class="boton-submenu" style="width: 48%;" @click="unirsePrivada" >
              UNIRSE
          </ion-button>
        </div>
        <p id="mensajeError" style="margin:0px; text-align: center; color: red; font-weight: bold; font-size: small;" v-show="showError">La partida no existe</p>
        
      </div>
    </div>
  </Transition>
</template>

<style>
@import '../theme/estilos.css';
</style>
