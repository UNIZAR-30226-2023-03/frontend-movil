<template>
    <canvas id="dado" style="width: 100%" :class="{ dadoActivado:activado }"></canvas>
</template>

<style>
.dadoActivado {
  border-radius: 10px;
  border: 6px solid #ffffff;
}
</style>

<script>

const rutas = ['assets/dado/1.png',
 'assets/dado/2.png',
 'assets/dado/3.png',
 'assets/dado/4.png',
 'assets/dado/5.png',
 'assets/dado/6.png']


export default{
    data() {
        return {
            activado: false
        }
    },
    methods:{
        sleep(milliseconds) {
            return new Promise((resolve) => setTimeout(resolve, milliseconds));
        },
        crearDado(d){
            const canvas = document.getElementById('dado');
            const ctx = canvas.getContext('2d');

            canvas.height = canvas.width;

            const dado = new Image();
            dado.src = rutas[d];
            // Dibuja la imagen en el canvas cuando se haya cargado
            dado.onload = function () {
                ctx.drawImage(dado, 0, 0, canvas.width, canvas.height);
            }
        },
        async tirarDado(){
            this.activado = false;
            const canvas = document.getElementById('dado');
            const ctx = canvas.getContext('2d');

            let num = 0;
            for (let index = 0; index < 20; index++) {
                await this.sleep(100);
                num = Math.floor(Math.random() * 6);
                this.crearDado(num);
            }
            return num+1;
        },
        activarDado(){
            this.activado = true;
        }
    },
    mounted(){
        this.crearDado(0);
    }
}
</script>