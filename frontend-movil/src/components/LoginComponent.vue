<!-- <template>
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
</template> -->


<template>
  <div class="login-background">
  <div class="bg-image"></div> 
    <div class="login-container">
      <form action="" name="login_form" class="login-form" method="post">
        <h1>Iniciar sesion</h1>
        <input type="text" placeholder="Username" aria-label="Username" name="username" v-model="userLogin" required autofocus>
        <input type="password" placeholder="Password" aria-label="Password" name="password" v-model="password" required>
        <button class="login-button" type="submit">Iniciar Sesión</button>
        ¿Aun no tienes una cuenta? 
        Registrate <span class="register-link" @click="moveToRegister">aquí</span>
      </form>
      
    </div>
  
</div>
  </template>
  
<script>
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonLabel, IonInput, IonButton } from '@ionic/vue';
import { defineComponent } from 'vue';
import axios from 'axios';
import router from "@/router";

export default defineComponent({

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
    ,
    moveToRegister() {
  window.location.href = "/registrarse";
  }
  }
});
</script>

<style>
@import '../theme/estilosInicio.css';
</style>


  