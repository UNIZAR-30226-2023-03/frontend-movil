<template>
    <div v-if="izquierda === 'true'" class="icono" :class="{remarcar:seleccionado}">
        <ion-img style="height: 40px; width: 40px;" src="assets/icono_jugador.png"></ion-img>
        <h4 style="margin-bottom: 0; margin-top: 0;">{{ nombreUsuario }}</h4>
    </div>

    <div v-else class="icono" style="text-align: right;" :class="{remarcar:seleccionado}">
        <div style="overflow: hidden;"><ion-img class="ion-float-right" style="height: 40px; width: 40px;" src="assets/icono_jugador.png"></ion-img></div>
        <h4 style="margin-bottom: 0; margin-top: 0;">{{ nombreUsuario }}</h4>
    </div>
    
</template>

<style>
    .icono{
        width: 100%;
        border-radius: 10px;
        background-color:#cca045;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .remarcar{
        border: 2px solid #ffffff;
    }
</style>

<script>
import { IonImg } from '@ionic/vue';
import { defineComponent } from 'vue';

export default {
    props: ['nombreUsuario',
            'izquierda',
            'seleccionado']
};
</script>