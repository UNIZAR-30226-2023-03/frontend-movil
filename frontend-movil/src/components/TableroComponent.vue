<template>
    <canvas id="parchisBoard" style="width: 100%; border-radius: 10px;"></canvas>
</template>

<script>
export default{
    methods:{
        crearTablero(){
            const canvas = document.getElementById('parchisBoard');
            const ctx = canvas.getContext('2d');

            canvas.height = canvas.width;
            console.log(canvas.width);
            // // Carga la imagen del tablero
            const boardImage = new Image();
            boardImage.src = 'assets/tablero.png';

            // Dibuja la imagen en el canvas cuando se haya cargado
            boardImage.onload = function () {
            ctx.drawImage(boardImage, 0, 0, canvas.width, canvas.height);
            }
        }
    },
    mounted(){
        this.crearTablero();
    }
}
</script>