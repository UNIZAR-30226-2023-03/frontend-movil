<template>
  <div class="background">
    <video autoplay muted loop>
      <source src="../../public/assets/fondoTienda.mp4" type="video/mp4">
      Your browser does not support the video tag.
    </video>
  </div>
  <div id="pantallaTienda" class="pantalla-menu">
    <div id="saldo" class="image-container"
      style="border-color:rgb(28, 212, 74) ; border-radius: 5%; border: 10px; background-color: rgb(58, 47, 35); z-index: 1;">
      <span id="precio">{{ monedas }}</span>
      <img src="../../public/assets/moneda.png">
    </div>
    <h2></h2>
    <div id="final-comtainer" class="modal-container-victoria">
      <div style="">
        <img style="max-height: 30%; width: auto;" src="../../public/assets/copa.png">
      </div>
      <div class="lista-de-ganadores">
        <h1> {{ primero }} ha ganado 50 monedas!!</h1>

        <hr style="margin-top: 10px; margin-bottom: 10px; border-top: 2px solid white;">

        <h1 v-if="primero != 'ESPERANDO JUGADOR'">#1 {{ primero }}</h1>
        <h2 v-if="segundo != 'ESPERANDO JUGADOR'">#2 {{ segundo }}</h2>
        <h3 v-if="tercero != 'ESPERANDO JUGADOR'">#3 {{ tercero }}</h3>
        <h4 v-if="cuarto != 'ESPERANDO JUGADOR'">#4 {{ cuarto }}</h4>
        <ion-button id="botonVict" color="secondary" @click="goMenu()">CONTINUAR</ion-button>
      </div>
  
      

    </div>


  </div>
</template>
  
<script>
import { IonButton } from '@ionic/vue'
import axios from 'axios';
import router from "@/router";
import Cookies from 'js-cookie';

export default {
  components: {
    IonButton
  },
  methods: {
    actualizarNombre(){ 
      if (this.primero == 'YO') {
        this.primero = Cookies.get('username');
      }
      if (this.segundo == 'YO') {
        this.segundo = Cookies.get('username');
      }
      if (this.tercero == 'YO') {
        this.tercero = Cookies.get('username');
      }
      if (this.cuarto == 'YO') {
        this.cuarto = Cookies.get('username');
      }
      
    },
    goMenu() {

      axios.get('https://lamesa-backend.azurewebsites.net/usuario/tablero-activo/' + Cookies.get('sessionId'))
        .then(response => {
          console.log('responseo= ', response);
          Cookies.set('tableroActivo', response.data.id);
          router.push({
            path: '/menu',
          });

        })
        .catch(error => {
          console.log(error);
        });
    }
  },

  data() {
    return {
      idUsuario: '',
      monedas: '',
      primero: this.$route.query.primero,
      segundo: this.$route.query.segundo,
      tercero: this.$route.query.tercero,
      cuarto: this.$route.query.cuarto,
      esTorneo: this.$route.query.esTorneo,
      finalTorneo: this.$route.query.finalTorneo
    }
  },
  beforeMount() {
    
    this.idUsuario = Cookies.get('sessionId');
  },
  mounted() {

    if(this.primero == Cookies.get('username') && this.esTorneo){
          // Pasar a la siguiente ronda del torneo
          router.push({ path: '/esperando', query: { finalista: true, esperando:!this.finalTorneo } });
      }

    this.actualizarNombre();
    axios.get('https://lamesa-backend.azurewebsites.net/usuario/monedas/' + this.idUsuario)
      .then(response => {
        this.monedas = response.data;
      })
      .catch(error => {
        console.log(error);
      });
  },
}
</script>

<style>
@import '../theme/estilos.css';
@import '../theme/estilosInicio.css';

.lista-de-ganadores {
  text-align: center;
}

.modal-container-victoria {
  width: 300px;
  height: 80%;
  margin: auto;
  padding: 20px 30px;
  border: 5px solid rgb(34, 34, 34);
  border-radius: 13px;
  z-index: 1;
  background-color: rgb(69, 69, 69);
  ;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
}

#final-comtainer {
  min-height: 70%;
  align-items: center;
  
}


.image-container {
  display: flex;
  align-items: center;
  justify-content: center;
  max-width: 150px;
  margin: 0 auto;
}

#precio {
  font-size: 20px;
  font-weight: bold;
  color: white;
  margin-right: 10px;


}

#pantallaTienda {
  opacity: 1;
}

.image-container img {
  max-width: 20%;
  height: auto;
  display: inline-block;
  vertical-align: middle;
}

.background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 0;
  opacity: 20%;
}

video {
  min-width: 100%;
  min-height: 100%;
  width: auto;
  height: auto;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}



#ion-buttonInv2 {
  margin-top: 10px;
  --background: #457341;
  --color: #fff;
}


/* css del podium */
.lista-de-ganadores h1 {
  color: gold;
}

.lista-de-ganadores h2 {
  color: silver;
}

.lista-de-ganadores h3 {
  color: #CD7F32;
  /* bronze color */
}

#botonVict {
  font-weight: bold;
  width: 80%;
  position: relative;
  bottom: 0;
}
</style>
  