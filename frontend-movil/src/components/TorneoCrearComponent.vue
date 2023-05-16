<script>
import axios from "axios";
import router from "@/router";
import Cookies from "js-cookie";
import { IonButton, IonLabel, IonSegment, IonSegmentButton } from "@ionic/vue";
export default {
  components: {
    IonLabel,
    IonSegment,
    IonSegmentButton,
    IonButton,
  },
  props: {
    show: Boolean,
  },
  data() {
    return {
      confF: "NORMAL",
      confB: "SOLO_SEGUROS",
      nombreTorneo: "",
      showError: false,
      idUsuario: 0,
      precio: 0,
      monedasUsuario: 0,
    };
  },
  methods: {
    mostrarError(mensaje) {
      this.showError = true;
      document.getElementById("mensajeError").innerHTML = mensaje;
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
    }
    ,

    crearTorneo() {
      if (this.monedasUsuario < this.precio) {
        this.mostrarError("No tienes suficientes monedas para crear el torneo");
        return;
      }

      axios
        .post("https://lamesa-backend.azurewebsites.net/torneo/crear", {
          usuario: Cookies.get("sessionId"),
          precio: this.precio,
          configBarreras: this.confB,
          configFichas: this.confF,
          nombre: this.nombreTorneo,
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
              this.mostrarError("No se ha podido crear el torneo");
          }
        })
        .catch((error) => {
          this.mostrarError("No se ha podido crear el torneo");
          console.log(error);
        });
    },
  },
  beforeMount() {
    this.idUsuario = Cookies.get("sessionId");
  },
  mounted() {
    axios
      .get(
        "https://lamesa-backend.azurewebsites.net/usuario/monedas/" +
          this.idUsuario
      )
      .then((response) => {
        this.monedasUsuario = response.data;
      })
      .catch((error) => {
        console.log(error);
      });
  },
};
</script>

<template>
  <Transition name="privada">
    <div v-if="show" class="modal-mask">
      <div id="modal-torne-crear" class="modal-container">
        <a
          class="close-icon-img"
          @click="
            this.showError = false;
            $emit('close');
          "
        >
          <img src="../../public/assets/close.png" alt="cerrar popup" />
        </a>
        <div
          id="saldo"
          class="image-container"
          style="
            border-color: rgb(28, 212, 74);
            border-radius: 5%;
            border: 10px;
            background-color: rgb(58, 47, 35);
            z-index: 1;
          "
        >
          <span id="precio">{{ monedasUsuario }}</span>
          <img src="../../public/assets/moneda.png" />
        </div>
        <h5 style="width: 100%; margin-top: 6px; margin-bottom: 0px">
          Conexión
        </h5>
        <input
          v-model="nombreTorneo"
          placeholder="Nombre del torneo"
          style="width: 100%; margin-top: 5px"
        />

        <h5 style="width: 100%; margin-top: 8px; margin-bottom: 0px">
          Precio de entrada
        </h5>
        <input
          v-model="precio"
          placeholder="Precio de entrada del torneo"
          style="width: 100%; margin-top: 5px"
          type="number"
        />

        <h5 style="width: 100%; margin-top: 6px; margin-bottom: 0px">
          Velocidad
        </h5>
        <ion-segment value="default">
          <ion-segment-button value="default" @click="confF = 'NORMAL'">
            <ion-label>Normal</ion-label>
          </ion-segment-button>
          <ion-segment-button value="segment" @click="confF = 'RAPIDO'">
            <ion-label>Rápida</ion-label>
          </ion-segment-button>
        </ion-segment>

        <h5 style="width: 100%; margin-top: 6px; margin-bottom: 0px">
          Barreras
        </h5>
        <ion-segment value="default">
          <ion-segment-button value="default" @click="confB = 'SOLO_SEGUROS'">
            <ion-label style="font-size: smaller">Solo seguros</ion-label>
          </ion-segment-button>
          <ion-segment-button value="segment" @click="confB = 'TODAS_CASILLAS'">
            <ion-label style="font-size: smaller">Cualquier casilla</ion-label>
          </ion-segment-button>
        </ion-segment>

        <div style="display: flex; justify-content: center">
          <ion-button
            class="boton-submenu"
            style="width: 100%"
            @click="crearTorneo"
          >
            CREAR TORNEO
          </ion-button>
        </div>
        <p
          id="mensajeError"
          style="
            margin: 0px;
            text-align: center;
            color: red;
            font-weight: bold;
            font-size: small;
          "
          v-show="showError"
        >
          La partida no existe
        </p>
      </div>
    </div>
  </Transition>
</template>

<style>
@import "../theme/estilos.css";


</style>
