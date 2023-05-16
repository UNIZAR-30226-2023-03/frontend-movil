<template>
  <div class="pantalla">
    <div style="margin-bottom: 20px">
      <ion-button class="ion-float-left boton" @click="showModalConfirmacion = true">
        <img class="iconoBoton" src="../../public/assets/salir.png" />
      </ion-button>
      <ion-button id="chatbutton" class="ion-float-right boton" :class="{ animado: msgsNuevos }" name="chatbox" @click="
        showModalChat = true;
      msgsNuevos = false;
      ">
        <img class="iconoBoton" src="../../public/assets/chat.png" />
      </ion-button>
    </div>
    <div style="text-align: center">
      <TimerComponent ref="timer" />
    </div>
    <div style="margin-bottom: 20px; overflow: hidden">
      <IconoJugador :nombreUsuario="jugadores[1].nombre" izquierda="true" :seleccionado="turno === 'AZUL'"
        class="ion-float-left" style="width: 45%" />
      <IconoJugador :nombreUsuario="jugadores[0].nombre" izquierda="false" :seleccionado="turno === 'AMARILLO'"
        class="ion-float-right" style="width: 45%" />
    </div>
    <div style="width: 95%; margin: auto">
      <TableroComponent :jugadores="jugadores" ref="tablero" @fichaPulsada="realizarMovimiento" />
    </div>
    <div style="margin-bottom: 20px; overflow: hidden">
      <IconoJugador :nombreUsuario="jugadores[2].nombre" izquierda="true" :seleccionado="turno === 'ROJO'"
        class="ion-float-left" style="width: 45%" />
      <IconoJugador :nombreUsuario="jugadores[3].nombre" izquierda="false" :seleccionado="turno === 'VERDE'"
        class="ion-float-right" style="width: 45%" />
    </div>
    <div style="width: 30%; margin: auto">
      <DadoComponent ref="dado" @click="dadoPulsado" />
    </div>
    <ion-button v-if="hostPrivada === 'true' && !partidaComenzada" @click="comenzarPartidaHost"
      style="position: absolute; width: 50%; left: 25%; top: 45%; font-weight: bold;">
      COMENZAR PARTIDA
    </ion-button>

    <h1 v-if="hostPrivada === 'false' && !partidaComenzada"
      style="position: absolute; width: 50%; left: 25%; top: 40%; font-weight: bold; background-color: gray; border-radius: 10px; text-align: center;">
      ESPERANDO JUGADORES...
    </h1>

    <h1 v-if="hayPausa === 'true'"
      style="position: absolute; width: 50%; left: 25%; top: 40%; font-weight: bold; background-color: gray; border-radius: 10px; text-align: center;">
      PARTIDA EN PAUSA
    </h1>
    
  </div>

  <div v-if="activarDebug" style="display: flex; justify-content: flex-start">
    <button style="width: 10%" @click="
      verMovimientos(1);
    this.$refs.dado.activado = false;
    ">
      1
    </button>
    <button style="width: 10%" @click="
      verMovimientos(2);
    this.$refs.dado.activado = false;
    ">
      2
    </button>
    <button style="width: 10%" @click="
      verMovimientos(3);
    this.$refs.dado.activado = false;
    ">
      3
    </button>
    <button style="width: 10%" @click="
      verMovimientos(4);
    this.$refs.dado.activado = false;
    ">
      4
    </button>
    <button style="width: 10%" @click="
      verMovimientos(5);
    this.$refs.dado.activado = false;
    ">
      5
    </button>
    <button style="width: 10%" @click="
      verMovimientos(6);
    this.$refs.dado.activado = false;
    ">
      6
    </button>
  </div>

  <Teleport to="body">
    <Chat ref="chatHijo" :show="showModalChat" @close="showModalChat = false" :nombreUsuario="nombreUsuario"
      :idPartida="idPartida" />
    <Confirmacion @cerrarStomp="cerrarConexion" :stompClient="stompClient" :miTurno="miTurno" :show="showModalConfirmacion" :partida="idPartida" @close="showModalConfirmacion = false" />
  </Teleport>
