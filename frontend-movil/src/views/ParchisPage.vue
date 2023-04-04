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
        <div style="width: 80%; margin: auto;">
            <canvas id="parchisBoard" style="width: 100%"></canvas>
        </div>
        <div style="margin-bottom: 20px; overflow: hidden;">
            <IconoJugador :nombreUsuario="jugadores[2].nombre" izquierda="true" class="ion-float-left" style="width: 30%;" />
            <IconoJugador :nombreUsuario="jugadores[3].nombre" izquierda="false" class="ion-float-right" style="width: 30%;"/>
        </div>
        <div style="width: 30%; margin: auto;">
            <canvas id="dado" style="width: 100%"></canvas>
        </div>

    </div>
</template>

<style>
    @import '../theme/estilos.css';
</style>

<script>
import IconoJugador from '../components/IconoJugador';
export default {
    components: {
        IconoJugador
    },methods:{
        crearTablero(){
            const canvas = document.getElementById('parchisBoard');
            const ctx = canvas.getContext('2d');

            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetWidth;
            console.log(canvas.width);
            // // Carga la imagen del tablero
            const boardImage = new Image();
            boardImage.src = 'assets/tablero.png';

            // Dibuja la imagen en el canvas cuando se haya cargado
            boardImage.onload = function () {
            ctx.drawImage(boardImage, 0, 0, canvas.width, canvas.height);
            }
        },
        crearDado(){
            const canvas = document.getElementById('dado');
            const ctx = canvas.getContext('2d');

            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetWidth;
            // // Carga la imagen del tablero
            const dados = [
                new Image(),
                new Image(),
                new Image(),
                new Image(),
                new Image(),
                new Image()
            ];

            dados[0].src = 'assets/dado/1.png';
            dados[1].src = 'assets/dado/2.png';
            dados[2].src = 'assets/dado/3.png';
            dados[3].src = 'assets/dado/4.png';
            dados[4].src = 'assets/dado/5.png';
            dados[5].src = 'assets/dado/6.png';


            // Dibuja la imagen en el canvas cuando se haya cargado
            dados[0].onload = function () {
                ctx.drawImage(dados[0], 0, 0, canvas.width, canvas.height);
            }
        }
    },
    mounted(){
        this.crearTablero();
        this.crearDado();
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
    }
}
</script>