<script>
import { IonCard, IonButton } from '@ionic/vue';
import Cookies from 'js-cookie';
import axios from 'axios';
import router from "@/router";

export default {

  components: {
    IonCard,
    IonButton
  },
  props: {
    show: Boolean,
  },
  data() {
    return {
      listaTorneos: [],
    }
  },
  methods: {

    cerrar() {
      this.$emit('close');
      this.cargarTorneos();
    },

    conectarTorneo(idTorneo, apuntado, esUltimo) {
      if (!apuntado) {
        console.log("No se ha podido unirse al torneo");
        return;
      }

      Cookies.set('torneoId', idTorneo);

      if (esUltimo) {
        // Ir directamente a la pagina para darle a jugar
        console.log("Es ultimo");   // En principio nunca entra aqui
      } else {
        // Ir a pantalla esperando
        console.log("No es ultimo");
        router.push({path: '/esperando'});
      }
    },

    cargarTorneos() {
      console.log('Cargar global');
      this.listaTorneos = [];
      axios.get('https://lamesa-backend.azurewebsites.net/torneo', {})
        .then((response) => {
          const success = response.status === 200;
          if (success) {
            console.log(response.data);
            this.listaTorneos = response.data;
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },

    unirseTorneo(torneo){
        axios
        .post("https://lamesa-backend.azurewebsites.net/torneo/apuntar", {
          usuario: Cookies.get("sessionId"),
          torneo: torneo.id,
        })
        .then((response) => {
          const success = response.status === 200;
          if (success) {


            this.conectarTorneo(
              response.data.id,
              Boolean(response.data.apuntado),
              Boolean(response.data.esJugador16)
            );
          } else {
              console.log("No se ha podido unirse al torneo");
          }
        })
        .catch((error) => {
          console.log("No se ha podido unirse al torneo");
          console.log(error);
        });
    }


  },

  mounted() {
    this.cargarTorneos();
  }
}
</script>

<template>
  <Transition name="notificaciones">
    <div v-if="show" class="modal-mask" style="z-index: 0;">
      <div class="modal-container">
        <a class="close-icon-img" @click="cerrar()">
          <img src="../../public/assets/close.png" alt="cerrar popup">
        </a>

        <div class="customTab" style="overflow: scroll; -webkit-overflow-scrolling: touch;">
          
          <h1>Lista de torneos</h1>

          <hr style="margin-top: 10px; margin-bottom: 10px; border-top: 2px solid white;">

          <div v-if="listaTorneos.length">

            <ion-card v-for="(t, index) in listaTorneos" :key="index" class="margin0">
              
              <div style="display: flex; justify-content: space-between; align-items: center; padding: 7px; padding-bottom: 0;">
                <div style="width: 40%; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-weight: bold;">
                  {{ t.nombre }}
                </div>

                <div style="width: 10px; height: auto;">
                  <img src="../../public/assets/moneda.png" />
                </div>

                <div style="width: 10%; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; ">
                  {{ t.precioEntrada }}
                </div>
                <ion-button  style="width: 40%;" size="small" @click="unirseTorneo(t)">
                  APUNTARSE
                </ion-button>
              </div>

              <div style="display: flex; padding: 7px; padding-top: 0;">
                <div style="width: 60%; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; ">
                  {{ t.cb}}
                </div>

                <div style="width: 40%; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; ">
                  {{ t.cf }}
                </div>
              </div>
            </ion-card>
          </div>
          <div v-else>
            <p style="font-size: smaller;"> No se han encontrado torneos</p>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