</template>

<style>
@import "../theme/estilos.css";

.animado {
  animation: color-animation 2s infinite ease-in-out;
}

@keyframes color-animation {
  0% {
    --background: rgba(39, 155, 184, 0.432);
  }

  50% {
    --background: rgb(180, 65, 65);
  }

  100% {
    --background: rgba(39, 155, 184, 0.432);
  }
}
</style>

<script>
import axios from "axios";
import router from "@/router";
import IconoJugador from "../components/IconoJugador";
import DadoComponent from "../components/DadoComponent";
import TableroComponent from "../components/TableroComponent";
import TimerComponent from "../components/TimerComponent";
import * as SockJS from "sockjs-client";
import Stomp from "stompjs";
import { defineComponent } from "vue";
import { IonIcon } from "@ionic/vue";
import { send } from "ionicons/icons";
import Chat from "@/components/ChatComponent.vue";
import Confirmacion from "@/components/ConfirmacionSalirComponent.vue";
import Cookies from "js-cookie";
import { IonButton } from "@ionic/vue";

export default {
  components: {
    IconoJugador,
    DadoComponent,
    TableroComponent,
    TimerComponent,
    Chat,
    IonButton,
    Confirmacion,
  },
  data() {
    return {
      msgsNuevos: false,
      showModalConfirmacion: false,
      showModalChat: false,
      tiempoRestante: 25,
      hayPausa: 'false',
      jugadores: [
        {
          id: 1,
          nombre: "ESPERANDO JUGADOR",
          idJugador: -1,
          ocupado: false,
          color: "AMARILLO",
          fichasEnMeta: 0
        }, //amarillo 0
        {
          id: 2,
          nombre: "ESPERANDO JUGADOR",
          idJugador: -1,
          ocupado: false,
          color: "AZUL",
          fichasEnMeta: 0
        }, // azul 1
        {
          id: 3,
          nombre: "ESPERANDO JUGADOR",
          idJugador: -1,
          ocupado: false,
          color: "ROJO",
          fichasEnMeta: 0
        }, //rojo 2
        {
          id: 4,
          nombre: "ESPERANDO JUGADOR",
          idJugador: -1,
          ocupado: false,
          color: "VERDE",
          fichasEnMeta: 0
        }, // verde 3
      ],
      nJugadores: 0,
      turno: "",
      hostPrivada: this.$route.query.hostPrivada,
      partidaComenzada: false,
      nombreUsuario: this.$route.query.nombreUsuario,
      idPartida: this.$route.query.id,
      color: this.$route.query.color,
      miTurno: false,
      valorDado: 0,
      tableroActivo: "",
      activarDebug: true,
      partidaTerminada: false,
      movimientoAMeta: false,
      stompClient: null,
      esTorneo: this.$route.query.esTorneo,
      finalTorneo: false,
      tiempoTurno: 25,
      alarmaEncendida: true
    };
  },
  methods: {
    obtenerId(username) {
      return axios
        .get(
          "https://lamesa-backend.azurewebsites.net/usuario/obtener-id?name=" +
          username,
          {}
        )
        .then((response) => {
          const success = response.status === 200;

          if (success) {
            console.log("Id de usuario consultado:" + response.data);
            return response.data; // devuelve el id del usuario
          }
        })
        .catch((error) => {
          this.mostrarError("Usuario no encontrado", "red");
          console.log(error);
        });
    },
    offsetColor(colorFicha) {
      let offset = 0;
      if (colorFicha == "AZUL") {
        offset = 4;
      } else if (colorFicha == "ROJO") {
        offset = 8;
      } else if (colorFicha == "VERDE") {
        offset = 12;
      }
      return offset;
    },
    casaFicha(id, color) {
      //Devuelve la casilla de casa de la ficha en funcion de su id y color
      const offset = this.offsetColor(color);
      console.log("Ficha ", offset + id - 1);
      return this.$refs.tablero.fichas[offset + id - 1].casa;
    },
    movimiento(
      idFicha,
      colorFicha,
      nuevaCasilla,
      idComida = 0,
      colorComida = 0
    ) {
      let casillaCalculada = nuevaCasilla;
      if (nuevaCasilla >= 68 && nuevaCasilla < 76) {
        casillaCalculada =
          92 + this.offsetColor(colorFicha) * 2 + nuevaCasilla - 68;
      }
      console.log("Casilla calculada:", casillaCalculada);

      // Comprobar si esta en meta
      if (nuevaCasilla == 75) {
        this.jugadores.find(item => item.color == colorFicha).fichasEnMeta++;
        this.movimientoAMeta = true;
      } else {
        this.movimientoAMeta = false;
      }

      // Mover ficha
      const offset = this.offsetColor(colorFicha);
      const casillaActual = this.$refs.tablero.fichas[offset + idFicha - 1].casilla;
      this.$refs.tablero.casillas[casillaActual].numFichas--; // se va ficha de la antigua casilla
      this.$refs.tablero.fichas[offset + idFicha - 1].casilla = casillaCalculada;
      this.$refs.tablero.casillas[casillaCalculada].numFichas++; // lega ficha a la nueva casilla

      //Si hay comida
      if (idComida != 0) {
        const offsetComida = this.offsetColor(colorComida);
        const casillaCasa = this.casaFicha(idComida, colorComida);

        const casillaComida =
          this.$refs.tablero.fichas[offsetComida + idComida - 1].casilla;
        this.$refs.tablero.casillas[casillaComida].numFichas--;

        const casillaActual =
          this.$refs.tablero.fichas[offset + idFicha - 1].casilla;
        this.$refs.tablero.fichas[offsetComida + idComida - 1].casilla =
          casillaCasa; // pon la ficha que ha sido comida en su casa y no en 33
      }

      //Actualizar el tablero
      this.$refs.tablero.actualizarPosiciones();
    },
    connectToSocket(idPartida) {
      const url = "https://lamesa-backend.azurewebsites.net/";
      console.log("connecting to the game");
      const socket = new SockJS(url + "/ws");
      const stompClient = Stomp.over(socket);
      this.stompClient = stompClient;
      stompClient.connect({}, (frame) => {
        console.log("connected to the frame: " + frame);
        stompClient.subscribe(
          "/topic/nuevo-jugador/" + idPartida,
          (response) => {
            //Un jugador se ha unido a la partida (cuando aún no ha empezado)
            const data = JSON.parse(response.body);
            console.log("Nuevo jugador response: ", data);
            this.ocuparJugador(data);
          }
        );
        stompClient.subscribe("/topic/dado/" + idPartida, (response) => {
          //Un jugador ha sacado ficha de casa -> Actualizar tablero
          this.partidaComenzada = true;
          const data = JSON.parse(response.body);
          console.log(data);

          if (data.sacar == true) {
            console.log("sacarSocket");
            console.log("Casilla: ", data.casilla);
            //Sacar casilla de casa
            const numeroFicha =
              data.fichas[data.fichas.length - 1].numero;
            const colorFicha =
              data.fichas[data.fichas.length - 1].color; //Debería ser siempre mi color
            const casillaDestino = data.casilla.posicion;
            this.movimiento(numeroFicha, colorFicha, casillaDestino);
          }

          if (data.vueltaACasa == true) {
            console.log("Vuelta a casa");
            const fichaACasa = data.fichas[0];
            this.movimiento(
              fichaACasa.numero,
              fichaACasa.color,
              this.casaFicha(fichaACasa.numero, fichaACasa.color)
            );
          }

          this.actualizarTurno(data.turno, false, false, data.vueltaACasa, false);
        });
        stompClient.subscribe("/topic/movimiento/" + idPartida, (response) => {
          //Un jugador ha hecho un movimiento -> Actualizar tablero
          this.partidaComenzada = true;
          console.log("/topic/movimiento/");
          const data = JSON.parse(response.body);
          console.log(data);
          
          if (data.vueltaACasa) {
            return;
          }

          const casillaDestino = data.destino.posicion;
          const ficha = data.ficha;
          let fichaComida = false;
          this.fichaComida = data.comida != null;
          if (data.comida == null) {
            this.movimiento(ficha.numero, ficha.color, casillaDestino);
          } else {
            this.movimiento(
              ficha.numero,
              ficha.color,
              casillaDestino,
              data.comida.numero,
              data.comida.color
            );
            fichaComida = true;
          }
          this.activarFichas(false);
          this.$refs.tablero.actualizarPosiciones();

          this.partidaTerminada = data.acabada;
          this.finalTorneo = data.finalTorneo;
          this.actualizarTurno(data.turno, fichaComida, true, false, false);
        });
        stompClient.subscribe("/topic/chat/" + idPartida, (response) => {
          //Mensaje de chat recibido
          this.msgsNuevos = true;

          const data = JSON.parse(response.body);
          console.log(data);
        });
        stompClient.subscribe("/topic/turno/" + idPartida, (response) => {
          //Empezar partida
          const data = JSON.parse(response.body);
          this.comenzarPartida(data);
        });
        stompClient.subscribe("/topic/salir/" + idPartida, (response) => { 
          //Sacar a alguien de la partida
          this.jugadorSacar = JSON.parse(response.body);

          if (this.hayPausa == 'false' || this.turno != this.jugadorSacar) {  // las fichas del jugador que ha puesto la pausa no se quitan si sale
            this.sacarJugador(this.jugadorSacar);
            this.jugadorSacar = null;
          }
          
        });
        stompClient.subscribe("/topic/pausa/" + idPartida, (response) => {
          //Sacar a alguien de la partida
          console.log('VALOR DE THIS.HAYPAUSA = ',this.hayPausa,' RESPONSE BODY = ',response.body);
          const data = JSON.parse(response.body);
          if (this.jugadorSacar) {
            this.sacarJugador(this.jugadorSacar); // si se había salido el jugador que puso pausa, no se ha reconectado a tiempo y hay que quitar sus fichas
          }
          
          if(this.hayPausa == 'true'){
            this.actualizarTurno(this.turno, false, false, false, false);
          }
          this.hayPausa = response.body; //Llega un true si un jugador (distinto a mí) ha puesto la pausa, y false si la pausa ha finalizado.
        });
        stompClient.subscribe("/topic/ultimo/" + idPartida, (response) => {
          //Sacar a alguien de la partida
          const data = response.body;
          console.log(data);
          this.ganarPorAbandono(this.color);
        });

      });
    },
    comenzarPartidaHost() {
      console.log(
        "https://lamesa-backend.azurewebsites.net/partida/empezar/" +
        this.idPartida
      );
      axios
        .post(
          "https://lamesa-backend.azurewebsites.net/partida/empezar/" +
          this.idPartida,
          {}
        )
        .then((response) => {
          const success = response.status === 200;
          if (success) {
            this.partidaComenzada = true;
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    comenzarPartida(color) {
      this.partidaComenzada = true;
      this.actualizarTurno(color, false, false, false, false);
    },
    realizarTurno() {
      //Realizar jugada
      this.miTurno = true;
      if(this.fichaComida){
        console.log("Ficha comida. Forzando turno");
        this.forzarDado(20);
        return;
      }
      if(this.movimientoAMeta){
        console.log("Ficha en meta. Forzando turno");
        this.forzarDado(10);
        return;
      }

      this.$refs.dado.activarDado();
      this.esperarTiempo()
    },
    actualizarTurno(color, fichaComida, movimientoRealizado, vueltaACasa, desdeVerMovimientos) {
      if (this.partidaTerminada) {
        this.terminarPartida();
      }

      let fichasFuera = 0;
      const oc = this.offsetColor(color);
      fichasFuera = this.$refs.tablero.fichas[oc + 0].casilla != this.$refs.tablero.fichas[oc + 0].casa ? fichasFuera + 1 : fichasFuera;
      fichasFuera = this.$refs.tablero.fichas[oc + 1].casilla != this.$refs.tablero.fichas[oc + 0].casa ? fichasFuera + 1 : fichasFuera;
      fichasFuera = this.$refs.tablero.fichas[oc + 2].casilla != this.$refs.tablero.fichas[oc + 0].casa ? fichasFuera + 1 : fichasFuera;
      fichasFuera = this.$refs.tablero.fichas[oc + 2].casilla != this.$refs.tablero.fichas[oc + 0].casa ? fichasFuera + 1 : fichasFuera;

      console.log("Actualizando turno. Fichas fuera: ", fichasFuera);
      console.log("Actualizando turno. fichaComida: ", fichaComida);
      console.log(
        "Actualizando turno. movimientoRealizado:: ",
        movimientoRealizado
      );
      console.log("Actualizando turno. valorDado:: ", this.valorDado);

      //Encender timer
      this.$refs.timer.resetTimer();
      this.$refs.timer.encenderTimer();

      if (
        color != this.turno ||
        (color == this.turno && fichasFuera > 0 && this.valorDado == 6 && movimientoRealizado) ||
        fichaComida ||
        color == this.turno && this.movimientoAMeta ||
        color == this.turno && vueltaACasa ||
        color == this.turno && this.hayPausa
      ) {
        this.turno = color;
        if (this.color == this.turno && !desdeVerMovimientos) {
          //Toca jugar
          console.log("Mi turno");
          this.realizarTurno();
        }
      }
    },

    async dadoPulsado() {
      if (this.$refs.dado.activado) {
        const valorDado = await this.$refs.dado.tirarDado();
        console.log("Valor dado:", valorDado);
        this.verMovimientos(valorDado);
      }
    },
    forzarDado(x){
      this.verMovimientos(x);
    }
    ,
    activarFichasColor(color, activar) {
      const inicio = this.offsetColor(color); // 0 4 8 12
      this.$refs.tablero.fichas[inicio].activada = activar;
      this.$refs.tablero.fichas[inicio + 1].activada = activar;
      this.$refs.tablero.fichas[inicio + 2].activada = activar;
      this.$refs.tablero.fichas[inicio + 3].activada = activar;
    },
    activarFicha(numero, color, activar) {
      const inicio = this.offsetColor(color); // 0 4 8 12
      this.$refs.tablero.fichas[inicio + numero - 1].activada = activar;
    },
    activarFichas(activar) {
      this.$refs.tablero.fichas.forEach((ficha) => {
        ficha.activada = activar;
      });
    },
    async verMovimientos(valorDado) {
      console.log("verMovimientos");
      return new Promise((resolve, reject) => {
        axios
          .post(
            "https://lamesa-backend.azurewebsites.net/partida/dado/" +
            this.idPartida +
            "?dado=" +
            valorDado,
            {}
          )
          .then((response) => {
            const success = response.status === 200;
            if (success) {
              console.log(response.data);
              if (response.data.sacar == true) {
                // Sacar casilla de casa
                resolve(); // Se encarga el websocket
              } else if (
                response.data.sacar == false &&
                response.data.fichas.length < 4
              ) {
                // Mostrar todas las fichas del color
                if (!response.data.vueltaACasa) {
                  this.activarFichasColor(this.turno, true);
                }
                // Desactivar no disponibles
                const noDisponibles = response.data.fichas;
                noDisponibles.forEach((ficha) => {
                  this.activarFicha(ficha.numero, ficha.color, false);
                });
                this.$refs.tablero.actualizarPosiciones();
                // Guardar dado
                this.valorDado = valorDado;
              }
              // Cambiar de turno si corresponde
              this.actualizarTurno(response.data.turno, false, false, false, true);
              resolve();
            }
          })
          .catch((error) => {
            console.log(error);
            reject(error);
          });
      });
    },
    realizarMovimiento(event, ficha) {
      if (!ficha.activada) {
        return;
      }
      console.log("Ficha seleccionada");
      this.miTurno = false;

      console.log(this.color);
      this.activarFichas(false);

      //Mandar movimiento al backend
      axios
        .post("https://lamesa-backend.azurewebsites.net/partida/movimiento", {
          partida: this.idPartida,
          ficha: ficha.id,
          dado: this.valorDado,
        })
        .then((response) => {
          const success = response.status === 200;
          if (success) {
            //Mover ficha a donde corresponde
            return; //Se encarga el socket
          } else {
            console.log("Error al mandar movimiento. Estado ", response.status);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    ocuparJugador(jugador) {
      let idJugador;

      //poblamos el vector con la id del usuario (habrá que comprobar a la hora de poner las skins que no sea -1 o -2)
      if (jugador.username == "YO") {
        // si eres el jugador local ya pones tus skins con la variable que se le pasa a tableroComponent
        idJugador = -2;
        console.log("soy yo en el ocupar");
        if (jugador.color == "AMARILLO") {
          this.jugadores[0].nombre = jugador.username;
          this.jugadores[0].ocupado = true;
          this.jugadores[0].idJugador = idJugador;
        }
        if (jugador.color == "AZUL") {
          this.jugadores[1].nombre = jugador.username;
          this.jugadores[1].ocupado = true;
          this.jugadores[1].idJugador = idJugador;
        }
        if (jugador.color == "ROJO") {
          this.jugadores[2].nombre = jugador.username;
          this.jugadores[2].ocupado = true;
          this.jugadores[2].idJugador = idJugador;
        }
        if (jugador.color == "VERDE") {
          this.jugadores[3].nombre = jugador.username;
          this.jugadores[3].ocupado = true;
          this.jugadores[3].idJugador = idJugador;
        }
        console.log("jugadores en ocupar 0 ", this.jugadores[0]);
        console.log("jugadores en ocupar 1 ", this.jugadores[1]);
      } else {
        this.obtenerId(jugador.username)
          .then((idJugador) => {
            console.log("otro jugador en el ocupar con id: ", idJugador);
            console.log("jugador.color antes del if: ", jugador.color);

            if (jugador.color == "AMARILLO") {
              this.jugadores[0].nombre = jugador.username;
              this.jugadores[0].ocupado = true;
              this.jugadores[0].idJugador = idJugador;
            }
            if (jugador.color == "AZUL") {
              this.jugadores[1].nombre = jugador.username;
              this.jugadores[1].ocupado = true;
              this.jugadores[1].idJugador = idJugador;
            }
            if (jugador.color == "ROJO") {
              this.jugadores[2].nombre = jugador.username;
              this.jugadores[2].ocupado = true;
              this.jugadores[2].idJugador = idJugador;
            }
            if (jugador.color == "VERDE") {
              this.jugadores[3].nombre = jugador.username;
              this.jugadores[3].ocupado = true;
              this.jugadores[3].idJugador = idJugador;
            }
            console.log("jugadores en ocupar 0 ", this.jugadores[0]);
            console.log("jugadores en ocupar 1 ", this.jugadores[1]);
            //this.$refs.tablero.ponerSkinDeLosJugadores(this.jugadores);
            this.$refs.tablero.actualizarPosiciones();
          })
          .catch((error) => {
            console.log("Error:", error);
          });
      }
    },
    sleep(milliseconds) {
      return new Promise((resolve) => setTimeout(resolve, milliseconds));
    },

    async esperarTiempo() {
      await this.apagarAlarmas();
      if (await this.setAlarm(this.tiempoTurno)) {
        console.log("Se acabo el tiempo");
        console.log("Dado activado: ", this.$refs.dado.activado);

        if (this.$refs.dado.activado) {
          console.log("Tirando dado");
          const valorDado = await this.$refs.dado.tirarDado();
          console.log("Valor del dado: ", valorDado);
          await this.verMovimientos(valorDado);
          console.log("Movimientos mostrados");
        }
        // Seleccionar movimiento aleatorio
        const fichaSeleccionada = this.fichaActivaRandom();
        console.log("Ficha seleccionada: ", fichaSeleccionada, ". Realizando movimiento");
        // Realizar movimiento
        this.realizarMovimiento(null, fichaSeleccionada);
      }
    },

    async apagarAlarmas(){
      this.alarmaEncendida = false;
      await this.sleep(1000);
      this.alarmaEncendida = true;
      return true;
    },

    async setAlarm(t) {
      await this.sleep(1000);
      console.log("alarma:", t)
      if (this.turno == this.color && this.alarmaEncendida) {
        if (t <= 0) {
          return true;
        } else {
          return this.setAlarm(t - 1);
        }
      } else {
        return false;
      }
    },

    fichaActivaRandom() {
      const activas = this.$refs.tablero.fichas.filter(item => item.activada == true);
      const indiceAleatorio = Math.floor(Math.random() * activas.length);
      const fichaAleatoria = activas[indiceAleatorio];
      return fichaAleatoria;
    },

    sacarJugador(jugador) {
      console.log(jugador);
      // Avisar

      // Mover fichas a casa
      this.movimiento(1, jugador, this.casaFicha(1, jugador));
      this.movimiento(2, jugador, this.casaFicha(2, jugador));
      this.movimiento(3, jugador, this.casaFicha(3, jugador));
      this.movimiento(4, jugador, this.casaFicha(4, jugador));

      // Modificar nombre
    },

    terminarPartida() {
      console.log("Terminando partida");
      // Ordenar jugadores por fichas en meta
      this.jugadores.sort((a, b) => (b.fichasEnMeta - a.fichasEnMeta))

      // Ir a pantalla de fin
      router.push({
        path: '/final',
        query: {
          primero: this.jugadores[0].nombre,
          segundo: this.jugadores[1].nombre,
          tercero: this.jugadores[2].nombre,
          cuarto: this.jugadores[3].nombre,
          esTorneo: this.esTorneo,
          finalTorneo: this.finalTorneo
        }
      });
    },

    ganarPorAbandono(color) {
      console.log("Terminando partida");
      this.partidaTerminada = true;
      // Ordenar jugadores por fichas en meta
      this.jugadores.sort((a, b) => (b.fichasEnMeta - a.fichasEnMeta))

      // Poner el color el primero
      for (let index = 1; index < 4; index++) {

        if (this.jugadores[index].color == this.color) {
          const j = this.jugadores[index];
          this.jugadores[index] = this.jugadores[index - 1];
          this.jugadores[index - 1] = j;
        }
      }

      // Ir a pantalla de fin
      router.push({
            path: '/final',
            query: {
              primero: this.jugadores[0].nombre,
              segundo: this.jugadores[1].nombre,
              tercero: this.jugadores[2].nombre,
              cuarto: this.jugadores[3].nombre,
              esTorneo: this.esTorneo,
              finalTorneo: this.finalTorneo
            }
          });
    },

    cerrarConexion(){
       console.log("cerrando socket");
        this.stompClient.disconnect();
        router.push({
            path: '/menu'
          });
        console.log("Socket connection closed");
    },

    repoblarTablero(){
      console.log("Replobando tablero al reconectar");
      const fichasRecuperadas = JSON.parse(this.$route.query.fichas);
      console.log(fichasRecuperadas);
      fichasRecuperadas.forEach((f) => {
        if(f.length > 0){
          console.log(f);
          this.movimiento(f[0].numero, f[0].color, f[0].casilla.posicion);
        }
      });
    }

  },
  beforeMount() {
    Cookies.set("miColor", this.color);
  },
  mounted() {
    const jugadores = JSON.parse(this.$route.query.jugadores);
    this.ocuparJugador({ color: this.color, username: "YO" });

    console.log("Jugadores:", jugadores);

    jugadores.forEach((j) => {
      this.ocuparJugador({ color: j.color, username: j.username });
      console.log("cookies get");
    });

    if(this.$route.query.reconectado){
      this.hayPausa = 'true';
      this.turno = this.$route.query.turno;
      //this.miTurno = this.turno = this.color;
      this.repoblarTablero();
    }

    this.connectToSocket(this.idPartida);
  },
};
</script>
