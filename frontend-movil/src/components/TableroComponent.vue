<template>
    <button style="border-radius: 50%;" v-for="(ficha, index) in fichas" :id="ficha.idFicha" :key="index"
        @click="$emit('fichaPulsada', $event, ficha)"> </button>

    <canvas id="parchisBoard" style="width: 100%; border-radius: 10px;"></canvas>
</template>

<script>
import Cookies from 'js-cookie';
import axios from 'axios';
import { IonButton } from '@ionic/vue';
import { defineComponent } from 'vue';

export default {
    data() {
        return {
            miColor: 'AMARILLO',
            fichaActiva: '',
            tableroActivo: '',
            fichas: [
                { idFicha: 'y1', id: 1, color: 'AMARILLO', casilla: 76, casa: 76, colorEstilo: 'yellow', activada: false },
                { idFicha: 'y2', id: 2, color: 'AMARILLO', casilla: 77, casa: 77, colorEstilo: 'yellow', activada: false },
                { idFicha: 'y3', id: 3, color: 'AMARILLO', casilla: 78, casa: 78, colorEstilo: 'yellow', activada: false },
                { idFicha: 'y4', id: 4, color: 'AMARILLO', casilla: 79, casa: 79, colorEstilo: 'yellow', activada: false },
                { idFicha: 'b1', id: 1, color: 'AZUL', casilla: 80, casa: 80, colorEstilo: 'blue', activada: false },
                { idFicha: 'b2', id: 2, color: 'AZUL', casilla: 81, casa: 81, colorEstilo: 'blue', activada: false },
                { idFicha: 'b3', id: 3, color: 'AZUL', casilla: 82, casa: 82, colorEstilo: 'blue', activada: false },
                { idFicha: 'b4', id: 4, color: 'AZUL', casilla: 83, casa: 83, colorEstilo: 'blue', activada: false },
                { idFicha: 'r1', id: 1, color: 'ROJO', casilla: 84, casa: 84, colorEstilo: 'red', activada: false },
                { idFicha: 'r2', id: 2, color: 'ROJO', casilla: 85, casa: 85, colorEstilo: 'red', activada: false },
                { idFicha: 'r3', id: 3, color: 'ROJO', casilla: 86, casa: 86, colorEstilo: 'red', activada: false },
                { idFicha: 'r4', id: 4, color: 'ROJO', casilla: 87, casa: 87, colorEstilo: 'red', activada: false },
                { idFicha: 'g1', id: 1, color: 'VERDE', casilla: 88, casa: 88, colorEstilo: 'green', activada: false },
                { idFicha: 'g2', id: 2, color: 'VERDE', casilla: 89, casa: 89, colorEstilo: 'green', activada: false },
                { idFicha: 'g3', id: 3, color: 'VERDE', casilla: 90, casa: 90, colorEstilo: 'green', activada: false },
                { idFicha: 'g4', id: 4, color: 'VERDE', casilla: 91, casa: 91, colorEstilo: 'green', activada: false }
            ],
            casillas: [
                { idCasilla: 0, numCasilla: 1, x: 0.9477911647, y: 0.3949468085, numFichas: 0, esVertical: true },
                { idCasilla: 1, numCasilla: 2, x: 0.9022757697, y: 0.3949468085, numFichas: 0, esVertical: true },
                { idCasilla: 2, numCasilla: 3, x: 0.8567603748, y: 0.3949468085, numFichas: 0, esVertical: true },
                { idCasilla: 3, numCasilla: 4, x: 0.8112449799, y: 0.3949468085, numFichas: 0, esVertical: true },
                { idCasilla: 4, numCasilla: 5, x: 0.765729585, y: 0.3949468085, numFichas: 0, esVertical: true },
                { idCasilla: 5, numCasilla: 6, x: 0.7202141901, y: 0.3949468085, numFichas: 0, esVertical: true },
                { idCasilla: 6, numCasilla: 7, x: 0.6746987952, y: 0.3949468085, numFichas: 0, esVertical: true },
                { idCasilla: 7, numCasilla: 8, x: 0.6291834003, y: 0.3949468085, numFichas: 0, esVertical: true },
                { idCasilla: 8, numCasilla: 9, x: 0.6010709505, y: 0.3670212766, numFichas: 0, esVertical: false },
                { idCasilla: 9, numCasilla: 10, x: 0.6010709505, y: 0.3218085106, numFichas: 0, esVertical: false },
                { idCasilla: 10, numCasilla: 11, x: 0.6010709505, y: 0.2765957447, numFichas: 0, esVertical: false },
                { idCasilla: 11, numCasilla: 12, x: 0.6010709505, y: 0.2313829787, numFichas: 0, esVertical: false },
                { idCasilla: 12, numCasilla: 13, x: 0.6010709505, y: 0.1861702128, numFichas: 0, esVertical: false },
                { idCasilla: 13, numCasilla: 14, x: 0.6010709505, y: 0.1409574468, numFichas: 0, esVertical: false },
                { idCasilla: 14, numCasilla: 15, x: 0.6010709505, y: 0.09574468085, numFichas: 0, esVertical: false },
                { idCasilla: 15, numCasilla: 16, x: 0.6010709505, y: 0.05053191489, numFichas: 0, esVertical: false },
                { idCasilla: 16, numCasilla: 17, x: 0.4979919679, y: 0.05053191489, numFichas: 0, esVertical: false },
                { idCasilla: 17, numCasilla: 18, x: 0.3962516734, y: 0.05053191489, numFichas: 0, esVertical: false },
                { idCasilla: 18, numCasilla: 19, x: 0.3962516734, y: 0.09574468085, numFichas: 0, esVertical: false },
                { idCasilla: 19, numCasilla: 20, x: 0.3962516734, y: 0.1409574468, numFichas: 0, esVertical: false },
                { idCasilla: 20, numCasilla: 21, x: 0.3962516734, y: 0.1861702128, numFichas: 0, esVertical: false },
                { idCasilla: 21, numCasilla: 22, x: 0.3962516734, y: 0.2313829787, numFichas: 0, esVertical: false },
                { idCasilla: 22, numCasilla: 23, x: 0.3962516734, y: 0.2765957447, numFichas: 0, esVertical: false },
                { idCasilla: 23, numCasilla: 24, x: 0.3962516734, y: 0.3218085106, numFichas: 0, esVertical: false },
                { idCasilla: 24, numCasilla: 25, x: 0.3962516734, y: 0.3670212766, numFichas: 0, esVertical: false },
                { idCasilla: 25, numCasilla: 26, x: 0.3627844712, y: 0.3949468085, numFichas: 0, esVertical: true },
                { idCasilla: 26, numCasilla: 27, x: 0.3172690763, y: 0.3949468085, numFichas: 0, esVertical: true },
                { idCasilla: 27, numCasilla: 28, x: 0.2717536814, y: 0.3949468085, numFichas: 0, esVertical: true },
                { idCasilla: 28, numCasilla: 29, x: 0.2262382865, y: 0.3949468085, numFichas: 0, esVertical: true },
                { idCasilla: 29, numCasilla: 30, x: 0.1807228916, y: 0.3949468085, numFichas: 0, esVertical: true },
                { idCasilla: 30, numCasilla: 31, x: 0.1352074967, y: 0.3949468085, numFichas: 0, esVertical: true },
                { idCasilla: 31, numCasilla: 32, x: 0.08969210174, y: 0.3949468085, numFichas: 0, esVertical: true },
                { idCasilla: 32, numCasilla: 33, x: 0.04417670683, y: 0.3949468085, numFichas: 0, esVertical: true },
                { idCasilla: 33, numCasilla: 34, x: 0.04417670683, y: 0.5026595745, numFichas: 0, esVertical: true },
                { idCasilla: 34, numCasilla: 35, x: 0.04417670683, y: 0.6037234043, numFichas: 0, esVertical: true },
                { idCasilla: 35, numCasilla: 36, x: 0.08969210174, y: 0.6037234043, numFichas: 0, esVertical: true },
                { idCasilla: 36, numCasilla: 37, x: 0.1352074967, y: 0.6037234043, numFichas: 0, esVertical: true },
                { idCasilla: 37, numCasilla: 38, x: 0.1807228916, y: 0.6037234043, numFichas: 0, esVertical: true },
                { idCasilla: 38, numCasilla: 39, x: 0.2262382865, y: 0.6037234043, numFichas: 0, esVertical: true },
                { idCasilla: 39, numCasilla: 40, x: 0.2717536814, y: 0.6037234043, numFichas: 0, esVertical: true },
                { idCasilla: 40, numCasilla: 41, x: 0.3172690763, y: 0.6037234043, numFichas: 0, esVertical: true },
                { idCasilla: 41, numCasilla: 42, x: 0.3627844712, y: 0.6037234043, numFichas: 0, esVertical: true },
                { idCasilla: 42, numCasilla: 43, x: 0.3962516734, y: 0.6329787234, numFichas: 0, esVertical: false },
                { idCasilla: 43, numCasilla: 44, x: 0.3962516734, y: 0.6781914894, numFichas: 0, esVertical: false },
                { idCasilla: 44, numCasilla: 45, x: 0.3962516734, y: 0.7234042553, numFichas: 0, esVertical: false },
                { idCasilla: 45, numCasilla: 46, x: 0.3962516734, y: 0.7686170213, numFichas: 0, esVertical: false },
                { idCasilla: 46, numCasilla: 47, x: 0.3962516734, y: 0.8138297872, numFichas: 0, esVertical: false },
                { idCasilla: 47, numCasilla: 48, x: 0.3962516734, y: 0.8590425532, numFichas: 0, esVertical: false },
                { idCasilla: 48, numCasilla: 49, x: 0.3962516734, y: 0.9042553191, numFichas: 0, esVertical: false },
                { idCasilla: 49, numCasilla: 50, x: 0.3962516734, y: 0.9494680851, numFichas: 0, esVertical: false },
                { idCasilla: 50, numCasilla: 51, x: 0.4979919679, y: 0.9494680851, numFichas: 0, esVertical: false },
                { idCasilla: 51, numCasilla: 52, x: 0.6010709505, y: 0.9494680851, numFichas: 0, esVertical: false },
                { idCasilla: 52, numCasilla: 53, x: 0.6010709505, y: 0.9042553191, numFichas: 0, esVertical: false },
                { idCasilla: 53, numCasilla: 54, x: 0.6010709505, y: 0.8590425532, numFichas: 0, esVertical: false },
                { idCasilla: 54, numCasilla: 55, x: 0.6010709505, y: 0.8138297872, numFichas: 0, esVertical: false },
                { idCasilla: 55, numCasilla: 56, x: 0.6010709505, y: 0.7686170213, numFichas: 0, esVertical: false },
                { idCasilla: 56, numCasilla: 57, x: 0.6010709505, y: 0.7234042553, numFichas: 0, esVertical: false },
                { idCasilla: 57, numCasilla: 58, x: 0.6010709505, y: 0.6781914894, numFichas: 0, esVertical: false },
                { idCasilla: 58, numCasilla: 59, x: 0.6010709505, y: 0.6329787234, numFichas: 0, esVertical: false },
                { idCasilla: 59, numCasilla: 60, x: 0.6291834003, y: 0.6037234043, numFichas: 0, esVertical: true },
                { idCasilla: 60, numCasilla: 61, x: 0.6746987952, y: 0.6037234043, numFichas: 0, esVertical: true },
                { idCasilla: 61, numCasilla: 62, x: 0.7202141901, y: 0.6037234043, numFichas: 0, esVertical: true },
                { idCasilla: 62, numCasilla: 63, x: 0.765729585, y: 0.6037234043, numFichas: 0, esVertical: true },
                { idCasilla: 63, numCasilla: 64, x: 0.8112449799, y: 0.6037234043, numFichas: 0, esVertical: true },
                { idCasilla: 64, numCasilla: 65, x: 0.8567603748, y: 0.6037234043, numFichas: 0, esVertical: true },
                { idCasilla: 65, numCasilla: 66, x: 0.9022757697, y: 0.6037234043, numFichas: 0, esVertical: true },
                { idCasilla: 66, numCasilla: 67, x: 0.9477911647, y: 0.6037234043, numFichas: 0, esVertical: true },
                { idCasilla: 67, numCasilla: 68, x: 0.9477911647, y: 0.5026595745, numFichas: 0, esVertical: true },
                { idCasilla: 68, numCasilla: 69, x: 0, y: 0, numFichas: 0, esVertical: false },
                { idCasilla: 69, numCasilla: 70, x: 0, y: 0, numFichas: 0, esVertical: false },
                { idCasilla: 70, numCasilla: 71, x: 0, y: 0, numFichas: 0, esVertical: false },
                { idCasilla: 71, numCasilla: 72, x: 0, y: 0, numFichas: 0, esVertical: false },
                { idCasilla: 72, numCasilla: 73, x: 0, y: 0, numFichas: 0, esVertical: false },
                { idCasilla: 73, numCasilla: 74, x: 0, y: 0, numFichas: 0, esVertical: false },
                { idCasilla: 74, numCasilla: 75, x: 0, y: 0, numFichas: 0, esVertical: false },
                { idCasilla: 75, numCasilla: 76, x: 0, y: 0, numFichas: 0, esVertical: false },
                { idCasilla: 76, numCasilla: 77, x: 0.7563587684, y: 0.1515957447, numFichas: 0, esVertical: true }, // amarillo +8
                { idCasilla: 77, numCasilla: 78, x: 0.8540829987, y: 0.1515957447, numFichas: 0, esVertical: true },
                { idCasilla: 78, numCasilla: 79, x: 0.7563587684, y: 0.2513297872, numFichas: 0, esVertical: true },
                { idCasilla: 79, numCasilla: 80, x: 0.8540829987, y: 0.2513297872, numFichas: 0, esVertical: true },
                { idCasilla: 80, numCasilla: 81, x: 0.1485943775, y: 0.1515957447, numFichas: 0, esVertical: true },
                { idCasilla: 81, numCasilla: 82, x: 0.2436412316, y: 0.1515957447, numFichas: 0, esVertical: true },
                { idCasilla: 82, numCasilla: 83, x: 0.1485943775, y: 0.2513297872, numFichas: 0, esVertical: true },
                { idCasilla: 83, numCasilla: 84, x: 0.2436412316, y: 0.2513297872, numFichas: 0, esVertical: true },
                { idCasilla: 84, numCasilla: 85, x: 0.1485943775, y: 0.7513297872, numFichas: 0, esVertical: true },// azul +16
                { idCasilla: 85, numCasilla: 86, x: 0.2436412316, y: 0.7513297872, numFichas: 0, esVertical: true },
                { idCasilla: 86, numCasilla: 87, x: 0.1485943775, y: 0.8537234043, numFichas: 0, esVertical: true },
                { idCasilla: 87, numCasilla: 88, x: 0.2436412316, y: 0.8537234043, numFichas: 0, esVertical: true },
                { idCasilla: 88, numCasilla: 89, x: 0.7563587684, y: 0.7513297872, numFichas: 0, esVertical: true },
                { idCasilla: 89, numCasilla: 90, x: 0.8540829987, y: 0.7513297872, numFichas: 0, esVertical: true },
                { idCasilla: 90, numCasilla: 91, x: 0.7563587684, y: 0.8537234043, numFichas: 0, esVertical: true },
                { idCasilla: 91, numCasilla: 92, x: 0.8540829987, y: 0.8537234043, numFichas: 0, esVertical: true },
                { idCasilla: 92, numCasilla: 93, x: 0.9477911647, y: 0.5026595745, numFichas: 0, esVertical: true },// rojo +24
                { idCasilla: 93, numCasilla: 94, x: 0.9022757697, y: 0.5026595745, numFichas: 0, esVertical: true },
                { idCasilla: 94, numCasilla: 95, x: 0.8567603748, y: 0.5026595745, numFichas: 0, esVertical: true },
                { idCasilla: 95, numCasilla: 96, x: 0.8112449799, y: 0.5026595745, numFichas: 0, esVertical: true },
                { idCasilla: 96, numCasilla: 97, x: 0.765729585, y: 0.5026595745, numFichas: 0, esVertical: true },
                { idCasilla: 97, numCasilla: 98, x: 0.7202141901, y: 0.5026595745, numFichas: 0, esVertical: true },
                { idCasilla: 98, numCasilla: 99, x: 0.6746987952, y: 0.5026595745, numFichas: 0, esVertical: true },
                { idCasilla: 99, numCasilla: 100, x: 0.6291834003, y: 0.5026595745, numFichas: 0, esVertical: true },
                { idCasilla: 100, numCasilla: 101, x: 0.4979919679, y: 0.09574468085, numFichas: 0, esVertical: false },
                { idCasilla: 101, numCasilla: 102, x: 0.4979919679, y: 0.1409574468, numFichas: 0, esVertical: false },
                { idCasilla: 102, numCasilla: 103, x: 0.4979919679, y: 0.1861702128, numFichas: 0, esVertical: false },
                { idCasilla: 103, numCasilla: 104, x: 0.4979919679, y: 0.2313829787, numFichas: 0, esVertical: false },
                { idCasilla: 104, numCasilla: 105, x: 0.4979919679, y: 0.2765957447, numFichas: 0, esVertical: false },
                { idCasilla: 105, numCasilla: 106, x: 0.4979919679, y: 0.3218085106, numFichas: 0, esVertical: false },
                { idCasilla: 106, numCasilla: 107, x: 0.4979919679, y: 0.3670212766, numFichas: 0, esVertical: false },
                { idCasilla: 107, numCasilla: 108, x: 0.4979919679, y: 0.4122340426, numFichas: 0, esVertical: false },
                { idCasilla: 108, numCasilla: 109, x: 0.08969210174, y: 0.5026595745, numFichas: 0, esVertical: true },
                { idCasilla: 109, numCasilla: 110, x: 0.1352074967, y: 0.5026595745, numFichas: 0, esVertical: true },
                { idCasilla: 110, numCasilla: 111, x: 0.1807228916, y: 0.5026595745, numFichas: 0, esVertical: true },
                { idCasilla: 111, numCasilla: 112, x: 0.2262382865, y: 0.5026595745, numFichas: 0, esVertical: true },
                { idCasilla: 112, numCasilla: 113, x: 0.2717536814, y: 0.5026595745, numFichas: 0, esVertical: true },
                { idCasilla: 113, numCasilla: 114, x: 0.3172690763, y: 0.5026595745, numFichas: 0, esVertical: true },
                { idCasilla: 114, numCasilla: 115, x: 0.3627844712, y: 0.5026595745, numFichas: 0, esVertical: true },
                { idCasilla: 115, numCasilla: 116, x: 0.4082998661, y: 0.5026595745, numFichas: 0, esVertical: true },
                { idCasilla: 116, numCasilla: 117, x: 0.4979919679, y: 0.9042553191, numFichas: 0, esVertical: false },
                { idCasilla: 117, numCasilla: 118, x: 0.4979919679, y: 0.8590425532, numFichas: 0, esVertical: false },
                { idCasilla: 118, numCasilla: 119, x: 0.4979919679, y: 0.8138297872, numFichas: 0, esVertical: false },
                { idCasilla: 119, numCasilla: 120, x: 0.4979919679, y: 0.7686170213, numFichas: 0, esVertical: false },
                { idCasilla: 120, numCasilla: 121, x: 0.4979919679, y: 0.7234042553, numFichas: 0, esVertical: false },
                { idCasilla: 121, numCasilla: 122, x: 0.4979919679, y: 0.6781914894, numFichas: 0, esVertical: false },
                { idCasilla: 122, numCasilla: 123, x: 0.4979919679, y: 0.6329787234, numFichas: 0, esVertical: false },
                { idCasilla: 123, numCasilla: 124, x: 0.4979919679, y: 0.5877659574, numFichas: 0, esVertical: false }
            ]
        }
    },
    props: {
        jugadores: {
            type: Array,
            required: true,
        }
    },
    methods: {
        ponerSkinDeLosJugadores(jugadores) {
            console.log('viendo las skins de los jugadores');
           //this.$set(this.jugadores, jugadores)
        },
        actualizarPosiciones() {
            console.log('prop de jugadores 0 : ',this.jugadores[0]);
            console.log('prop de jugadores 1 : ',this.jugadores[1]);
            const canvas = document.getElementById('parchisBoard');
            const rect = canvas.getBoundingClientRect();
            const xTablero = rect.left;
            const yTablero = rect.top;
            const widthTablero = rect.width;
            const heightTablero = rect.height;

            this.fichas.forEach(ficha => {
                const casilla = this.casillas[ficha.casilla];
                const boton = document.getElementById(ficha.idFicha);

                boton.style.position = "absolute";


                const tablero = this.$refs.tablero;
                // console.log('ficha.color: ', ficha.color);
                // console.log('this.miColor:', this.miColor);
                if (ficha.color == this.miColor) {  // pongo mis skins de la fichas, pero solo las mias
                    import(`../../public/assets/FICHA${this.fichaActiva}.png`).then(imageUrl => {
                        boton.style.backgroundImage = `url(${imageUrl.default})`;

                    });
                    /* Set the background size */
                    boton.style.backgroundSize = "cover";
                    /* Set the background position */
                    boton.style.backgroundPosition = "center center";
                    /* Set the background repeat */
                    boton.style.backgroundRepeat = "no-repeat";
                }

                this.jugadores.forEach(j => {
                    if (((j.idJugador != -1) && (j.idJugador != -2)) && j.color == ficha.color) { // comprobar que esa posicion no está vacía o es el jugador local
                        // console.log('jugador en el forecha j: ', j);
                        axios.get('https://lamesa-backend.azurewebsites.net/usuario/ficha-activa/' + j.idJugador) // cuando vaya el backend
                            .then(response => {
                                // console.log('fihaActiva de un jugador= ', response.data.id);
                                const skinActiva = response.data.id;
                                import(`../../public/assets/FICHA${skinActiva}.png`).then(imageUrl => {
                                    boton.style.backgroundImage = `url(${imageUrl.default})`;

                                });
                                /* Set the background size */
                                boton.style.backgroundSize = "cover";
                                /* Set the background position */
                                boton.style.backgroundPosition = "center center";
                                /* Set the background repeat */
                                boton.style.backgroundRepeat = "no-repeat";

                            })
                            .catch(error => {
                                console.log(error);
                            });

                            // import(`../../public/assets/FICHA4.png`).then(imageUrl => { //Demomento para probar que funcionan las skins multijugador
                            //         boton.style.backgroundImage = `url(${imageUrl.default})`;

                            //     });
                            //     /* Set the background size */
                            //     boton.style.backgroundSize = "cover";
                            //     /* Set the background position */
                            //     boton.style.backgroundPosition = "center center";
                            //     /* Set the background repeat */
                            //     boton.style.backgroundRepeat = "no-repeat";
                    }
                });




                boton.style.backgroundColor = ficha.colorEstilo;


                boton.style.width = widthTablero * 0.044 + "px";
                boton.style.height = widthTablero * 0.044 + "px";


                let pixelesx = 0;
                let pixelesy = 0;

                if (this.casillas[ficha.casilla].numFichas == 2) { //barreras

                    this.fichas.forEach(fichaComp => {
                        if (fichaComp == ficha) {
                            return;
                        }

                        if (fichaComp.casilla == ficha.casilla) {
                            // Una para un lado otra para otro
                            if (this.casillas[ficha.casilla].esVertical) {
                                if (ficha.idFicha < fichaComp.idFicha) {
                                    //Abajo MAS ARRIBA
                                    pixelesx = xTablero + casilla.x * widthTablero - boton.getBoundingClientRect().width / 2;
                                    pixelesy = (yTablero + casilla.y * heightTablero);
                                } else {
                                    //Arriba MAS ARRIBA
                                    pixelesx = xTablero + casilla.x * widthTablero - boton.getBoundingClientRect().width / 2;
                                    pixelesy = (yTablero + casilla.y * heightTablero) - boton.getBoundingClientRect().height / 2;
                                }
                            } else {
                                if (ficha.idFicha < fichaComp.idFicha) {
                                    //Izquierda
                                    pixelesx = xTablero + casilla.x * widthTablero - boton.getBoundingClientRect().width;
                                    pixelesy = (yTablero + casilla.y * heightTablero) - boton.getBoundingClientRect().height / 2;
                                } else {
                                    //Derecha MAS A LA IZQUIERDA
                                    pixelesx = xTablero + casilla.x * widthTablero;
                                    pixelesy = (yTablero + casilla.y * heightTablero) - boton.getBoundingClientRect().height / 2;
                                }
                            }
                        }
                    });
                }
                else {
                    pixelesx = xTablero + casilla.x * widthTablero - boton.getBoundingClientRect().width / 2;
                    pixelesy = (yTablero + casilla.y * heightTablero) - boton.getBoundingClientRect().height / 3;
                }

                boton.style.left = pixelesx + "px";
                boton.style.top = pixelesy + "px";

                if (ficha.activada) {
                    boton.style.border = "3px solid black";
                } else {
                    boton.style.border = '0px';  //devolver el estilo de ficha no seleccionable
                }
            });
        },


        changeImageSrc(boardImage) {
            this.tableroActivo = Cookies.get('tableroActivo');

            import(`../../public/assets/TABLERO${this.tableroActivo}.png`).then(imageUrl => {
                boardImage.src = imageUrl.default;
            });
        },
        crearTablero() {
            const canvas = document.getElementById('parchisBoard');
            const ctx = canvas.getContext('2d');

            canvas.height = canvas.width;
            const boardImage = new Image();
            this.changeImageSrc(boardImage); // cargar skin del tablero

            boardImage.onload = () => { // Arrow function instead of regular function
                ctx.drawImage(boardImage, 0, 0, canvas.width, canvas.height);
                this.actualizarPosiciones();
            }
        }

    }
    ,
    mounted() {
        this.miColor = Cookies.get('miColor');
        this.tableroActivo = Cookies.get('tableroActivo');
        this.fichaActiva = Cookies.get('fichaActiva');
        this.crearTablero();
    }
}
</script>