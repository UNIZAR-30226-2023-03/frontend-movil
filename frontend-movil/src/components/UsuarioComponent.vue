<script>
import Cookies from 'js-cookie';
import { IonButton } from '@ionic/vue';

export default {

    components: {
        IonButton,
    },
    props: {
        show: Boolean,
    },
    data() {
        return {
            username: '',
            email: '',
            editandoUsername: false,
            editandoEmail:  false,
            editandoPassword: false
        }
    },
    methods: {

        cargarDatosUsuario(){
            this.username = Cookies.get('username');
            this.email = Cookies.get('email');
        },

        cerrar() {
            this.$emit('close');
        },

    },
    mounted(){
        this.cargarDatosUsuario();
    }
}

</script>


<template>
    <Transition name="notificaciones">
        <div v-if="show" class="modal-mask">
            <div class="modal-container">
                <a class="close-icon-img" @click="cerrar()">
                    <img src="../../public/assets/close.png" alt="cerrar popup">
                </a>
                <h1>Configuración de usuario</h1>

                <hr style="margin-top: 10px; margin-bottom: 10px; border-top: 2px solid white;">
                

                <div class="nombreStat2"> Nombre de usuario: </div>
                <div class="estadistica2 margin0" v-if="!editandoUsername">
                    <div class="valorStat2"> {{ username }} </div>
                    <a>[editar]</a>
                </div>
                <div v-else>
                    Editando usuario
                </div>

                <div class="nombreStat2"> Correo electrónico: </div>
                <div class="estadistica2 margin0">
                    <div class="valorStat2"> {{ email }} </div>
                    <a>[editar]</a>
                </div>

                <div class="nombreStat2"> Contraseña: </div>
                <div class="estadistica2 margin0">
                    <div class="valorStat2"> ************** </div>
                    <a>[editar]</a>
                </div>

                <div class="margin0 botonesInline">
                    <ion-button class="boton">
                        CERRAR <br> SESIÓN
                        <img class="iconoBoton" src="../../public/assets/salir.png">
                    </ion-button>
                    <ion-button color="danger" class="boton">
                        ELIMINAR <br> CUENTA
                        <img class="iconoBoton" src="../../public/assets/eliminarUsuario.png">
                    </ion-button>
                </div>
            </div>
        </div>
    </Transition>
</template>


<style>
.iconoBoton{
    height: 55%;
    width: auto;
    margin:5px
}

.boton{
    width: 50%;
    font-size: 12px;
    font-weight: bold;
    text-align: justify;
}

.botonesInline{
    display: flex;
    justify-content: center;
}

.estadistica2{
    margin-bottom: 20px;
    display: flex;
    justify-content: space-between;
}

.nombreStat2 {
    color: rgb(207, 207, 207);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.valorStat2 {
    color: white;
    font-weight: bold;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 80%;
    text-align: left;
}

.modal-container {

    justify-content: space-between;
    align-items: center;
    position: relative;
    /* make the container position relative */
}

.close-icon-img {
    width: 16px;
    height: 16px;
    cursor: pointer;
    position: absolute;
    top: 10px;
    right: 10px;
}

.mr-0 {
    margin-right: auto;
}

.ml-auto {
    margin-left: 0;
}

.d-block {
    display: block;
}

.customTab {
    height: 80%;
    width: 100%;
}

.modal-mask {
    position: fixed;
    z-index: 9998;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.33);
    display: flex;
    transition: opacity 0.3s ease;
}

.modal-container {
    width: 300px;
    height: 700px;
    margin: auto;
    padding: 20px 30px;
    border: 5px solid rgb(34, 34, 34);
    border-radius: 13px;

    background-color: rgb(69, 69, 69);
    ;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
    transition: all 0.3s ease;
}

.modal-header h3 {
    margin-top: 0;
    color: #42b983;
}

.modal-body {
    margin: 20px 0;
}

.modal-default-button {
    float: right;
}

/*
 * The following styles are auto-applied to elements with
 * transition="modal" when their visibility is toggled
 * by Vue.js.
 *
 * You can easily play with the modal transition by editing
 * these styles.
 */

.modal-enter-from {
    opacity: 0;
}

.modal-leave-to {
    opacity: 0;
}

.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
    -webkit-transform: scale(1.1);
    transform: scale(1.1);
}
</style>