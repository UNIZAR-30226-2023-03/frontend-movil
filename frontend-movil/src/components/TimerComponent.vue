<template>
<h1 style="font-size: small; padding-bottom:0; margin-bottom: 0;">TIEMPO</h1>
<div style="font-size: 60px">{{ tiempo }}</div>
</template>

<script>
export default{
    data(){
        return{
            tiempo: 25,
            encendido:false,
            contando:false
        }
    },
    methods:{
        sleep(milliseconds) {
            return new Promise((resolve) => setTimeout(resolve, milliseconds));
        },
        resetTimer(){
            this.tiempo = 25;
        },
        encenderTimer(){
            this.encendido = true;
            if(!this.contando){
                this.contar();
            }
        },
        pararTimer(){
            this.encendido = false;
        },
        async contar(){
            this.contando = true;
            while(this.encendido && this.tiempo > 0){
                this.tiempo = this.tiempo - 1;
                await this.sleep(1000);
            }
            this.contando = false;
        }


    }
}
</script>