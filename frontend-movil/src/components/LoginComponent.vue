<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Login</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <form @submit.prevent="login">
        <ion-item>
          <ion-label position="floating">Usuario/Contraseña</ion-label>
          <ion-input v-model="userLogin"></ion-input>
        </ion-item>

        <ion-item>
          <ion-label position="floating">Contraseña</ion-label>
          <ion-input type="password" v-model="password"></ion-input>
        </ion-item>

        <ion-button type="submit" expand="block">Iniciar sesión</ion-button>
      </form>
    </ion-content>
  </ion-page>
</template>
  
<script>
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonLabel, IonInput, IonButton } from '@ionic/vue';
import { defineComponent } from 'vue';
import axios from 'axios';
import router from "@/router";

export default defineComponent({
  components: {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonItem,
    IonLabel,
    IonInput,
    IonButton
  },
  data() {
    return {
      userLogin: '',
      password: ''
    };
  },
  methods: {
    login() {
      axios.post('https://backend-sy93.onrender.com/usuarios/login', {
        login: this.userLogin,
        password: this.password
      })
        .then(function (response) {
          console.log(response);
          const success = response["data"];
          console.log(success);
          if(success){
            router.push('/tabs/tab1')
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  }
});
</script>
  