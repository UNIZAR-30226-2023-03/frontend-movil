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
        <div>
            <canvas id="parchisBoard" width="400" height="400"></canvas>
        </div>
        <div style="margin-bottom: 20px; overflow: hidden;">
            <IconoJugador :nombreUsuario="jugadores[2].nombre" izquierda="true" class="ion-float-left" style="width: 30%;" />
            <IconoJugador :nombreUsuario="jugadores[3].nombre" izquierda="false" class="ion-float-right" style="width: 30%;"/>
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
};
</script>