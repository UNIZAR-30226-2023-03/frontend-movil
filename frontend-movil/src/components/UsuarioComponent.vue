<script>
import Cookies from 'js-cookie';
import { IonButton, IonToast, toastController } from '@ionic/vue';
import axios from 'axios';
import Confirmacion from "@/components/ConfirmacionComponent.vue"
import router from "@/router";


export default {
    emits: ['close', 'recargar'],
    components: {
        IonButton,
        Confirmacion
    },
    props: {
        show: Boolean,
    },
    data() {
        return {
            username: '',
            email: '',
            editandoUsername: false,
            editandoEmail: false,
            editandoPassword: false,
            nuevoNombre: '',
            nuevoEmail: '',
            nuevaPassword: '',
            idUsuario: 0,
            showConfirmacionCerrar: false,
            showConfirmacionEliminar: false,
            showConfirmacionEliminar2: false,
            mensajeSalir: '¿Seguro que quieres cerrar sesión?',
            mensajeEliminar: '¿Seguro que quieres eliminar la cuenta?',
            mensajeEliminar2: '¿Estás seguro? Esta acción no tiene vuelta atrás'
        }
    },
    methods: {

        cargarDatosUsuario() {
            this.username = Cookies.get('username');
            this.email = Cookies.get('email');
            this.idUsuario = Cookies.get('sessionId');

            this.nuevoNombre = this.username;
            this.nuevoEmail = this.email;

            this.$emit('recargar');
        },

        cerrar() {
            this.editandoUsername = false;
            this.editandoEmail = false;
            this.editandoPassword = false;
            this.$emit('close');
        },

        cambiarUsername() {
            this.editandoUsername = false;

            axios.post('https://lamesa-backend.azurewebsites.net/usuario/actualizar-username', {
                id: this.idUsuario,
                cambio: this.nuevoNombre
            })
                .then((response) => {
                    console.log(response.status);
                    const success = response.status === 200;
                    if (success) {
                        console.log("Username modificado a ", this.nuevoNombre);
                        this.mostrarToast("Username modificado a " + this.nuevoNombre, "toastExito");
                        Cookies.set('username', this.nuevoNombre);
                        this.cargarDatosUsuario();
                    } else {
                        this.mostrarToast("No se ha podido cambiar el nombre de usuario", "toastError");
                    }
                })
                .catch((error) => {
                    console.log(error);
                    this.mostrarToast("No se ha podido cambiar el nombre de usuario", "toastError");
                });
        },

        cambiarEmail() {
            this.editandoEmail = false;

            axios.post('https://lamesa-backend.azurewebsites.net/usuario/actualizar-email', {
                id: this.idUsuario,
                cambio: this.nuevoEmail
            })
                .then((response) => {
                    console.log(response.status);
                    const success = response.status === 200;
                    if (success) {
                        console.log("Email modificado a ", this.nuevoEmail);
                        this.mostrarToast("Email modificado a ", this.nuevoEmail, "toastExito");
                        Cookies.set('email', this.nuevoEmail);
                        this.cargarDatosUsuario();
                    }else{
                        this.mostrarToast("No se ha podido cambiar el email", "toastError");
                    }
                })
                .catch((error) => {
                    console.log(error);
                    this.mostrarToast("No se ha podido cambiar el email", "toastError");
                });
        },

        cambiarPassword() {
            if (this.nuevaPassword != this.nuevaPasswordRepetir) {
                console.log("Las contraseñas no coinciden");
                this.mostrarToast("Las contraseñas no coinciden", "toastError");
                return;
            }

            this.editandoPassword = false;

            axios.post('https://lamesa-backend.azurewebsites.net/usuario/actualizar-password', {
                id: this.idUsuario,
                cambio: this.nuevaPassword
            })
                .then((response) => {
                    console.log(response.status);
                    const success = response.status === 200;
                    if (success) {
                        console.log("Password modificado");
                        this.mostrarToast("Contraseña modificada con éxito", "toastExito");
                        this.cargarDatosUsuario();
                    }else{
                        this.mostrarToast("No se ha podido cambiar la contraseña", "toastError");
                    }
                })
                .catch((error) => {
                    console.log(error);
                    this.mostrarToast("No se ha podido cambiar la contraseña", "toastError");
                });
        },

        async mostrarToast(mensaje, tipo) {
            const toast = await toastController.create({
                message: mensaje,
                duration: 5000,
                position: 'bottom',
                cssClass: tipo
            });

            await toast.present();
        },

        cerrrarSesion(){
            console.log("Cerrando sesion");
            Cookies.remove('sessionId');
            router.push({ path: '/'});
        },

        borrarCuenta(){
            console.log("Eliminando cuenta");

            axios.post('https://lamesa-backend.azurewebsites.net/usuario/eliminar/' + this.idUsuario, {})
                .then((response) => {
                    console.log(response.status);
                    const success = response.status === 200;
                    if (success) {
                        console.log("Eliminando cuenta");
                        this.cerrrarSesion();
                    } else {
                        this.mostrarToast("No se ha podido eliminar la cuenta", "toastError");
                    }
                })
                .catch((error) => {
                    console.log(error);
                    this.mostrarToast("No se ha podido eliminar la cuenta", "toastError");
                });
        }

    },
    mounted() {
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
                    <a v-if="!editandoEmail && !editandoPassword" @click="editandoUsername = true">[editar]</a>
                </div>
                <div v-else>
                    <div style="display: flex; align-items: center;">
                        <input v-model="nuevoNombre" :placeholder="username"
                            style="width: 85%; margin-top: 0px; height: 25px; margin-right:5%">
                        <button class="mr-0"
                            style="margin: 0px; padding: 0px; background-color: rgb(50, 180, 55); border-radius: 5px; width: 25px; float: right;"
                            @click="cambiarUsername">
                            <img src="../../public/assets/check.png" style="width:100%; height: 100%;">
                        </button>
                    </div>
                </div>

                <div class="nombreStat2"> Correo electrónico: </div>
                <div class="estadistica2 margin0" v-if="!editandoEmail">
                    <div class="valorStat2"> {{ email }} </div>
                    <a v-if="!editandoUsername && !editandoPassword" @click="editandoEmail = true">[editar]</a>
                </div>
                <div v-else>
                    <div style="display: flex; align-items: center;">
                        <input v-model="nuevoEmail" :placeholder="email"
                            style="width: 85%; margin-top: 0px; height: 25px; margin-right:5%">
                        <button class="mr-0"
                            style="margin: 0px; padding: 0px; background-color: rgb(50, 180, 55); border-radius: 5px; width: 25px; float: right;"
                            @click="cambiarEmail">
                            <img src="../../public/assets/check.png" style="width:100%; height: 100%;">
                        </button>
                    </div>
                </div>


                <div class="nombreStat2"> Contraseña: </div>
                <div class="estadistica2 margin0" v-if="!editandoPassword">
                    <div class="valorStat2"> ************** </div>
                    <a v-if="!editandoUsername && !editandoEmail" @click="editandoPassword = true">[editar]</a>
                </div>
                <div v-else>
                    <div style="display: flex; align-items: center;">
                        <input type="password" v-model="nuevaPassword" placeholder="Nueva contraseña"
                            style="width: 42%; margin-top: 0px; height: 25px; margin-right:5%; font-size: 10px;">
                        <input type="password" v-model="nuevaPasswordRepetir" placeholder="Repetir contraseña"
                            style="width: 42%; margin-top: 0px; height: 25px; margin-right:5%; font-size: 10px;">
                        <button class="mr-0"
                            style="margin: 0px; padding: 0px; background-color: rgb(50, 180, 55); border-radius: 5px; width: 25px; float: right;"
                            @click="cambiarPassword">
                            <img src="../../public/assets/check.png" style="width:100%; height: 100%;">
                        </button>
                    </div>
                </div>

                <div class="margin0 botonesInline">
                    <ion-button class="botonAbajo" @click="showConfirmacionCerrar = true">
                        CERRAR <br> SESIÓN
                        <img class="iconoBoton" src="../../public/assets/salir.png">
                    </ion-button>
                    <ion-button color="danger" class="botonAbajo"  @click="showConfirmacionEliminar = true">
                        ELIMINAR <br> CUENTA
                        <img class="iconoBoton" src="../../public/assets/eliminarUsuario.png">
                    </ion-button>
                </div>

            </div>
        </div>
    </Transition>

    <Confirmacion :show="showConfirmacionCerrar" :mensaje="mensajeSalir" @close="showConfirmacionCerrar = false" @si="cerrrarSesion()"> </Confirmacion>
    <Confirmacion :show="showConfirmacionEliminar" :mensaje="mensajeEliminar" @close="showConfirmacionEliminar = false" @si="showConfirmacionEliminar2 = true"> </Confirmacion>
    <Confirmacion :show="showConfirmacionEliminar2" :mensaje="mensajeEliminar2" @close="showConfirmacionEliminar2 = false; showConfirmacionEliminar= false" @si="borrarCuenta()"> </Confirmacion>
</template>


<style>
.toastExito {
    color: green;
    font-weight: bold;
    font-size: large;
}

.toastError {
    color: red;
    font-weight: bold;
    font-size: large;
}

.iconoBoton {
    height: 55%;
    width: auto;
    margin: 5px
}

.botonAbajo {
    width: 50%;
    font-size: 12px;
    font-weight: bold;
    text-align: justify;
}

.botonesInline {
    margin-top: 20px;
    display: flex;
    justify-content: center;
}

.estadistica2 {
    display: flex;
    justify-content: space-between;
}

.nombreStat2 {
    margin-top: 20px;
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