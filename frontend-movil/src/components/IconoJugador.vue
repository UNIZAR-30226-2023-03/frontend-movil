<template>
    <div v-if="izquierda === 'true'" style="width: 100%;">
        <ion-img style="height: 40px; width: 40px;" src="assets/icono_jugador.png"></ion-img>
        <h4 style="margin-bottom: 0; margin-top: 0;">{{ nombreUsuario }}</h4>
    </div>

    <div v-else style="text-align: right;">
        <div style="overflow: hidden;"><ion-img class="ion-float-right" style="height: 40px; width: 40px;" src="assets/icono_jugador.png"></ion-img></div>
        <h4 style="margin-bottom: 0; margin-top: 0;">{{ nombreUsuario }}</h4>
    </div>

    
</template>


<script>
export default {
    props: ['seleccionado',
            'nombreUsuario',
            'izquierda']
};
</script>