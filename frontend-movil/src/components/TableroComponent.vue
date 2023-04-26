<template>
    <button style="border-radius: 50%;" v-for="(ficha, index) in fichas" :id="ficha.idFicha" :key="index"  @click="$emit('fichaPulsada', $event, ficha)"> </button>
    
    <canvas id="parchisBoard" style="width: 100%; border-radius: 10px;"></canvas> 
    
</template>

<script>
import { IonButton } from '@ionic/vue';
import { defineComponent } from 'vue';

export default{
    data(){
        return{
           fichas:[
            {idFicha:'y1', id:1, color:'AMARILLO',casilla: 76, colorEstilo:'yellow', activada:false},
            {idFicha:'y2', id:2, color:'AMARILLO',casilla: 77, colorEstilo:'yellow', activada:false},
            {idFicha:'y3', id:3, color:'AMARILLO',casilla: 78, colorEstilo:'yellow', activada:false},
            {idFicha:'y4', id:4, color:'AMARILLO',casilla: 79, colorEstilo:'yellow', activada:false},
            {idFicha:'b1', id:1, color:'AZUL',casilla: 80, colorEstilo:'blue', activada:false},
            {idFicha:'b2', id:2, color:'AZUL',casilla: 81, colorEstilo:'blue', activada:false},
            {idFicha:'b3', id:3, color:'AZUL',casilla: 82, colorEstilo:'blue', activada:false},
            {idFicha:'b4', id:4, color:'AZUL',casilla: 83, colorEstilo:'blue', activada:false},
            {idFicha:'r1', id:1, color:'ROJO',casilla: 84, colorEstilo:'red', activada:false},
            {idFicha:'r2', id:2, color:'ROJO',casilla: 85, colorEstilo:'red', activada:false},
            {idFicha:'r3', id:3, color:'ROJO',casilla: 86, colorEstilo:'red', activada:false},
            {idFicha:'r4', id:4, color:'ROJO',casilla: 87, colorEstilo:'red', activada:false},
            {idFicha:'g1', id:1, color:'VERDE',casilla: 88, colorEstilo:'green', activada:false},
            {idFicha:'g2', id:2, color:'VERDE',casilla: 89, colorEstilo:'green', activada:false},
            {idFicha:'g3', id:3, color:'VERDE',casilla: 90, colorEstilo:'green', activada:false},
            {idFicha:'g4', id:4, color:'VERDE',casilla: 91, colorEstilo:'green', activada:false}
            
           ],
           casillas:[
            {idCasilla:0 , numCasilla:1, x:0.9477911647, y:0.3949468085, numFichas:0, esVertical:true},
            {idCasilla:1 , numCasilla:2, x:0.9022757697, y:0.3949468085, numFichas:0, esVertical:true},
            {idCasilla:2 , numCasilla:3, x:0.8567603748, y:0.3949468085, numFichas:0, esVertical:true},
            {idCasilla:3 , numCasilla:4, x:0.8112449799, y:0.3949468085, numFichas:0, esVertical:true},
            {idCasilla:4 , numCasilla:5, x:0.765729585, y:0.3949468085, numFichas:0, esVertical:true},
            {idCasilla:5 , numCasilla:6, x:0.7202141901, y:0.3949468085, numFichas:0, esVertical:true},
            {idCasilla:6 , numCasilla:7, x:0.7202141901, y:0.3949468085, numFichas:0, esVertical:true},
            {idCasilla:7 , numCasilla:8, x:0.6291834003, y:0.3949468085, numFichas:0, esVertical:true},
            {idCasilla:8 , numCasilla:9, x:0.6010709505, y:0.3670212766, numFichas:0, esVertical:false},
            {idCasilla:9 , numCasilla:10, x:0.6010709505, y:0.3218085106, numFichas:0, esVertical:false},
            {idCasilla:10 , numCasilla:11, x:0.6010709505, y:0.2765957447, numFichas:0, esVertical:false},
            {idCasilla:11 , numCasilla:12, x:0.6010709505, y:0.2313829787, numFichas:0, esVertical:false},
            {idCasilla:12 , numCasilla:13, x:0.6010709505, y:0.1861702128, numFichas:0, esVertical:false},
            {idCasilla:13 , numCasilla:14, x:0.6010709505, y:0.1409574468, numFichas:0, esVertical:false},
            {idCasilla:14 , numCasilla:15, x:0.6010709505, y:0.09574468085, numFichas:0, esVertical:false},
            {idCasilla:15 , numCasilla:16, x:0.6010709505, y:0.05053191489, numFichas:0, esVertical:false},
            {idCasilla:16 , numCasilla:17, x:0.4979919679, y:0.05053191489, numFichas:0, esVertical:false},
            {idCasilla:17 , numCasilla:18, x:0.3962516734, y:0.05053191489, numFichas:0, esVertical:false},
            {idCasilla:18 , numCasilla:19, x:0.3962516734, y:0.09574468085, numFichas:0, esVertical:false},
            {idCasilla:19 , numCasilla:20, x:0.3962516734, y:0.1409574468, numFichas:0, esVertical:false},
            {idCasilla:20 , numCasilla:21, x:0.3962516734, y:0.1861702128, numFichas:0, esVertical:false},
            {idCasilla:21 , numCasilla:22, x:0.3962516734, y:0.2313829787, numFichas:0, esVertical:false},
            {idCasilla:22 , numCasilla:23, x:0.3962516734, y:0.2765957447, numFichas:0, esVertical:false},
            {idCasilla:23 , numCasilla:24, x:0.3962516734, y:0.3218085106, numFichas:0, esVertical:false},
            {idCasilla:24 , numCasilla:25, x:0.3962516734, y:0.3670212766, numFichas:0, esVertical:false},
            {idCasilla:25 , numCasilla:26, x:0.3627844712, y:0.3949468085, numFichas:0, esVertical:true},
            {idCasilla:26 , numCasilla:27, x:0.3172690763, y:0.3949468085, numFichas:0, esVertical:true},
            {idCasilla:27 , numCasilla:28, x:0.2717536814, y:0.3949468085, numFichas:0, esVertical:true},
            {idCasilla:28 , numCasilla:29, x:0.2262382865, y:0.3949468085, numFichas:0, esVertical:true},
            {idCasilla:29 , numCasilla:30, x:0.1807228916, y:0.3949468085, numFichas:0, esVertical:true},
            {idCasilla:30 , numCasilla:31, x:0.1352074967, y:0.3949468085, numFichas:0, esVertical:true},
            {idCasilla:31 , numCasilla:32, x:0.08969210174, y:0.3949468085, numFichas:0, esVertical:true},
            {idCasilla:32 , numCasilla:33, x:0.04417670683, y:0.3949468085, numFichas:0, esVertical:true},
            {idCasilla:33 , numCasilla:34, x:0.04417670683, y:0.5026595745, numFichas:0, esVertical:true},
            {idCasilla:34 , numCasilla:35, x:0.04417670683, y:0.6037234043, numFichas:0, esVertical:true},
            {idCasilla:35 , numCasilla:36, x:0.08969210174, y:0.6037234043, numFichas:0, esVertical:true},
            {idCasilla:36 , numCasilla:37, x:0.1352074967, y:0.6037234043, numFichas:0, esVertical:true},
            {idCasilla:37 , numCasilla:38, x:0.1807228916, y:0.6037234043, numFichas:0, esVertical:true},
            {idCasilla:38 , numCasilla:39, x:0.2262382865, y:0.6037234043, numFichas:0, esVertical:true},
            {idCasilla:39 , numCasilla:40, x:0.2717536814, y:0.6037234043, numFichas:0, esVertical:true},
            {idCasilla:40 , numCasilla:41, x:0.3172690763, y:0.6037234043, numFichas:0, esVertical:true},
            {idCasilla:41 , numCasilla:42, x:0.3627844712, y:0.6037234043, numFichas:0, esVertical:true},
            {idCasilla:42 , numCasilla:43, x:0.3962516734, y:0.6329787234, numFichas:0, esVertical:false},
            {idCasilla:43 , numCasilla:44, x:0.3962516734, y:0.6781914894, numFichas:0, esVertical:false},
            {idCasilla:44 , numCasilla:45, x:0.3962516734, y:0.7234042553, numFichas:0, esVertical:false},
            {idCasilla:45 , numCasilla:46, x:0.3962516734, y:0.7686170213, numFichas:0, esVertical:false},
            {idCasilla:46 , numCasilla:47, x:0.3962516734, y:0.8138297872, numFichas:0, esVertical:false},
            {idCasilla:47 , numCasilla:48, x:0.3962516734, y:0.8590425532, numFichas:0, esVertical:false},
            {idCasilla:48 , numCasilla:49, x:0.3962516734, y:0.9042553191, numFichas:0, esVertical:false},
            {idCasilla:49 , numCasilla:50, x:0.3962516734, y:0.9494680851, numFichas:0, esVertical:false},
            {idCasilla:50 , numCasilla:51, x:0.4979919679, y:0.9494680851, numFichas:0, esVertical:false},
            {idCasilla:51 , numCasilla:52, x:0.6010709505, y:0.9494680851, numFichas:0, esVertical:false},
            {idCasilla:52 , numCasilla:53, x:0.6010709505, y:0.9042553191, numFichas:0, esVertical:false},
            {idCasilla:53 , numCasilla:54, x:0.6010709505, y:0.8590425532, numFichas:0, esVertical:false},
            {idCasilla:54 , numCasilla:55, x:0.6010709505, y:0.8138297872, numFichas:0, esVertical:false},
            {idCasilla:55 , numCasilla:56, x:0.6010709505, y:0.7686170213, numFichas:0, esVertical:false},
            {idCasilla:56 , numCasilla:57, x:0.6010709505, y:0.7234042553, numFichas:0, esVertical:false},
            {idCasilla:57 , numCasilla:58, x:0.6010709505, y:0.6781914894, numFichas:0, esVertical:false},
            {idCasilla:58 , numCasilla:59, x:0.6010709505, y:0.6329787234, numFichas:0, esVertical:false},
            {idCasilla:59 , numCasilla:60, x:0.6291834003, y:0.6037234043, numFichas:0, esVertical:true},
            {idCasilla:60 , numCasilla:61, x:0.6746987952, y:0.6037234043, numFichas:0, esVertical:true},
            {idCasilla:61 , numCasilla:62, x:0.7202141901, y:0.6037234043, numFichas:0, esVertical:true},
            {idCasilla:62 , numCasilla:63, x:0.765729585, y:0.6037234043, numFichas:0, esVertical:true},
            {idCasilla:63 , numCasilla:64, x:0.8112449799, y:0.6037234043, numFichas:0, esVertical:true},
            {idCasilla:64 , numCasilla:65, x:0.8567603748, y:0.6037234043, numFichas:0, esVertical:true},
            {idCasilla:65 , numCasilla:66, x:0.9022757697, y:0.6037234043, numFichas:0, esVertical:true},
            {idCasilla:66 , numCasilla:67, x:0.9477911647, y:0.6037234043, numFichas:0, esVertical:true},
            {idCasilla:67 , numCasilla:68, x:0.9477911647, y:0.5026595745, numFichas:0, esVertical:true},
            {idCasilla:68 , numCasilla:69, x:0, y:0, numFichas:0, esVertical:true},
            {idCasilla:69 , numCasilla:70, x:0, y:0, numFichas:0, esVertical:true},
            {idCasilla:70 , numCasilla:71, x:0, y:0, numFichas:0, esVertical:true},
            {idCasilla:71 , numCasilla:72, x:0, y:0, numFichas:0, esVertical:true},
            {idCasilla:72 , numCasilla:73, x:0, y:0, numFichas:0, esVertical:true},
            {idCasilla:73 , numCasilla:74, x:0, y:0, numFichas:0, esVertical:true},
            {idCasilla:74 , numCasilla:75, x:0, y:0, numFichas:0, esVertical:true},
            {idCasilla:75 , numCasilla:76, x:0, y:0, numFichas:0, esVertical:true},
            {idCasilla:76 , numCasilla:77, x:0.7563587684, y:0.1515957447, numFichas:0, esVertical:true},
            {idCasilla:77 , numCasilla:78, x:0.8540829987, y:0.1515957447, numFichas:0, esVertical:true},
            {idCasilla:78 , numCasilla:79, x:0.7563587684, y:0.2513297872, numFichas:0, esVertical:true},
            {idCasilla:79 , numCasilla:80, x:0.8540829987, y:0.2513297872, numFichas:0, esVertical:true},
            {idCasilla:80 , numCasilla:81, x:0.1485943775, y:0.1515957447, numFichas:0, esVertical:true},
            {idCasilla:81 , numCasilla:82, x:0.2436412316, y:0.1515957447, numFichas:0, esVertical:true},
            {idCasilla:82 , numCasilla:83, x:0.1485943775, y:0.2513297872, numFichas:0, esVertical:true},
            {idCasilla:83 , numCasilla:84, x:0.2436412316, y:0.2513297872, numFichas:0, esVertical:true},
            {idCasilla:84 , numCasilla:85, x:0.1485943775, y:0.7513297872, numFichas:0, esVertical:true},
            {idCasilla:85 , numCasilla:86, x:0.2436412316, y:0.7513297872, numFichas:0, esVertical:true},
            {idCasilla:86 , numCasilla:87, x:0.1485943775, y:0.8537234043, numFichas:0, esVertical:true},
            {idCasilla:87 , numCasilla:88, x:0.2436412316, y:0.8537234043, numFichas:0, esVertical:true},
            {idCasilla:88 , numCasilla:89, x:0.7563587684, y:0.7513297872, numFichas:0, esVertical:true},
            {idCasilla:89 , numCasilla:90, x:0.8540829987, y:0.7513297872, numFichas:0, esVertical:true},
            {idCasilla:90 , numCasilla:91, x:0.7563587684, y:0.8537234043, numFichas:0, esVertical:true},
            {idCasilla:91 , numCasilla:92, x:0.8540829987, y:0.8537234043, numFichas:0, esVertical:true}
        ]
        }
    },
    methods:{
        actualizarPosiciones(){
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
                boton.style.backgroundColor = ficha.colorEstilo;
                boton.style.width = widthTablero * 0.044 +"px";
                boton.style.height = widthTablero * 0.044 +"px";

                const pixelesx = xTablero + casilla.x * widthTablero - boton.getBoundingClientRect().width / 2;
                const pixelesy = (yTablero + casilla.y * heightTablero) - boton.getBoundingClientRect().height / 3 ;

                boton.style.left = pixelesx+"px";
                boton.style.top = pixelesy+"px";

                if(ficha.activada){
                    boton.style.border = "3px solid black";
                }
            });
        },
        crearTablero() {
            const canvas = document.getElementById('parchisBoard');
            const ctx = canvas.getContext('2d');

            canvas.height = canvas.width;
            const boardImage = new Image();
            boardImage.src = 'assets/tablero.png';

            boardImage.onload = () => { // Arrow function instead of regular function
                ctx.drawImage(boardImage, 0, 0, canvas.width, canvas.height);

                this.actualizarPosiciones();
            }
        }

    }    
    ,
    mounted(){
        this.crearTablero();
    }
}
</script>