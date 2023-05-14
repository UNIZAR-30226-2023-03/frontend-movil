<template>
  <div class="pantalla">
    <div style="margin-bottom: 20px">
      <ion-button
        class="ion-float-left boton"
        @click="showModalConfirmacion = true"
      >
        <img class="iconoBoton" src="../../public/assets/salir.png" />
      </ion-button>
      <ion-button
        id="chatbutton"
        class="ion-float-right boton"
        :class="{ animado: msgsNuevos }"
        name="chatbox"
        @click="
          showModalChat = true;
          msgsNuevos = false;
        "
      >
        <img class="iconoBoton" src="../../public/assets/chat.png" />
      </ion-button>
    </div>
    <div style="text-align: center">
      <TimerComponent ref="timer" />
    </div>
    <div style="margin-bottom: 20px; overflow: hidden">
      <IconoJugador
        :nombreUsuario="jugadores[1].nombre"
        izquierda="true"
        :seleccionado="turno === 'AZUL'"
        class="ion-float-left"
        style="width: 45%"
      />
      <IconoJugador
        :nombreUsuario="jugadores[0].nombre"
        izquierda="false"
        :seleccionado="turno === 'AMARILLO'"
        class="ion-float-right"
        style="width: 45%"
      />
    </div>
    <div style="width: 95%; margin: auto">
      <TableroComponent
        :jugadores="jugadores"
        ref="tablero"
        @fichaPulsada="realizarMovimiento"
      />
    </div>
    <div style="margin-bottom: 20px; overflow: hidden">
      <IconoJugador
        :nombreUsuario="jugadores[2].nombre"
        izquierda="true"
        :seleccionado="turno === 'ROJO'"
        class="ion-float-left"
        style="width: 45%"
      />
      <IconoJugador
        :nombreUsuario="jugadores[3].nombre"
        izquierda="false"
        :seleccionado="turno === 'VERDE'"
        class="ion-float-right"
        style="width: 45%"
      />
    </div>
    <div style="width: 30%; margin: auto">
      <DadoComponent ref="dado" @click="dadoPulsado" />
    </div>
    <ion-button
      v-if="hostPrivada === 'true' && !partidaComenzada"
      @click="comenzarPartidaHost"
      style="position: absolute; width: 50%; left: 25%; top: 45%"
    >
      COMENZAR PARTIDA
    </ion-button>
  </div>

  <div v-if="activarDebug" style="display: flex; justify-content: flex-start">
    <button
      style="width: 10%"
      @click="
        verMovimientos(1);
        this.$refs.dado.activado = false;
      "
    >
      1
    </button>
    <button
      style="width: 10%"
      @click="
        verMovimientos(2);
        this.$refs.dado.activado = false;
      "
    >
      2
    </button>
    <button
      style="width: 10%"
      @click="
        verMovimientos(3);
        this.$refs.dado.activado = false;
      "
    >
      3
    </button>
    <button
      style="width: 10%"
      @click="
        verMovimientos(4);
        this.$refs.dado.activado = false;
      "
    >
      4
    </button>
    <button
      style="width: 10%"
      @click="
        verMovimientos(5);
        this.$refs.dado.activado = false;
      "
    >
      5
    </button>
    <button
      style="width: 10%"
      @click="
        verMovimientos(6);
        this.$refs.dado.activado = false;
      "
    >
      6
    </button>
  </div>

  <Teleport to="body">
    <Chat
      ref="chatHijo"
      :show="showModalChat"
      @close="showModalChat = false"
      :nombreUsuario="nombreUsuario"
      :idPartida="idPartida"
    />
    <Confirmacion
      :show="showModalConfirmacion"
      :partida="idPartida"
      @close="showModalConfirmacion = false"
    />
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
      tiempoRestante: 60,
      jugadores: [
        {
          id: 1,
          nombre: "ESPERANDO JUGADOR",
          idJugador: -1,
          ocupado: false,
          color: "AMARILLO",
        }, //amarillo 0
        {
          id: 2,
          nombre: "ESPERANDO JUGADOR",
          idJugador: -1,
          ocupado: false,
          color: "AZUL",
        }, // azul 1
        {
          id: 3,
          nombre: "ESPERANDO JUGADOR",
          idJugador: -1,
          ocupado: false,
          color: "ROJO",
        }, //rojo 2
        {
          id: 4,
          nombre: "ESPERANDO JUGADOR",
          idJugador: -1,
          ocupado: false,
          color: "VERDE",
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
      fichasEnMeta: {
        AMARILLO: 0,
        AZUL: 0,
        VERDE: 0,
        ROJO: 0,
      },
    };
  },
  methods: {
    logout() {
      Cookies.remove("sessionId");
      // redirigir al usuario a la página de inicio de sesión
      this.$router.push("/");
    },
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
      if(nuevaCasilla == 74){
        this.fichasEnMeta[colorFicha] ++;
      }

      // Mover ficha
      const offset = this.offsetColor(colorFicha);
      const casillaActual =
        this.$refs.tablero.fichas[offset + idFicha - 1].casilla;
      this.$refs.tablero.casillas[casillaActual].numFichas--; // se va ficha de la antigua casilla
      this.$refs.tablero.fichas[offset + idFicha - 1].casilla =
        casillaCalculada;
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
          const data = JSON.parse(response.body);
          console.log(data);

          if (data.sacar == true) {
            console.log("sacarSocket");
            console.log("Casilla: ", data.casilla);
            //Sacar casilla de casa
            const numeroFicha =
              data.casilla.fichas[data.casilla.fichas.length - 1].numero;
            const colorFicha =
              data.casilla.fichas[data.casilla.fichas.length - 1].color; //Debería ser siempre mi color
            const casillaDestino = data.casilla.posicion;
            this.movimiento(numeroFicha, colorFicha, casillaDestino);
          }

          if (data.vueltaACasa == true) {
            console.log("Vuelta a casa");
            const fichaACasa = data.fichas[0];
            this.movimiento(
              fichaACasa.id,
              fichaACasa.color,
              this.casaFicha(fichaACasa.id, fichaACasa.color)
            );
          }

          this.actualizarTurno(data.turno, false, false);
        });
        stompClient.subscribe("/topic/movimiento/" + idPartida, (response) => {
          //Un jugador ha hecho un movimiento -> Actualizar tablero
          console.log("/topic/movimiento/");
          const data = JSON.parse(response.body);
          console.log(data);
          const casillaDestino = data.destino.posicion;
          const ficha = data.ficha;
          let fichaComida = false;
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
          this.actualizarTurno(data.turno, fichaComida, true);
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
          const data = JSON.parse(response.body);
          this.sacarJugador(data);
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
      this.actualizarTurno(color, false, false);
    },
    realizarTurno() {
      //Realizar jugada
      this.miTurno = true;
      this.$refs.dado.activarDado();
    },
    actualizarTurno(color, fichaComida, movimientoRealizado) {
      let fichasFuera = 0;
      const oc = this.offsetColor(color);
      fichasFuera =
        this.$refs.tablero.fichas[oc + 0].casilla !=
        this.$refs.tablero.fichas[oc + 0].casa
          ? fichasFuera + 1
          : fichasFuera;
      fichasFuera =
        this.$refs.tablero.fichas[oc + 1].casilla !=
        this.$refs.tablero.fichas[oc + 0].casa
          ? fichasFuera + 1
          : fichasFuera;
      fichasFuera =
        this.$refs.tablero.fichas[oc + 2].casilla !=
        this.$refs.tablero.fichas[oc + 0].casa
          ? fichasFuera + 1
          : fichasFuera;
      fichasFuera =
        this.$refs.tablero.fichas[oc + 2].casilla !=
        this.$refs.tablero.fichas[oc + 0].casa
          ? fichasFuera + 1
          : fichasFuera;

      console.log("Actualizando turno. Fichas fuera: ", fichasFuera);
      console.log("Actualizando turno. fichaComida: ", fichaComida);
      console.log(
        "Actualizando turno. movimientoRealizado:: ",
        movimientoRealizado
      );
      console.log("Actualizando turno. valorDado:: ", this.valorDado);

      if (
        color != this.turno ||
        (color == this.turno &&
          fichasFuera > 0 &&
          this.valorDado == 6 &&
          movimientoRealizado) ||
        fichaComida
      ) {
        //Encender timer
        this.$refs.timer.resetTimer();
        this.$refs.timer.encenderTimer();

        this.turno = color;
        if (this.color == this.turno) {
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
    verMovimientos(valorDado) {
      console.log("verMovimientos");
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
              //Sacar casilla de casa
              return; //Se encarga el websocket
            } else if (
              response.data.sacar == false &&
              response.data.fichas.length < 4
            ) {
              //Mostrar todas las fichas del color
              this.activarFichasColor(this.turno, true);
              //Desactivar no disponibles
              const noDisponibles = response.data.fichas;
              noDisponibles.forEach((ficha) => {
                this.activarFicha(ficha.numero, ficha.color, false);
              });
              this.$refs.tablero.actualizarPosiciones();
              //Guardar dado
              this.valorDado = valorDado;
            }
            //Cambiar de turno si corresponde
            this.actualizarTurno(response.data.turno, false, false);
          }
        })
        .catch((error) => {
          console.log(error);
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
      if (this.setAlarm(30)) {
        const valorDado = await this.$refs.dado.tirarDado();
        await this.verMovimientos(valorDado);
        // Seleccionar movimiento aleatorio
        // Realizar movimiento
      }
    },

    async setAlarm(t) {
      this.sleep(1000);
      if (this.miTurno) {
        if (t <= 0) {
          return true;
        } else {
          return this.setAlarm(t - 1);
        }
      } else {
        return false;
      }
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

    this.connectToSocket(this.idPartida);
  },
};
</script>
