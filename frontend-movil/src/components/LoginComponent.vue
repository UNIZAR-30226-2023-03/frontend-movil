
<template>
  <div class="login-background">
  <div class="bg-image"></div> 
    <div class="login-container">
      <form @submit.prevent="login" name="login_form" class="login-form" method="post">
        <h1>Iniciar sesion</h1>
        <input class="login-input" type="text" placeholder="Username" aria-label="Username" name="username" v-model="userLogin" required autofocus>
        <input class="login-input" type="password" placeholder="Password" aria-label="Password" name="password" v-model="password" required>
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
  
  export default defineComponent({
    data() {
      return {
        userLogin: '',
        password: ''
      };
    },
    methods: {
      login() {
        axios.post('https://lamesa-backend.azurewebsites.net/usuario/login', {
          login: this.userLogin,
          password: this.password
        })
        .then((response) => {
          const success = response.status === 200;
          if (success) {
            router.push('/menu'); // navigate to /menu route
          }
        })
        .catch((error) => {
          console.log(error);
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


  