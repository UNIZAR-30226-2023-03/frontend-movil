<script>
import { IonButton } from '@ionic/vue';
import axios from "axios";
import router from "@/router";
import Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import Cookies from "js-cookie";

export default {
    components: {
        IonButton
    },
    props: {
        show: {
            type: Boolean,
            required: true
        },
        mensaje: String,
    }
}
</script>

<template>
    <Transition name="victorias">
        <div v-if="show" class="modal-mask-small">
            <div class="modal-container-small" style="text-align: center;">
                <a class="close-icon-img" @click="$emit('close'); mostrarConfirmacion = false">
                    <img src="../../public/assets/close.png" alt="cerrar popup">
                </a>

                <div>
                    <p> {{ mensaje }}</p>
                    <ion-button color="success" @click="$emit('close');" size="small" style="width: 50%;">NO</ion-button>
                    <ion-button color="danger" @click="$emit('si');" size="small" style="width: 50%;">Si</ion-button>

                </div>
            </div>
        </div>
    </Transition>
</template>

<style>
.modal-container-small {

    justify-content: space-between;
    align-items: center;
    position: relative;
    
    width: 250px;
    height: 200px;
    margin: auto;
    padding: 20px 30px;
    border: 5px solid rgb(34, 34, 34);
    border-radius: 13px;

    background-color: rgb(69, 69, 69);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
    transition: all 0.3s ease;
}

.close-icon-img {
    width: 16px;
    height: 16px;
    cursor: pointer;
    position: absolute;
    top: 10px;
    right: 10px;
}

.modal-mask-small {
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
</style>