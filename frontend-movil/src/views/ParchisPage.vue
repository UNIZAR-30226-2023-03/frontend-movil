<template>
    <div class="pantalla">
        <div style="margin-bottom: 20px;">
            <ion-button class="ion-float-left boton" @click="logout">Salir</ion-button>
            <ion-button class="ion-float-right boton">Amigos</ion-button>
        </div>
        <div style="text-align: center;">
            <TimerComponent ref="timer" />
        </div>
        <div style="margin-bottom: 20px; overflow: hidden;">
            <IconoJugador :nombreUsuario="jugadores[0].nombre" izquierda="true" :seleccionado="turno === 'AZUL'"
                class="ion-float-left" style="width: 45%;" />
            <IconoJugador :nombreUsuario="jugadores[1].nombre" izquierda="false" :seleccionado="turno === 'AMARILLO'"
                class="ion-float-right" style="width: 45%;" />
        </div>
        <div style="width: 95%; margin: auto;">

            <TableroComponent ref="tablero" @fichaPulsada="realizarMovimiento" />
        </div>
        <div style="margin-bottom: 20px; overflow: hidden;">
            <IconoJugador :nombreUsuario="jugadores[2].nombre" izquierda="true" :seleccionado="turno === 'ROJO'"
                class="ion-float-left" style="width: 45%;" />
            <IconoJugador :nombreUsuario="jugadores[3].nombre" izquierda="false" :seleccionado="turno === 'VERDE'"
                class="ion-float-right" style="width: 45%;" />
        </div>
        <div style="width: 30%; margin: auto;">
            <DadoComponent ref="dado" @click="dadoPulsado" />
        </div>
        <ion-button v-if="hostPrivada === 'true' && !partidaComenzada" @click="comenzarPartidaHost"
            style="position: absolute; width: 50%; left: 25%; top: 45%;">
            COMENZAR PARTIDA
        </ion-button>

        <ion-button name="chatbox"  @click="showModalChat = true">CHAT</ion-button>

        
    </div>

    <Teleport to="body">
  <Chat 
    ref="chatHijo" 
    :show="showModalChat" 
    @close="showModalChat = false"
    :nombreUsuario="nombreUsuario"
    :idPartida="idPartida"
  />
</Teleport>

</template>

<style>
@import '../theme/estilos.css';
</style>

<script>
import axios from 'axios';
import router from "@/router";
import IconoJugador from '../components/IconoJugador';
import DadoComponent from '../components/DadoComponent';
import TableroComponent from '../components/TableroComponent';
import TimerComponent from '../components/TimerComponent';
import * as SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import { defineComponent } from 'vue';
import { IonIcon } from '@ionic/vue';
import { send } from 'ionicons/icons';
import Chat from "@/components/ChatComponent.vue"
import Cookies from 'js-cookie';



