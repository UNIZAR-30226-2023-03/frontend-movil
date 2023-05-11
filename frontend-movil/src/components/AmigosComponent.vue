<script>
import { IonLabel, IonSegment, IonSegmentButton, IonCard, IonButton, IonCardTitle, IonCardContent, IonCardHeader } from '@ionic/vue';
import Cookies from 'js-cookie';
import axios from 'axios';
import router from "@/router";

export default {
  components: {
    IonLabel,
    IonSegment,
    IonSegmentButton,
    IonCard,
    IonButton,
    IonCardTitle,
    IonCardContent,
    IonCardHeader
  },
  props: {
    show: Boolean,
  },
  data() {
    return {
      tabSelected: "amigos",
      listaAmigos: [],
      listaSolicitudes: [],
      usuarioEnviar: "",
      msgError: "",
      colorError: ""
    }
  },
  methods: {
    enviarSolicitud() {
      let idAmigo = 0;

      const sessionId = Cookies.get('sessionId');
      axios.get('https://lamesa-backend.azurewebsites.net/usuario/obtener-id?name=' + this.usuarioEnviar, {})
        .then((response) => {
          const success = response.status === 200;
          if (success) {
            console.log("Id de usuario:" + response.data);
            idAmigo = response.data

            console.log('Enviando solicitud de amistad');
            axios.post('https://lamesa-backend.azurewebsites.net/usuario/enviar-solicitud', {
              usuario: sessionId,
              amigo: idAmigo
            })
              .then((response) => {
                if (idAmigo == sessionId) {
                  this.mostrarError("No puedes enviarte una solicitud a tí mismo", "red");
                  return;
                }

                const success = response.status === 200;
                if (success) {
                  console.log("Solicitud de amistad enviada");
                  this.mostrarError("Solicitud enviada", "green");
                  this.cargarDatos();
                }
              })
              .catch((error) => {
                this.mostrarError("No puedo enviar la solicitud", "red");
                console.log(error);
              });
          }
        })
        .catch((error) => {
          this.mostrarError("Usuario no encontrado", "red");
          console.log(error);
        });
    },

    aceptarSolicitud(idAmigo) {
      const sessionId = Cookies.get('sessionId');
      axios.post('https://lamesa-backend.azurewebsites.net/usuario/aceptar-solicitud', {
        usuario: sessionId,
        amigo: idAmigo
      })
        .then((response) => {
          const success = response.status === 200;
          if (success) {
            console.log("Solicitud de amistad aceptada");
            this.cargarDatos();
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },


    rechazarSolicitud(idAmigo) {
      const sessionId = Cookies.get('sessionId');
      axios.post('https://lamesa-backend.azurewebsites.net/usuario/denegar-solicitud', {
        usuario: sessionId,
        amigo: idAmigo
      })
        .then((response) => {
          const success = response.status === 200;
          if (success) {
            console.log("Solicitud de amistad aceptada");
            this.cargarDatos();
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },

    eliminarAmigo(idAmigo) {
      const sessionId = Cookies.get('sessionId');
      axios.post('https://lamesa-backend.azurewebsites.net/usuario/eliminar-amigo', {
        usuario: sessionId,
        amigo: idAmigo
      })
        .then((response) => {
          const success = response.status === 200;
          if (success) {
            console.log("Amigo eliminado");
            this.cargarDatos()
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },

    cambiarTab(tab) {
      //this.cargarDatos();
      this.tabSelected = tab;
    },

    cargarDatos() {
      // Ver amigos
      const sessionId = Cookies.get('sessionId');
      axios.get('https://lamesa-backend.azurewebsites.net/usuario/amigos/' + sessionId, {})
        .then((response) => {
          const success = response.status === 200;
          if (success) {
            console.log(response.data);
            this.listaAmigos = response.data;
          }
        })
        .catch((error) => {
          console.log(error);
        });

      // Ver solicitudes de amistad
      axios.get('https://lamesa-backend.azurewebsites.net/usuario/solicitudes/' + sessionId, {})
        .then((response) => {
          const success = response.status === 200;
          if (success) {
            console.log(response.data);
            this.listaSolicitudes = response.data;
          }
        })
        .catch((error) => {
          console.log(error);
        });
      //this.$forceUpdate();
    },

    cerrar() {
      this.cargarDatos();
      this.$emit('close');
    },

    unirseAmigo(partidaAmigo) {
      const sessionId = Cookies.get('sessionId');
      axios.post('https://lamesa-backend.azurewebsites.net/partida/conectar-amigo', {
        jugador: sessionId,
        partida: partidaAmigo
      })
        .then((response) => {
          const success = response.status === 200;
          if (success) {
            Cookies.set('jugadores', response.data.jugadores);
            router.push({ path: '/partida', query: { nombreUsuario: this.nombreUsuario, idJugador: this.idJugador, jugadores: JSON.stringify(response.data.jugadores), id: response.data.id, color: response.data.color, hostPrivada: false } });
          }
        })
        .catch((error) => {
          this.mostrarError("La partida no existe");
          console.log(error);
        });
    },

    mostrarError(mensaje, color) {
      this.msgError = mensaje;
      this.colorError = color;
    }

  },
  mounted() {
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
    <div v-if="show" class="modal-mask">
      <div class="modal-container">
        <a class="close-icon-img" @click="cerrar()">
          <img src="../../public/assets/close.png" alt="cerrar popup">
        </a>

        <!-- Cabecera tabs -->
        <ion-segment value="default">
          <ion-segment-button value="default" @click="cambiarTab('amigos')">
            <ion-label style="font-size: smaller;">Amigos</ion-label>
          </ion-segment-button>
          <ion-segment-button value="segment" @click="cambiarTab('solicitudes')">
            <ion-label style="font-size: smaller;">Solicitudes</ion-label>
          </ion-segment-button>
        </ion-segment>

        <!-- Tabs -->
        <div class="customTab" v-show="tabSelected == 'amigos'" style="overflow: scroll;">

          <ion-card v-for="a in listaAmigos" :key="a.id">
            <ion-card-header style="display: flex;">
              <ion-card-title class="d-block ml-auto"
                style="width: 100%; font-size: medium; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                {{ a.username }}
              </ion-card-title>
              <button @click="eliminarAmigo(a.id)" class="mr-0"
                style="margin: 0px; padding: 0px; background-color: rgb(219, 52, 52); border-radius: 5px; width: 20px; float: right">
                <img src="../../public/assets/eliminar.png" style="width:100%; height: 100%;">
              </button>
            </ion-card-header>

            <ion-card-content v-if="a.estado == 'ESPERANDO_JUGADORES'" style="display: flex; font-size: small;">
              Esperando jugadores
              <ion-button size="small" @click="unirseAmigo(a.idPartida)">UNIRSE</ion-button>
            </ion-card-content>
          </ion-card>
        </div>

        <div class="customTab" v-show="tabSelected == 'solicitudes'" style="overflow: scroll;">
          <h2 style="font-size: medium; margin-bottom:0">Enviar solicitud</h2>
          <input v-model="usuarioEnviar" placeholder="Nombre de usuario"
            style="width: auto; margin-top: 0px; height: 25px;">
          <button class="mr-0"
            style="margin: 0px; padding: 0px; background-color: rgb(50, 180, 55); border-radius: 5px; width: 25px; float: right"
            @click="enviarSolicitud">
            <img src="../../public/assets/check.png" style="width:100%; height: 100%;">
          </button>

          <p style="font-size: smaller;" :style="{ 'color': colorError }"> {{ msgError }}</p>


          <hr style="margin-top: 10px; margin-bottom: 10px; border-top: 2px solid white;">
          <h2 style="font-size: medium; margin-bottom:0; margin-top:0">Solicitudes recibidas</h2>

          <ion-card v-for="s in listaSolicitudes" :key="s.id">
            <ion-card-header style="display: flex;">
              <ion-card-title class="d-block ml-auto"
                style="width: auto; font-size: medium; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                {{ s.username }}
              </ion-card-title>
            </ion-card-header>

            <ion-card-content style="display: flex; font-size: small;">
              <ion-button color="success" @click="aceptarSolicitud(s.id)" size="small" style="width: 40%;">ACEPTAR</ion-button>
              <ion-button color="danger" @click="rechazarSolicitud(s.id)" size="small" style="width: 50%;">RECHAZAR</ion-button>
            </ion-card-content>
          </ion-card>

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