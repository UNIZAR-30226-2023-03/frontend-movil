<script>
import { IonButton } from '@ionic/vue';
import axios from 'axios';
export default {
  components:{
    IonButton
  },
  props: {
    show: Boolean
  },
  data() {
    return {
      errorUser: false,
      Enviado: false,
      username: '',
      userId: ''
    }
  },
  methods: {
    recoverPass() {
      this.errorUser = false;
      axios.get('https://lamesa-backend.azurewebsites.net/usuario/obtener-id?name=' + this.username)
        .then((response) => {
          const success = response.status === 200;
          console.log(response.data)
          if (success) {
            this.userId = response.data
            axios.post('https://lamesa-backend.azurewebsites.net/usuario/recuperar-password/' + this.userId)
              .then((response) => {
                const success = response.status === 200;
                if (success) {
                  console.log("perfecto")
                  this.Enviado = true;
                }
              })
          }
        })
        .catch((error) => {
          console.log(error);
          console.log("error en la pri peticion");
          this.errorUser = true;
        })
    },
    closeModal() {
      this.$emit('close')
      this.Enviado = false
    }
  }
}
</script>

<style>
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
</style>

<template>
  <Transition name="notificaciones">
    <div v-if="show" class="modal-mask">
      <div  class="modal-container">
        <a class="close-icon-img" @click="closeModal">
          <img src="../../public/assets/close.png" alt="cerrar popup">
        </a>
        <div v-if="!Enviado" class="modal-header">
          <slot name="header">Recuperar Contraseña</slot>
        </div>
        <p></p>
        <div v-if="Enviado">Ve a tu correo</div>
        <form  v-if="!Enviado" class="chat-input" @submit.prevent="recoverPass">
          <input  v-model="username" placeholder="Nombre de usuario" required>
          <p></p>
          <div v-if="errorUser" style="color: red;">El usuario no existe</div>
          <div style="display: flex; justify-content: center;">
            <ion-button type="submit">
              Enviar
            </ion-button>
          </div>

        </form>


      </div>
    </div>
  </Transition>
</template>


<style>
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
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  width: 300px;
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