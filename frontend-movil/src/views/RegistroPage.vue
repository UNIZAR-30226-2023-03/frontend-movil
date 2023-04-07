<template>
  <div class="login-background">
  <div class="bg-image"></div> 
    <div class="login-container">
      <form @submit.prevent="login" name="login_form" class="login-form" method="post">
        <h1>Registrarse</h1>
        <input type="text" class="login-input" placeholder="Nombre" aria-label="Username" name="username" v-model="userReg" required autofocus>
        <input type="text" class="login-input" placeholder="Email" aria-label="Email" name="email" v-model="email" required autofocus>
        <input type="password" class="login-input" placeholder="Contraseña" aria-label="Password" name="password" v-model="password1" required>
        <input type="password" class="login-input" placeholder="Repita contraseña" aria-label="Password" name="password2" v-model="password2" required>
        <button class="login-button" type="submit">Crear cuenta</button>
        ¿ya tienes cuenta? 
        Inicia sesión  <span class="register-link" @click="moveToLogin">aquí</span>
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
      userReg: '',
      email: '',
      password1: '',
      password2: ''
    };
  },
  methods: {
    login() {
      axios.post('https://lamesa-backend.azurewebsites.net/usuario/crear', {
        
      "email": this.email,
      "username": this.userReg,
      "password": this.password1
      
      })
        .then(function (response) {
          console.log(response);
          const success = response.status === 200;
          console.log(success);
          if(success){
            // router.push('/')
            window.location.href = "/";
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    }
    ,
    moveToLogin() {
  window.location.href = "/";
}
  }
});
</script>

<style>
@import '../theme/estilosInicio.css';
</style>

  
  