<template>
    <button v-for="(ficha, index) in fichas" :style="posicionFicha(ficha)" :key="index">f</button>
    <canvas id="parchisBoard" style="width: 100%; border-radius: 10px;"></canvas>
</template>

<script>
export default{
    methods:{
        crearTablero(){
            const canvas = document.getElementById('parchisBoard');
            const ctx = canvas.getContext('2d');

            canvas.height = canvas.width;
            // // Carga la imagen del tablero
            const boardImage = new Image();
            boardImage.src = 'assets/tablero.png';

            // Dibuja la imagen en el canvas cuando se haya cargado
            boardImage.onload = function () {
            ctx.drawImage(boardImage, 0, 0, canvas.width, canvas.height);
            }
        },
        posicionFicha(ficha){
            console.log("pos");
            const style = {};
            style.position = "relative";
            style.left = ficha[0]+"%";
            style.top = ficha[1]+"%";
            style.color = "red"; //pa probar
            return style;
        }
    },
    mounted(){
        this.crearTablero();
    },
    data(){
        return{
            fichas:[["22.75", "44.9"]]
        }
    }
}
</script>