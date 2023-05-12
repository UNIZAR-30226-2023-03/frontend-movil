<script>
import { IonLabel, IonSegment, IonSegmentButton, IonCheckbox, IonItem } from '@ionic/vue';
import Cookies from 'js-cookie';
import axios from 'axios';
import router from "@/router";

export default {

  components: {
    IonLabel,
    IonSegment,
    IonSegmentButton,
    IonCheckbox,
    IonItem
  },
  props: {
    show: Boolean,
    nombreUsuario: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      filtrarAmigos: false,
      tabSelected: "top",
      selected: 'pganadas',
      options: [
        { text: 'Partidas ganadas', value: 'pganadas' },
        { text: 'Partidas jugadas', value: 'pjugadas' },
        { text: 'Torneos jugados', value: 'tjugados' },
        { text: 'Torneos ganados', value: 'tganados' },
        { text: 'Media comidas', value: 'mediaComidas' },
        { text: 'Media en meta', value: 'mediaEnMeta' }
      ],
      listaRanking: []
    }
  },
  methods: {
    cambiarTab(tab) {
      this.cargarDatos();
      this.tabSelected = tab;
    },

    cargarDatos() {
      console.log('Cargar datos');
    },

    cerrar() {
      this.cambiarTab("top");
      this.cargarDatos();
      this.$emit('close');
    },

    cargarRanking() {
      console.log('Cargar ranking');
      axios.get('https://lamesa-backend.azurewebsites.net/usuario/ranking?campo=' + this.selected, {})
        .then((response) => {
          const success = response.status === 200;
          this.listaRanking = response.data;
          if (success) {
            console.log(response.data);
            this.listaAmigos = response.data;
          } else {
            this.listaRanking = [];
          }
        })
        .catch((error) => {
          console.log(error);
          this.listaRanking = [];
        });
    }
  },
  mounted() {
    this.cambiarTab("top");
    this.cargarDatos();
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

.mr-0 {
  margin-right: auto;
}

.ml-auto {
  margin-left: 0;
}

.d-block {
  display: block;
}
</style>

<template>
  <Transition name="notificaciones">
    <div v-if="show" class="modal-mask" style="z-index: 0;">
      <div class="modal-container">
        <a class="close-icon-img" @click="cerrar()">
          <img src="../../public/assets/close.png" alt="cerrar popup">
        </a>

        <!-- Cabecera tabs -->
        <ion-segment value="default">
          <ion-segment-button value="default" @click="cambiarTab('top')">
            <ion-label style="font-size: 9px;">Mejores jugadores</ion-label>
          </ion-segment-button>
          <ion-segment-button value="segment" @click="cambiarTab('misStats')">
            <ion-label style="font-size: 9px;">Mis estadísticas</ion-label>
          </ion-segment-button>
        </ion-segment>

        <!-- Tabs -->
        <div class="customTab" v-show="tabSelected == 'top'" style="overflow: scroll; -webkit-overflow-scrolling: touch;">
          <ion-item style="margin-top: 10px;">
            <ion-label class="margin0">Filtrar amigos</ion-label>
            <ion-checkbox class="margin0" v-model="filtrarAmigos"></ion-checkbox>
          </ion-item>

          <ion-item>
            <ion-label>Ordenar</ion-label>
            <select v-model="selected" style="width: 65%; font-size: small;" @change="cargarRanking()">
              <option v-for="option in options" :value="option.value" :key="option.value">
                {{ option.text }}
              </option>
            </select>
          </ion-item>

          <hr style="margin-top: 10px; margin-bottom: 10px; border-top: 2px solid white;">


          <div
            style="font-size: smaller; display: flex; justify-content: space-evenly; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-weight: bold; color: white;">
            <div
              style="font-size: smaller; width: 30%; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-weight: bold; color: white;">
              Posición
            </div>

            <div style=" width: 30%;">
              Nombre
            </div>

            <div
              style="font-size: smaller; width: 30%; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-weight: bold; color: white;">
              Medida
            </div>
          </div>

          <ion-card class=" margin0" style="padding: 5px">
            <div style="display: flex;" justify-content:space-between>
              <div style="width: 20%; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; ">
                121
              </div>

              <div style="width: 70%; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; ">
                JugadorxD23_zGz
              </div>
              <div
                style="width: 20%; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-weight: bold; color: white;">
                237
              </div>
            </div>
          </ion-card>

          <div v-if="listaRanking.length">
            <ion-card v-for="(r, index) in listaRanking" :key="index">
              <div style="display: flex;">

                <div style="width: 20%; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; ">
                  {{ index }}
                </div>

                <div style="width: 70%; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; ">
                  {{ r.username }}
                </div>

                <div
                  style="width: 20%; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-weight: bold; color: white;">
                  {{ r.selected }}
                </div>
                
              </div>
            </ion-card>
          </div>
          <div v-else>
            <p style="font-size: smaller;"> No se han encontrado jugadores</p>

          </div>
        </div>


        <div class="customTab" v-show="tabSelected == 'misStats'"
          style="overflow: scroll; -webkit-overflow-scrolling: touch;">

        </div>
      </div>
    </div>
  </Transition>
</template>


<style>
.customTab {
  height: 200px;
  width: 100%;
}

.modal-mask {
  position: fixed;
  z-index: 1;
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

.margin0 {
  margin: 0
}
</style>