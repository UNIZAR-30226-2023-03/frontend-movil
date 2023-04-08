<template>
    <div class="pantalla">
        <div style="margin-bottom: 20px;">
            <ion-button class="ion-float-left boton">Salir</ion-button>
            <ion-button class="ion-float-right boton">Amigos</ion-button>
        </div>
        <div style="text-align: center;">
            <TimerComponent ref="timer" />
        </div>
        <div style="margin-bottom: 20px; overflow: hidden;">
            <IconoJugador :nombreUsuario="jugadores[0].nombre" izquierda="true" class="ion-float-left" style="width: 30%;" />
            <IconoJugador :nombreUsuario="jugadores[1].nombre" izquierda="false" class="ion-float-right" style="width: 30%;"/>
        </div>
        <div style="width: 95%; margin: auto;">
        
            <TableroComponent ref="tablero" />
        </div>
        <div style="margin-bottom: 20px; overflow: hidden;">
            <IconoJugador :nombreUsuario="jugadores[2].nombre" izquierda="true" class="ion-float-left" style="width: 30%;" />
            <IconoJugador :nombreUsuario="jugadores[3].nombre" izquierda="false" class="ion-float-right" style="width: 30%;"/>
        </div>
        <div style="width: 30%; margin: auto;">
            <DadoComponent ref="dado" @click="dadoPulsado" />
        </div>
        <ion-button v-if="hostPrivada && !partidaComenzada" @click="comenzarPartidaHost" style="position: absolute; width: 50%; left: 25%; top: 45%;">
            COMENZAR PARTIDA
        </ion-button>
    </div>
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




export default {
    components: {
        IconoJugador,
        DadoComponent,
        TableroComponent,
        TimerComponent
    },
    data() {
        return {
            tiempoRestante: 60,
            jugadores:[
                {id:1, nombre:'PACO'},
                {id:2, nombre:'PEPE'},
                {id:3, nombre:'PEDRO'},
                {id:4, nombre:'PANOLO'}
            ],
            turno:"",
            hostPrivada: this.$route.query.hostPrivada,
            partidaComenzada: false,
            idPartida: this.$route.query.id,
            color: this.$route.query.color,
            miTurno: false
        }
    },
    methods:{
        offsetColor(colorFicha){
            let offset = 0;
            if(colorFicha == "AZUL"){
                offset  = 4;
            }else if(colorFicha == "ROJO"){
                offset = 8;
            }else if(colorFicha == "VERDE"){
                offset = 12;
            }
            return offset;
        },
        casaFicha(id, color){
            //Devuelve la casilla de casa de la ficha en funcion de su id y color
            return 33;
        },
        movimiento(idFicha, colorFicha, nuevaCasilla, idComida = 0, colorComida = 0){
            //Mover ficha
            const offset = this.offsetColor(colorFicha);
            this.$refs.tablero.fichas[offset + idFicha - 1].casilla = nuevaCasilla;

            //Si hay comida
            if(idComida != 0){
                const offsetComida = this.offsetColor(colorComida);
                const casillaCasa = this.casaFicha(idComida, colorComida);
                this.$refs.tablero.fichas[offsetComida + idComida -1].casilla = casillaCasa;
            }

            //Actualizar el tablero
            this.$refs.tablero.actualizarPosiciones();
        },
        connectToSocket(idPartida) {
            const url = "https://lamesa-backend.azurewebsites.net/";
            console.log("connecting to the game");
            const socket = new SockJS(url + "/ws");
            const stompClient = Stomp.over(socket);
            stompClient.connect({}, function (frame) {
                console.log("connected to the frame: " + frame);
                stompClient.subscribe("/topic/nuevo-jugador/" + this.idPartida, function (response) {
                    //Un jugador se ha unido a la partida (cuando aún no ha empezado)
                    const data = JSON.parse(response.body);
                    console.log(data);
                })
                stompClient.subscribe("/topic/dado/" + this.idPartida, function (response) {
                    //Un jugador ha sacado ficha de casa -> Actualizar tablero
                    const data = JSON.parse(response.body);
                    console.log(data);
                })
                stompClient.subscribe("/topic/movimiento/" + this.idPartida, function (response) {
                    //Un jugador ha hecho un movimiento -> Actualizar tablero
                    const data = JSON.parse(response.body);
                    console.log(data);
                })
                stompClient.subscribe("/topic/chat/" + this.idPartida, function (response) {
                    //Mensaje de chat recibido
                    const data = JSON.parse(response.body);
                    console.log(data);
                })
                stompClient.subscribe("/topic/turno/" + this.idPartida, function (response) {
                    //Empezar partida
                    const data = JSON.parse(response.body);
                    console.log(data);
                    this.comenzarPartida(data.color);
                })
            })
        },
        comenzarPartidaHost(){
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
        comenzarPartida(color){
            this.turno = color;
            this.realizarTurno();
        },
        realizarTurno(){
            //Encender timer
            this.$refs.timer.resetTimer();
            this.$refs.timer.encenderTimer();
            //Realizar jugada
            if(this.tuno == this.color){
                this.miTurno = true;
                this.$refs.dado.activarDado();
            }
        },
        actualizarTurno(color){
            this.turno == color;
            if(this.color == this.turno){
                //Toca jugar
                this.miTurno = true;
                this.realizarTurno();
            }
        },
        async dadoPulsado(){
            if(this.$refs.dado.activado){
                const valorDado = await this.$refs.dado.tirarDado();
                this.verMovimientos(valorDado);
            }
        },
        verMovimientos(){
            //COMPLETAR
        }
    },
    mounted(){
        this.connectToSocket();
        // this.movimiento(4, "AMARILLO", 20, 1, "ROJO");
    }
}
</script>