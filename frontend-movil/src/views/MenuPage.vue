<template>
  <div class="pantalla-menu">
      <div class="containerMenu1">
          
          <a class="boton2 boton-menu-nombre boton-menu" id="show-modalV" @click="showModalUsuario = true">
            {{ this.$route.query.username }} 
          </a>
          <a class="boton1 boton-menu-notis boton-menu"  @click="goShop">
              <img  src="../../public/assets/tienda.png" >
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
        <a  @click="showModalInventario = true">
          <img  ref="tablero" :class="{ 'small-image': showModalInventario }" style="border-radius: 10px"  alt="skin del tablero">
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
      <Amigos :nombreUsuario="nombreUsuario" :show="showModalAmigos" @close="showModalAmigos = false">
      </Amigos>
      <Ranking :show="showModalRanking" @close="showModalRanking = false">
      </Ranking>
      <Jugar :show="showModalJugar" @close="showModalJugar = false" @partidaPrivada="showModalJugar = false; showModalPrivada = true" @partidaPublica="jugar">
      </Jugar>
      <Privada :show="showModalPrivada" :nombreUsuario="nombreUsuario" :idJugador="idUsuario" @close="showModalPrivada = false">
      </Privada>
      <Inventario :show="showModalInventario"  @close="showModalInventario = false">
      </Inventario>
      <Usuario :show="showModalUsuario"  @close="showModalUsuario = false">
      </Usuario>
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
    import Inventario from "@/components/InventarioComponent.vue"
    import Usuario from "@/components/UsuarioComponent.vue"

    export default {
      components: {
        Amigos,
        Ranking,
        Jugar,
        Inventario,
        Privada,
        Usuario
      },
      data() {
        return {
          tableroActivo: 1,
          idUsuario: this.$route.query.userId,
          nombreUsuario: this.$route.query.username,
          showModalNoti: false,
          showModalJugar: false,
          showModalPrivada: false,
          showModalInventario: false,
          showModalAmigos: false,
          showModalRanking: false,
          showModalUsuario : false
        }
      },
    //   watch: {
    //   tableroActivo() {
    //     const tablero = this.$refs.tablero;
    //     tablero.src = "../../public/assets/TABLERO" + this.tableroActivo + ".png";
    //   }
    // },
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
        
  
  
      },
      changeImageSrc() {
        
      const tablero = this.$refs.tablero;
      import(`../../public/assets/TABLERO${this.tableroActivo}.png`).then(imageUrl => {
      tablero.src = imageUrl.default;
    });
  }
     
      
      },
      beforeMount(){
        this.tableroActivo = Cookies.get('tableroActivo');
        console.log('MENU| TABLERO DE ENTRADA = ',this.tableroActivo);
      },
  
      mounted() {
        //ver que tablero tiene activo el user para cambiar el tablero activo
        
        this.changeImageSrc();
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