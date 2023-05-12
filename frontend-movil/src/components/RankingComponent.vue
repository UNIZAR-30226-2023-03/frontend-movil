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
      listaRanking: [],
      stats: {}
    }
  },
  methods: {
    cambiarTab(tab) {
      this.cargarRanking();
      this.cargarEstadisitcas();
      this.tabSelected = tab;
    },

    cerrar() {
      this.cambiarTab("top");
      this.$emit('close');
    },

    cargarRanking() {
      console.log('Cargar ranking');
      axios.get('https://lamesa-backend.azurewebsites.net/usuario/ranking?campo=' + this.selected, {})
        .then((response) => {
          const success = response.status === 200;
          if (success) {
            console.log(response.data);
            this.listaRanking = response.data;
          } else {
            this.listaRanking = [];
          }
        })
        .catch((error) => {
          console.log(error);
          this.listaRanking = [];
        });
    },

    cargarEstadisitcas() {
      console.log('Cargar estadísticas');
      const sessionId = Cookies.get('sessionId');
      axios.get('https://lamesa-backend.azurewebsites.net/usuario/estadisticas/' + sessionId, {})
        .then((response) => {
          const success = response.status === 200;
          if (success) {
            console.log(response.data);
            this.stats = response.data;
          } else {
            this.stats = [];
          }
        })
        .catch((error) => {
          console.log(error);
          this.stats = [];
        });
    }


  },

  mounted() {
    this.cambiarTab("top");
    this.cargarEstadisitcas();
  }
}
</script>

<style>
.modal-container {

  justify-content: space-evenly;
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
          <ion-segment-button :value="tabSelected=='top' ? 'default':'segment'" @click="cambiarTab('top')">
            <ion-label style="font-size: 9px;">Mejores jugadores</ion-label>
          </ion-segment-button>
          <ion-segment-button :value="tabSelected=='misStats' ? 'default':'segment'" @click="cambiarTab('misStats')">
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

          <div v-if="listaRanking.length">
            <div
              style="font-size: smaller; display: flex; justify-content: space-evenly; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-weight: bold; color: white;">
              <div
                style="font-size: smaller; width: 30%; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-weight: bold; color: white;">
                Posición
              </div>

              <div style=" width: 50%;">
                Nombre
              </div>

              <div
                style="font-size: smaller; width: 20%; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-weight: bold; color: white;">
                Medida
              </div>
            </div>

            <ion-card v-for="(r, index) in listaRanking" :key="index">
              <div style="display: flex;">

                <div style="width: 30%; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; ">
                  {{ index + 1}}
                </div>

                <div style="width: 50%; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; ">
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
          <h2> Mis estadísticas: </h2>
          <div class="estadistica">
            <div class="nombreStat"> Partidas jugadas </div> <div class="valorStat"> {{ stats.pjugadas }} </div>
          </div>
          <div class="estadistica">
            <div class="nombreStat"> Partidas ganadas </div> <div class="valorStat"> {{ stats.pganadas }} </div>
          </div>
          <div class="estadistica">
            <div class="nombreStat"> Torneos jugados </div> <div class="valorStat"> {{ stats.tjugados }} </div>
          </div>
          <div class="estadistica">
            <div class="nombreStat"> Torneos ganados </div> <div class="valorStat"> {{ stats.tganados }} </div>
          </div>
          <div class="estadistica">
            <div class="nombreStat"> Media comidas </div> <div class="valorStat"> {{ stats.mediaComidas }} </div>
          </div>
          <div class="estadistica">
            <div class="nombreStat"> Media en meta </div> <div class="valorStat"> {{ stats.mediaEnMeta }} </div>
          </div>

        </div>
      </div>
    </div>
  </Transition>
</template>


<style>
.estadistica{
  margin: 10px;
  display: flex;
  justify-content: space-between;
}

.nombreStat{
  color: rgb(207, 207, 207);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 70%;
}

.valorStat{
  color: white;
  font-weight: bold;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 20%;
  text-align: center;
}

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