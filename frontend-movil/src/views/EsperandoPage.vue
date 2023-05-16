<template>
  <div class="background">
    <video autoplay muted loop>
      <source src="../../public/assets/fondoTienda.mp4" type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  </div>
  <div id="pantallaTienda" class="pantalla-menu">
    <div id="saldo" class="image-container" style="
        border-color: rgb(28, 212, 74);
        border-radius: 5%;
        border: 10px;
        background-color: rgb(58, 47, 35);
        z-index: 1;
      ">
      <span id="precio">{{ monedas }}</span>
      <img src="../../public/assets/moneda.png" />
    </div>
    <h2></h2>
    <h1 style="font-weight: bold; font-size: 40px; color: chocolate; text-align: center;" v-if="final">Felicidades por tu victoria!</h1>
    <div class="modal-container-small">
      <div v-if="esperando">
        <div style="
            display: grid;
            grid-template-columns: auto 1fr;
            align-items: center;
          ">

          <h1 v-if="final">Esperando finalistas...</h1>
          <h1 v-else>Esperando jugadores...</h1>
          <div class="loading-spinner-esperando"></div>
        </div>
        <div style="display: flex; justify-content: center;">
          <ion-button id="botonSalir" color="danger" @click="desapuntar()">DESAPUNTARSE</ion-button>
        </div>

        <p id="mensajeError" style="
            margin: 0px;
            text-align: center;
            color: red;
            font-weight: bold;
            font-size: small;
          " v-show="showError">
          La partida no existe
        </p>
      </div>
      <div v-else style=" align-items: center; height: 100%;">
        <h4 style="text-align: center;">Todos los jugadores están listos!</h4>
        <div style="display: flex; justify-content: center;">
          <ion-button v-if="!final" id="botonSalir" color="success" @click="empezarPartidaTorneo()">JUGAR</ion-button>
          <ion-button v-else id="botonSalir" color="success" @click="empezarPartidaTorneoFinal()">JUGAR FINAL</ion-button>

        </div>
      </div>
    </div>
    <div class="toast-container">
      <div class="toast" style="font-weight: bold; text-align: justify; min-height: 80px">
        {{ curiosity }}
      </div>
    </div>
  </div>
</template>

<script>
import { IonButton } from "@ionic/vue";
import axios from "axios";
import router from "@/router";
import Cookies from "js-cookie";
import * as SockJS from "sockjs-client";
import Stomp from "stompjs";

