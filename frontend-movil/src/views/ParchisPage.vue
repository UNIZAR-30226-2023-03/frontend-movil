<template>
    <div class="pantalla">
        <div style="margin-bottom: 20px;">
            <ion-button class="ion-float-left boton">Salir</ion-button>
            <ion-button class="ion-float-right boton">Amigos</ion-button>
        </div>
        <div style="text-align: center;">
            <h1 style="font-size: small; padding-bottom:0; margin-bottom: 0;">TIEMPO</h1>
            <div style="font-size: 60px">{{ tiempoRestante }}</div>
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
            <DadoComponent />
        </div>

    </div>
</template>

<style>
    @import '../theme/estilos.css';
</style>

<script>
import IconoJugador from '../components/IconoJugador';
import DadoComponent from '../components/DadoComponent';
import TableroComponent from '../components/TableroComponent';
import * as SockJS from 'sockjs-client';
import Stomp from 'stompjs';




export default {
    components: {
        IconoJugador,
        DadoComponent,
        TableroComponent
    },
    data() {
        return {
            tiempoRestante: 60,
            jugadores:[
                {id:1, nombre:'PACO'},
                {id:2, nombre:'PEPE'},
                {id:3, nombre:'PEDRO'},
                {id:4, nombre:'PANOLO'}
            ]
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
                stompClient.subscribe("/topic/nuevo-jugador/" + idPartida, function (response) {
                    //Un jugador se ha unido a la partida (cuando aún no ha empezado)
                    const data = JSON.parse(response.body);
                    console.log(data);
                })
                stompClient.subscribe("/topic/salida/" + idPartida, function (response) {
                    //Un jugador ha sacado ficha de casa -> Actualizar tablero
                    const data = JSON.parse(response.body);
                    console.log(data);
                })
                stompClient.subscribe("/topic/movimiento/" + idPartida, function (response) {
                    //Un jugador ha hecho un movimiento -> Actualizar tablero
                    const data = JSON.parse(response.body);
                    console.log(data);
                })
                stompClient.subscribe("/topic/chat/" + idPartida, function (response) {
                    //Mensaje de chat recibido
                    const data = JSON.parse(response.body);
                    console.log(data);
                })
                stompClient.subscribe("/topic/dado/" + idPartida, function (response) {
                    //Dado recibido
                    const data = JSON.parse(response.body);
                    console.log(data);
                })
            })
        }
    },
    mounted(){
        this.connectToSocket();
        // this.movimiento(4, "AMARILLO", 20, 1, "ROJO");
    }
}
</script>