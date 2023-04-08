<template>
    <button style="border-radius: 50%;" v-for="(ficha, index) in fichas" :id="ficha.idFicha" :key="index"> </button>
    
    <canvas id="parchisBoard" style="width: 100%; border-radius: 10px;"></canvas> 
    
</template>

<script>

export default{
    data(){
        return{
           fichas:[
            {idFicha:'y1', casilla: 12, color:'yellow'},
            {idFicha:'y2', casilla: 13, color:'yellow'},
            {idFicha:'y3', casilla: 14, color:'yellow'},
            {idFicha:'y4', casilla: 15, color:'yellow'},
            {idFicha:'b1', casilla: 4, color:'blue'},
            {idFicha:'b2', casilla: 5, color:'blue'},
            {idFicha:'b3', casilla: 6, color:'blue'},
            {idFicha:'b4', casilla: 7, color:'blue'},
            {idFicha:'r1', casilla: 0, color:'red'},
            {idFicha:'r2', casilla: 1, color:'red'},
            {idFicha:'r3', casilla: 2, color:'red'},
            {idFicha:'r4', casilla: 3, color:'red'},
            {idFicha:'g1', casilla: 8, color:'green'},
            {idFicha:'g2', casilla: 9, color:'green'},
            {idFicha:'g3', casilla: 10, color:'green'},
            {idFicha:'g4', casilla: 11, color:'green'}
            
           ],
           casillas:[
            {idCasilla:0, numCasilla:0, x:0.2262382865, y:0.6037234043, numFichas:0, esVertical:true},
            {idCasilla:1 , numCasilla:1, x:0.2717536814, y:0.6037234043, numFichas:0, esVertical:true},
            {idCasilla:2 , numCasilla:2, x:0.3172690763, y:0.6037234043, numFichas:0, esVertical:true},
            {idCasilla:3 , numCasilla:3, x:0.3627844712, y:0.6037234043, numFichas:0, esVertical:true},
            {idCasilla:4 , numCasilla:4, x:0.3962516734, y:0.6329787234, numFichas:0, esVertical:true},
            {idCasilla:5 , numCasilla:5, x:0.3962516734, y:0.6781914894, numFichas:0, esVertical:true},
            {idCasilla:6 , numCasilla:6, x:0.3962516734, y:0.7234042553, numFichas:0, esVertical:true},
            {idCasilla:7 , numCasilla:7, x:0.3962516734, y:0.7686170213, numFichas:0, esVertical:true},
            {idCasilla:8 , numCasilla:8, x:0.3962516734, y:0.8138297872, numFichas:0, esVertical:true},
            {idCasilla:9 , numCasilla:9, x:0.3962516734, y:0.8590425532, numFichas:0, esVertical:true},
            {idCasilla:10 , numCasilla:10, x:0.3962516734, y:0.9042553191, numFichas:0, esVertical:true},
            {idCasilla:11 , numCasilla:11, x:0.3962516734, y:0.9494680851, numFichas:0, esVertical:true},
            {idCasilla:12 , numCasilla:12, x:0.4979919679, y:0.9494680851, numFichas:0, esVertical:true},
            {idCasilla:13 , numCasilla:13, x:0.6010709505, y:0.9494680851, numFichas:0, esVertical:true},
            {idCasilla:14 , numCasilla:14, x:0.6010709505, y:0.9042553191, numFichas:0, esVertical:true},
            {idCasilla:15 , numCasilla:15, x:0.6010709505, y:0.8590425532, numFichas:0, esVertical:true},
            {idCasilla:16 , numCasilla:16, x:0.6010709505, y:0.8138297872, numFichas:0, esVertical:true},
            {idCasilla:17 , numCasilla:17, x:0.6010709505, y:0.7686170213, numFichas:0, esVertical:true},
            {idCasilla:18 , numCasilla:18, x:0.6010709505, y:0.7234042553, numFichas:0, esVertical:true},
            {idCasilla:19 , numCasilla:19, x:0.6010709505, y:0.6781914894, numFichas:0, esVertical:true},
            {idCasilla:20 , numCasilla:20, x:0.6010709505, y:0.6329787234, numFichas:0, esVertical:true},
            {idCasilla:21 , numCasilla:21, x:0.6291834003, y:0.6037234043, numFichas:0, esVertical:true},
            {idCasilla:22 , numCasilla:22, x:0.6746987952, y:0.6037234043, numFichas:0, esVertical:true},
            {idCasilla:23 , numCasilla:23, x:0.7202141901, y:0.6037234043, numFichas:0, esVertical:true},
            {idCasilla:24 , numCasilla:24, x:0.765729585, y:0.6037234043, numFichas:0, esVertical:true},
            {idCasilla:25 , numCasilla:25, x:0.8112449799, y:0.6037234043, numFichas:0, esVertical:true},
            {idCasilla:26 , numCasilla:26, x:0.8567603748, y:0.6037234043, numFichas:0, esVertical:true},
            {idCasilla:27 , numCasilla:27, x:0.9022757697, y:0.6037234043, numFichas:0, esVertical:true},
            {idCasilla:28 , numCasilla:28, x:0.9477911647, y:0.6037234043, numFichas:0, esVertical:true},
            {idCasilla:29 , numCasilla:29, x:0.9477911647, y:0.5026595745, numFichas:0, esVertical:true},
            {idCasilla:30 , numCasilla:30, x:0.9477911647, y:0.3949468085, numFichas:0, esVertical:true},
            {idCasilla:31 , numCasilla:31, x:0.9022757697, y:0.3949468085, numFichas:0, esVertical:true},
            {idCasilla:32 , numCasilla:32, x:0.8567603748, y:0.3949468085, numFichas:0, esVertical:true},
            {idCasilla:33 , numCasilla:33, x:0.8112449799, y:0.3949468085, numFichas:0, esVertical:true},
            {idCasilla:34 , numCasilla:34, x:0.765729585, y:0.3949468085, numFichas:0, esVertical:true},
            {idCasilla:35 , numCasilla:35, x:0.7202141901, y:0.3949468085, numFichas:0, esVertical:true},
            {idCasilla:36 , numCasilla:36, x:0.7202141901, y:0.3949468085, numFichas:0, esVertical:true},
            {idCasilla:37 , numCasilla:37, x:0.6291834003, y:0.3949468085, numFichas:0, esVertical:true},
            {idCasilla:38 , numCasilla:38, x:0.6010709505, y:0.3670212766, numFichas:0, esVertical:true},
            {idCasilla:39 , numCasilla:39, x:0.6010709505, y:0.3218085106, numFichas:0, esVertical:true},
            {idCasilla:40 , numCasilla:40, x:0.6010709505, y:0.2765957447, numFichas:0, esVertical:true},
            {idCasilla:41 , numCasilla:41, x:0.6010709505, y:0.2313829787, numFichas:0, esVertical:true},
            {idCasilla:42 , numCasilla:42, x:0.6010709505, y:0.1861702128, numFichas:0, esVertical:true},
            {idCasilla:43 , numCasilla:43, x:0.6010709505, y:0.1409574468, numFichas:0, esVertical:true},
            {idCasilla:44 , numCasilla:44, x:0.6010709505, y:0.09574468085, numFichas:0, esVertical:true},
            {idCasilla:45 , numCasilla:45, x:0.6010709505, y:0.05053191489, numFichas:0, esVertical:true},
            {idCasilla:46 , numCasilla:46, x:0.4979919679, y:0.05053191489, numFichas:0, esVertical:true},
            {idCasilla:47 , numCasilla:47, x:0.3962516734, y:0.05053191489, numFichas:0, esVertical:true},
            {idCasilla:48 , numCasilla:48, x:0.3962516734, y:0.09574468085, numFichas:0, esVertical:true},
            {idCasilla:49 , numCasilla:49, x:0.3962516734, y:0.1409574468, numFichas:0, esVertical:true},
            {idCasilla:50 , numCasilla:50, x:0.3962516734, y:0.1861702128, numFichas:0, esVertical:true},
            {idCasilla:51 , numCasilla:51, x:0.3962516734, y:0.2313829787, numFichas:0, esVertical:true},
            {idCasilla:52 , numCasilla:52, x:0.3962516734, y:0.2765957447, numFichas:0, esVertical:true},
            {idCasilla:53 , numCasilla:53, x:0.3962516734, y:0.3218085106, numFichas:0, esVertical:true},
            {idCasilla:54 , numCasilla:54, x:0.3962516734, y:0.3670212766, numFichas:0, esVertical:true},
            {idCasilla:55 , numCasilla:55, x:0.3627844712, y:0.3949468085, numFichas:0, esVertical:true},
            {idCasilla:56 , numCasilla:56, x:0.3172690763, y:0.3949468085, numFichas:0, esVertical:true},
            {idCasilla:57 , numCasilla:57, x:0.2717536814, y:0.3949468085, numFichas:0, esVertical:true},
            {idCasilla:58 , numCasilla:58, x:0.2262382865, y:0.3949468085, numFichas:0, esVertical:true},
            {idCasilla:59 , numCasilla:59, x:0.1807228916, y:0.3949468085, numFichas:0, esVertical:true},
            {idCasilla:60 , numCasilla:60, x:0.1352074967, y:0.3949468085, numFichas:0, esVertical:true},
            {idCasilla:61 , numCasilla:61, x:0.08969210174, y:0.3949468085, numFichas:0, esVertical:true},
            {idCasilla:62 , numCasilla:62, x:0.04417670683, y:0.3949468085, numFichas:0, esVertical:true},
            {idCasilla:63 , numCasilla:63, x:0.04417670683, y:0.5026595745, numFichas:0, esVertical:true},
            {idCasilla:64 , numCasilla:64, x:0.04417670683, y:0.6037234043, numFichas:0, esVertical:true},
            {idCasilla:65 , numCasilla:65, x:0.08969210174, y:0.6037234043, numFichas:0, esVertical:true},
            {idCasilla:66 , numCasilla:66, x:0.1352074967, y:0.6037234043, numFichas:0, esVertical:true},
            {idCasilla:67 , numCasilla:67, x:0.1807228916, y:0.6037234043, numFichas:0, esVertical:true}
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
                boton.style.backgroundColor = ficha.color;
                boton.style.width = widthTablero * 0.044 +"px";
                boton.style.height = widthTablero * 0.044 +"px";

                const pixelesx = xTablero + casilla.x * widthTablero - boton.getBoundingClientRect().width / 2;
                const pixelesy = (yTablero + casilla.y * heightTablero) - boton.getBoundingClientRect().height / 3 ;

                boton.style.left = pixelesx+"px";
                boton.style.top = pixelesy+"px";
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