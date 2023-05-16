<template>
  <div class="pantalla-menu">
    <div class="containerMenu1">

      <a class="boton2 boton-menu-nombre boton-menu" id="show-modalV" @click="showModalUsuario = true">
        {{ nombreUsuario }}
      </a>
      <a class="boton1 boton-menu-notis boton-menu" @click="goShop">
        <img src="../../public/assets/tienda.png">
      </a>
    </div>
    <div class="containerMenu2">
      <a class="boton2 boton-menu-vict boton-menu" id="show-modalV" @click="showModalRanking = true">
        <img src="../../public/assets/medallas.png" alt="cerrar popup">
      </a>
      <a class="boton1 boton-menu-notis boton-menu" id="show-modalN" @click="showModalAmigos = true">
        <img src="../../public/assets/amigos.png" alt="cerrar popup">
      </a>
    </div>
    <div class="containerTablero">
      <a @click="showModalInventario = true">
        <img ref="tablero" :class="{ 'small-image': showModalInventario }" style="border-radius: 10px"
          alt="skin del tablero">
      </a>

    </div>
    <div class="containerBotonesJugar">
      <a class="login-button" id="torneo" @click="showModalTorneo = true">
        Torneo
      </a>
      <a class="login-button" id="jugar" @click="jugar()">
        Jugar
      </a>
    </div>


    <Teleport to="body">
      <Amigos :nombreUsuario="nombreUsuario" :show="showModalAmigos" @close="showModalAmigos = false">
      </Amigos>
      <Ranking :show="showModalRanking" @close="showModalRanking = false">
      </Ranking>
      <Jugar :show="showModalJugar" @close="showModalJugar = false"
        @partidaPrivada="showModalJugar = false; showModalPrivada = true" @partidaPublica="showModalJugar = false; showModalPublica = true">
      </Jugar>
      <Privada :show="showModalPrivada" :nombreUsuario="nombreUsuario" :idJugador="idUsuario"
        @close="showModalPrivada = false">
      </Privada>
      <Publica :show="showModalPublica" :nombreUsuario="nombreUsuario" :idJugador="idUsuario"
        @close="showModalPublica = false">
      </Publica>
      <Inventario :show="showModalInventario" @close="showModalInventario = false">
      </Inventario>
      <Usuario :show="showModalUsuario" @close="showModalUsuario = false" @recargar="cargarDatosUsuario()">
      </Usuario>
      <Torneo :show="showModalTorneo" @close="showModalTorneo = false"
        @torneoCrear="showModalTorneo = false; showModalTorneoCrear = true" @torneoLista="showModalTorneo = false; showModalTorneoLista = true">
      </Torneo>
      <TorneoCrear :show="showModalTorneoCrear" @close="showModalTorneoCrear = false">
      </TorneoCrear>
      <TorneoLista :show="showModalTorneoLista" @close="showModalTorneoLista = false">
      </TorneoLista>
      
    </Teleport>
  </div>
</template>
    
<script>
import axios from 'axios';
import Cookies from 'js-cookie';
import router from "@/router";
import Amigos from "@/components/AmigosComponent.vue"
import Ranking from "@/components/RankingComponent.vue"
import Jugar from "@/components/JugarComponent.vue"
import Privada from "@/components/PrivadaComponent.vue"
import Publica from "@/components/PublicaComponent.vue"
import Inventario from "@/components/InventarioComponent.vue"
import Usuario from "@/components/UsuarioComponent.vue"
import Torneo from "@/components/TorneoComponent.vue"
import TorneoCrear from "@/components/TorneoCrearComponent.vue"
import TorneoLista from "@/components/TorneoListaComponent.vue"


export default {
  components: {
    Amigos,
    Ranking,
    Jugar,
    Inventario,
    Privada,
    Usuario,
    Publica,
    Torneo,
    TorneoCrear,
    TorneoLista
  },
  data() {
    return {
      tableroActivo: '1',
      idUsuario: '',
      nombreUsuario: '',
      showModalNoti: false,
      showModalJugar: false,
      showModalPrivada: false,
      showModalPublica: false,
      showModalInventario: false,
      showModalAmigos: false,
      showModalRanking: false,
      showModalUsuario: false,
      showModalTorneo: false,
      showModalTorneoLista: false,
      showModalTorneoCrear: false
    }
  },
  //   watch: {
  //   tableroActivo() {
  //     const tablero = this.$refs.tablero;
  //     tablero.src = "../../public/assets/TABLERO" + this.tableroActivo + ".png";
  //   }
  // },
  methods: {
    jugar() {
      console.log("intentando reconectar: ",this.idUsuario);
      axios.post('https://lamesa-backend.azurewebsites.net/partida/reconectar/'+ this.idUsuario, {})
        .then((response) => {
          const success = response.data; // es null si no se puede reconectar a nada
          if (success) { // falta poner las fichas
            router.push({ path: '/partida', query: { nombreUsuario: this.nombreUsuario, id: response.data.id, jugadores: JSON.stringify(response.data.jugadores) , color: response.data.color,  turno: response.data.turno, reconectado:true, fichas: JSON.stringify(response.data.fichas)} });
          }else{
            this.showModalJugar = true // no puedes reconectarte a ninguna partida
          }
        })
        .catch((error) => {
          console.log(error);
          this.showModalJugar = true // no puedes reconectarte a ninguna partida
        });
    },
    goShop() {
      console.log("a la tiendaaaa");
      router.push({ path: '/tienda' });
    },

    changeImageSrc() {

      const tablero = this.$refs.tablero;
      this.tableroActivo = Cookies.get('tableroActivo');
      // if(!this.tableroActivo){
      //   this.tableroActivo = 1;
      // }
      import(`../../public/assets/TABLERO${this.tableroActivo}.png`).then(imageUrl => {
        tablero.src = imageUrl.default;
      });
    },

    cargarDatosUsuario(){
      console.log("Recargando");
        this.idUsuario = Cookies.get('sessionId');
        this.nombreUsuario = Cookies.get('username');
        this.tableroActivo = Cookies.get('tableroActivo');
      }

  },
  beforeMount() {
    this.idUsuario = Cookies.get('sessionId');
    this.nombreUsuario = Cookies.get('username');
    this.tableroActivo = Cookies.get('tableroActivo');
    console.log('MENU| TABLERO DE ENTRADA = ', this.tableroActivo);


  },
  beforeResolve() {
    this.idUsuario = Cookies.get('sessionId');
    this.nombreUsuario = Cookies.get('username');
    this.tableroActivo = Cookies.get('tableroActivo');
    console.log('MENU| TABLERO DE ENTRADA = ', this.tableroActivo);
    this.changeImageSrc();
  }
  ,

  mounted() {
    //ver que tablero tiene activo el user para cambiar el tablero activo

    console.log('MENU| TABLERO DE ENTRADA = ', this.tableroActivo);
    this.tableroActivo = Cookies.get('tableroActivo');
    this.changeImageSrc();

    console.log('IdUsuario: ', this.idUsuario)
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
}</style>