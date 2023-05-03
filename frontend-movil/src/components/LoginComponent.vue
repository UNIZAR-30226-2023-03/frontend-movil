
<template>
  <div class="login-background">
  <div class="bg-image"></div> 
    <div class="login-container">
      <form @submit.prevent="login" name="login_form" class="login-form" method="post">
        <h1>Iniciar sesion</h1>
        <input class="login-input" type="text" placeholder="Username" aria-label="Username" name="username" v-model="userLogin" required autofocus>
        <input class="login-input" type="password" placeholder="Password" aria-label="Password" name="password" v-model="password" required>
        <div v-if="loading" class="loading-spinner"></div>
        <div v-if="showErrorPass" class="error-message" style="color: red;">Usuario o contraseña incorrectos</div>
        <button class="login-button" type="submit">Iniciar Sesión</button>
        ¿Aun no tienes una cuenta? 
        Registrate <span class="register-link" @click="moveToRegister">aquí</span>
      </form>
      
    </div>
  
</div>
  </template>
  
  <script>
  import { defineComponent } from 'vue';
  import axios from 'axios';
  import router from "@/router";
  import Cookies from 'js-cookie';
  export default defineComponent({
    data() {
      return {
        userLogin: '',
        password: '',
        showErrorPass: false,
        loading: false
      };
    },
    methods: {
      login() {
        this.showErrorPass = false;
        this.loading = true;
        axios.post('https://lamesa-backend.azurewebsites.net/usuario/login', {
          login: this.userLogin,
          password: this.password
        })
        .then((response) => {
          const success = response.status === 200;
          console.log(response.data.username)
          if (success) {
            Cookies.set('sessionId', response.data.id);
            router.push({ path: '/menu', query: { userId: response.data.id, username: response.data.username, monedas: response.data.numMonedas } }); // navigate to /menu route
          }
        })
        .catch((error) => {
        console.log(error);
        if (error.response && error.response.status === 400) {
          this.showErrorPass = true;
          
        }
      }).finally(() => {
      this.loading = false;
    });
      },
      moveToRegister() {
        router.push('/registrarse'); // navigate to /registrarse route
      }
    }
  });
  </script>
  

<style>
@import '../theme/estilosInicio.css';
</style>


  