export default {
  components: {
    IonButton,
  },
  methods: {
    mostrarError(mensaje) {
      this.showError = true;
      document.getElementById("mensajeError").innerHTML = mensaje;
    },

    desapuntar() {
      axios
        .post("https://lamesa-backend.azurewebsites.net/torneo/desapuntar", {
          usuario: this.idUsuario,
          torneo: Cookies.get("torneoId"),
        })
        .then((response) => {
          const success = response.status === 200;
          if (success) {
            //Desuscribir del socket
            console.log("cerrando socket");
            this.stompClient.disconnect();

            console.log("Socket connection closed");

            axios
              .get(
                "https://lamesa-backend.azurewebsites.net/usuario/tablero-activo/" +
                Cookies.get("sessionId")
              )
              .then((response) => {
                console.log("responseo= ", response);
                Cookies.set("tableroActivo", response.data.id);

                router.push({
                  // nos vamos pal menu
                  path: "/menu",
                });
              })
              .catch((error) => {
                console.log(error);
              });
          } else {
            console.log("No se ha podido unirse al torneo");
            this.mostrarError("No se ha podido desapuntar");
          }
        })
        .catch((error) => {
          console.log("No se ha podido unirse al torneo");
          console.log(error);
          this.mostrarError("No se ha podido desapuntar");
        });
    },

    empezarPartidaTorneo() {
      console.log("Empezar partida de torneo");

      axios.post('https://lamesa-backend.azurewebsites.net/torneo/jugar', {
        usuario: this.idUsuario,
        torneo: Cookies.get("torneoId"),
      })
        .then((response) => {
          const success = response.status === 200;
          if (success) {
            Cookies.set('jugadores', response.data.jugadores);
            console.log('jugadores en partida: ', response.data.jugadores);
            //Desuscribir del socket
            console.log("cerrando socket");
            this.stompClient.disconnect();

            console.log("Socket connection closed");

            router.push({ path: '/partida', query: { nombreUsuario: Cookies.get('username'), id: response.data.id, jugadores: JSON.stringify(response.data.jugadores), color: response.data.color, hostPrivada: false, esTorneo: true } });
          }
        })
        .catch((error) => {
          this.mostrarError("No se puede crear la partida");
          console.log(error);
        });
    },
    empezarPartidaTorneoFinal() {
      console.log("Empezar partida de torneo  final");

      axios.post('https://lamesa-backend.azurewebsites.net/torneo/jugar-final', {
        usuario: this.idUsuario,
        torneo: Cookies.get("torneoId"),
      })
        .then((response) => {
          const success = response.status === 200;
          if (success) {
            Cookies.set('jugadores', response.data.jugadores);
            console.log('jugadores en partida: ', response.data.jugadores);

            //Desuscribir del socket
            console.log("cerrando socket");
            this.stompClient.disconnect();

            console.log("Socket connection closed");

            router.push({ path: '/partida', query: { nombreUsuario: Cookies.get('username'), id: response.data.id, jugadores: JSON.stringify(response.data.jugadores), color: response.data.color, hostPrivada: false } });
          }
        })
        .catch((error) => {
          this.mostrarError("No se puede crear la partida");
          console.log(error);
        });
    },

    connectToSocketInicio() {
      const url = "https://lamesa-backend.azurewebsites.net/";
      const socket = new SockJS(url + "/ws");
      const stompClient = Stomp.over(socket);
      this.stompClient = stompClient;

      stompClient.connect({}, (frame) => {
        console.log("connected to the frame: " + frame);
        stompClient.subscribe(
          "/topic/torneo/" + Cookies.get("torneoId"),
          (response) => {
            //Un jugador se ha unido a la partida (cuando aún no ha empezado)
            
            this.esperando = false;
          }
        );
      });
    },

    connectToSocketFinal() {
      const url = "https://lamesa-backend.azurewebsites.net/";
      const socket = new SockJS(url + "/ws");
      const stompClient = Stomp.over(socket);
      this.stompClient = stompClient;

      stompClient.connect({}, (frame) => {
        console.log("connected to the frame: " + frame);
        stompClient.subscribe(
          "/topic/final/" + Cookies.get("torneoId"),
          (response) => {
            //Un jugador se ha unido a la partida (cuando aún no ha empezado)
           
            this.esperando = false;
          }
        );
      });
    },

    startCuriosityLoop() {
      setInterval(() => {
        this.curiosity = this.getNextCuriosity();
      }, 12000); // Display each curiosity for 6 seconds
    },
    getNextCuriosity() {
      const curiosity = this.datosCuriososParchis[this.currentIndex];
      this.currentIndex =
        (this.currentIndex + 1) % this.datosCuriososParchis.length;
      return curiosity;
    },
  },

  data() {
    return {
      final: this.$route.query.finalista,
      idUsuario: "",
      monedas: "",
      showError: false,
      datosCuriososParchis: [
        "En una partida de Parchís al revés, las fichas comienzan en la meta y deben retroceder hasta la salida.",
        "En el Parchís mágico, las fichas pueden intercambiar lugares con otras fichas en cualquier momento, creando caos y sorpresas.",
        "Existe una versión gigante del Parchís donde los jugadores se convierten en las fichas y se mueven por un tablero enorme en un parque.",
        "En un mundo de fantasía, las fichas de Parchís pueden montar dragones y unicornios para avanzar rápidamente por el tablero.",
        "Las fichas de Parchís tienen su propio código de vestimenta y se visten con elegantes trajes de época mientras juegan.",
        "En una versión futurista del Parchís, las fichas utilizan tecnología de teletransportación para moverse instantáneamente por el tablero.",
        "Las fichas de Parchís tienen una rivalidad amistosa con las fichas de dominó y a menudo compiten en emocionantes desafíos de habilidad.",
        "En una variante temática de Parchís, las fichas representan diferentes civilizaciones históricas y compiten por el dominio mundial.",
        "El Parchís es conocido en el mundo de los juegos de mesa como el 'Maestro de las Risas' debido a las situaciones cómicas que se producen durante el juego.",
        "Las fichas de Parchís son muy astutas y a veces se disfrazan como fichas de otros juegos para confundir a los jugadores.",
        "En una versión musical del Parchís, las fichas pueden tocar instrumentos y crear melodías mientras avanzan por el tablero.",
        "Las fichas de Parchís tienen una competencia anual de belleza para elegir a la 'Ficha más hermosa del año'.",
        "En un Parchís mágico, las fichas pueden lanzar hechizos para deshacer movimientos o convertir a sus oponentes en ranas temporales.",
        "En una versión de Parchís en el espacio exterior, las fichas pueden saltar de planeta en planeta mientras evitan asteroides y extraterrestres hostiles.",
        "Las fichas de Parchís son famosas por sus habilidades acrobáticas y pueden realizar saltos impresionantes sobre otras fichas en el tablero.",
        "En una edición especial de Parchís, las fichas tienen personalidades distintas y tienen diálogos divertidos entre ellas durante el juego.",
        "Las fichas de Parchís tienen una misión secreta en cada partida y deben completar desafíos para avanzar y cumplir su objetivo final.",
        "En una versión inspirada en la época medieval, las fichas se convierten en caballeros y princesas mientras atraviesan un tablero lleno de castillos y dragones.",
        "Las fichas de Parchís son grandes amantes de la comida y disfrutan de un festín especial cuando llegan a ciertas casillas del tablero.",
        "En un Parchís de aventuras, las fichas exploran tesoros ocultos y enfrentan trampas mortales mientras avanzan hacia la victoria.",
      ],
      curiosity: "",
      currentIndex: 0,
      stompClient: null,
      esperando: true,
    };
  },
  beforeMount() {
    this.idUsuario = Cookies.get("sessionId");
    if (!this.final) {
      this.connectToSocketInicio();
    } else {
      this.connectToSocketFinal(); // hacer
    }
  },
  mounted() {


    this.startCuriosityLoop();
    axios
      .get(
        "https://lamesa-backend.azurewebsites.net/usuario/monedas/" +
        this.idUsuario
      )
      .then((response) => {
        this.monedas = response.data;
      })
      .catch((error) => {
        console.log(error);
      });
  },
};
</script>

<style>
@import "../theme/estilos.css";
@import "../theme/estilosInicio.css";

.loading-spinner-esperando {
  /* Set the width and height of the spinner */
  width: 50px;
  height: 50px;

  /* Center the spinner horizontally */
  margin: 0 auto;

  /* Set the border and border radius */
  border-radius: 50%;
  border: 0.25em solid #ccc;
  border-top-color: #333;

  /* Set the animation properties */
  animation: spin 1s ease-in-out infinite;
}

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
  color: #cd7f32;
  /* bronze color */
}

#botonSalir {
  font-weight: bold;
  width: 80%;
  position: relative;
  bottom: 0;
}
</style>