export default {
    components: {
        IconoJugador,
        DadoComponent,
        TableroComponent,
        TimerComponent,
        Chat
    },
    data() {
        return {
            showModalChat: false,
            tiempoRestante: 60,
            jugadores: [
                { id: 1, nombre: 'ESPERANDO JUGADOR', ocupado: false },
                { id: 2, nombre: 'ESPERANDO JUGADOR', ocupado: false },
                { id: 3, nombre: 'ESPERANDO JUGADOR', ocupado: false },
                { id: 4, nombre: 'ESPERANDO JUGADOR', ocupado: false }
            ],
            nJugadores: 0,
            turno: "",
            hostPrivada: this.$route.query.hostPrivada,
            partidaComenzada: false,
            nombreUsuario: this.$route.query.nombreUsuario,
            idPartida: this.$route.query.id,
            color: this.$route.query.color,
            miTurno: false,
            valorDado: 0
        }
    },
    methods: {
        logout() {
            Cookies.remove('sessionId');
      // redirigir al usuario a la página de inicio de sesión
      this.$router.push('/');
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
            return 33;
        },
        movimiento(idFicha, colorFicha, nuevaCasilla, idComida = 0, colorComida = 0) {
            //Mover ficha
            const offset = this.offsetColor(colorFicha);
            this.$refs.tablero.fichas[offset + idFicha - 1].casilla = nuevaCasilla;

            //Si hay comida
            if (idComida != 0) {
                const offsetComida = this.offsetColor(colorComida);
                const casillaCasa = this.casaFicha(idComida, colorComida);
                this.$refs.tablero.fichas[offsetComida + idComida - 1].casilla = casillaCasa;
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
                stompClient.subscribe("/topic/nuevo-jugador/" + idPartida, (response) => {
                    //Un jugador se ha unido a la partida (cuando aún no ha empezado)
                    const data = JSON.parse(response.body);
                    console.log(data);
                    this.ocuparJugador(data);
                })
                stompClient.subscribe("/topic/dado/" + idPartida, (response) => {
                    //Un jugador ha sacado ficha de casa -> Actualizar tablero
                    const data = JSON.parse(response.body);
                    console.log(data);

                    if (data.sacar == true) {
                        console.log("sacarSocket");
                        console.log("Casilla: ", data.casilla)
                        //Sacar casilla de casa
                        const numeroFicha = data.casilla.fichas[data.casilla.fichas.length - 1].numero;
                        const colorFicha = data.casilla.fichas[data.casilla.fichas.length - 1].color; //Debería ser siempre mi color
                        const casillaDestino = data.casilla.posicion;
                        this.movimiento(numeroFicha, colorFicha, casillaDestino);
                    }
                    this.actualizarTurno(data.turno);
                })
                stompClient.subscribe("/topic/movimiento/" + idPartida, (response) => {
                    //Un jugador ha hecho un movimiento -> Actualizar tablero
                    const data = JSON.parse(response.body);
                    console.log(data);
                    const casillaDestino = data.destino.posicion;
                    const ficha = data.ficha;
                    if (data.comida != 0) {
                        this.movimiento(ficha.numero, ficha.color, casillaDestino);
                    } else {
                        this.movimiento(ficha.numero, ficha.color, casillaDestino, data.comida.numero, data.comida.color);
                    }
                    this.activarFichas(false);
                    this.$refs.tablero.actualizarPosiciones();
                    this.actualizarTurno(data.turno);
                })
                stompClient.subscribe("/topic/chat/" + idPartida, (response) => {
                    //Mensaje de chat recibido
                    const data = JSON.parse(response.body);
                    console.log(data);
                    this.actualizarChatHijo(data) // actualizamos el chat
                })
                stompClient.subscribe("/topic/turno/" + idPartida, (response) => {
                    //Empezar partida
                    const data = JSON.parse(response.body);
                    this.comenzarPartida(data);
                })
            })
        },
        comenzarPartidaHost() {
            console.log('https://lamesa-backend.azurewebsites.net/partida/empezar/' + this.idPartida)
            axios.post('https://lamesa-backend.azurewebsites.net/partida/empezar/' + this.idPartida, {})
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
            this.actualizarTurno(color);
        },
        realizarTurno() {
            //Realizar jugada
            this.miTurno = true;
            this.$refs.dado.activarDado();
        },
        actualizarTurno(color) {
            if (color != this.turno) {
                //Encender timer
                this.$refs.timer.resetTimer();
                this.$refs.timer.encenderTimer();

                this.turno = color;
                if (this.color == this.turno) {
                    //Toca jugar
                    console.log("Mi turno");
                    this.miTurno = true;
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
            this.$refs.tablero.fichas.forEach(ficha => {
                ficha.activada = activar;
            });
        },
        verMovimientos(valorDado) {
            console.log("verMovimientos");
            axios.post('https://lamesa-backend.azurewebsites.net/partida/dado/' + this.idPartida + "?dado=" + valorDado, {})
                .then((response) => {
                    const success = response.status === 200;
                    if (success) {
                        console.log(response.data);
                        if (response.data.sacar == true) {
                            //Sacar casilla de casa
                            return;  //Se encarga el websocket
                        } else if (response.data.sacar == false && response.data.fichas.length < 4) {
                            //Mostrar todas las fichas del color
                            this.activarFichasColor(this.turno, true);
                            //Desactivar no disponibles
                            const noDisponibles = response.data.fichas;
                            noDisponibles.forEach(ficha => {
                                this.activarFicha(ficha.numero, ficha.color, false);
                            });
                            this.$refs.tablero.actualizarPosiciones();
                            //Guardar dado
                            this.valorDado = valorDado;
                        }
                        //Cambiar de turno si corresponde
                        this.actualizarTurno(response.data.turno);


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
            this.activarFichasColor(this.color, false);

            //Mandar movimiento al backend
            axios.post('https://lamesa-backend.azurewebsites.net/partida/movimiento', {
                partida: this.idPartida,
                ficha: ficha.id,
                dado: this.valorDado
            })
                .then((response) => {
                    const success = response.status === 200;
                    if (success) {
                        //Mover ficha a donde corresponde
                        return  //Se encarga el socket
                    }
                })
                .catch((error) => {
                    console.log(error);
                });
        },
        ocuparJugador(jugador) {
            if (jugador.color == "AZUL") {
                this.jugadores[0].nombre = jugador.username;
                this.jugadores[0].ocupado = true;
            }
            if (jugador.color == "AMARILLO") {
                this.jugadores[1].nombre = jugador.username;
                this.jugadores[1].ocupado = true;
            }
            if (jugador.color == "ROJO") {
                this.jugadores[2].nombre = jugador.username;
                this.jugadores[2].ocupado = true;
            }
            if (jugador.color == "VERDE") {
                this.jugadores[3].nombre = jugador.username;
                this.jugadores[3].ocupado = true;
            }
        }
    },
    mounted() {
        this.connectToSocket(this.idPartida);
        this.ocuparJugador({ color: this.color, username: 'YO' });
    },
    actualizarChatHijo(data) {
        this.$refs.chatHijo.actualizarChat(data);
    }
}
</script>