<script>
import { IonLabel, IonSegment, IonSegmentButton } from '@ionic/vue';
export default {
  components:{
    IonLabel,
    IonSegment,
    IonSegmentButton
  },
  props: {
    show: Boolean
  },
  data(){
    return{
      tabSelected : "amigos"
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
      <div class="modal-container">
        <a class="close-icon-img" @click="$emit('close')">
          <img src="../../public/assets/close.png" alt="cerrar popup">
        </a>

        <!-- Cabecera tabs -->
        <ion-segment value="default">
        <ion-segment-button value="default" @click="tabSelected='amigos'">
          <ion-label style="font-size: smaller;">Amigos</ion-label>
        </ion-segment-button>
        <ion-segment-button value="segment" @click="tabSelected='solicitudes'">
          <ion-label style="font-size: smaller;">Solicitudes</ion-label>
        </ion-segment-button>
      </ion-segment>

      <!-- Tabs -->
      <div class="customTab" v-show="tabSelected == 'amigos'">
        amigos
      </div>

      <div v-show="tabSelected == 'solicitudes'">
        v
      </div>
      </div>
    </div>
  </Transition>
</template>


<style>
.customTab{
  height: 200px;
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