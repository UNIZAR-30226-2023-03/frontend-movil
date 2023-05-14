<template>
  <div class="login-background">
  <div class="bg-image"></div> 
    <div class="login-container">
      <form @submit.prevent="onSubmit" name="login_form" class="login-form" method="post">
        <h1>Registrarse</h1>
        <input type="text" class="login-input" placeholder="Nombre" aria-label="Username" name="username" v-model="userReg" required autofocus>
        <input type="text" class="login-input" placeholder="Email" aria-label="Email" name="email" v-model="email" required autofocus>
        <div v-if="showErrorCuenta" class="error-message" style="color: red;">Error: {{ errorMessage }}</div>
        <input type="password" class="login-input" placeholder="Contraseña" aria-label="Password" name="password" v-model="password1" required>
        <input type="password" class="login-input" placeholder="Repita contraseña" aria-label="Password" name="password2" v-model="password2" required>
        <div v-if="loading" class="loading-spinner"></div>
        <div v-if="showErrorPass" class="error-message" style="color: red;">Las contraseñas no coinciden</div>
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
      loading: false,
      userReg: '',
      email: '',
      password1: '',
      password2: '',
      showErrorPass: false,
      showErrorCuenta: false,
      errorMessage: ''

    };
  },
  methods: {
    onSubmit(event) {
      if (this.password1 !== this.password2) {
        this.showErrorPass = true;
        event.preventDefault();
      } else {
        this.showErrorPass = false;
        this.loading = true;
        axios.post('https://lamesa-backend.azurewebsites.net/usuario/crear', {
          "email": this.email,
          "username": this.userReg,
          "password": this.password1
        })
        .then(function (response) {
          console.log(response);
          const success = response.status === 200;
          
          console.log(success);
          if (success) {
            router.push('/')
          } 
          this.showErrorCuenta = false;
        })
        .catch((error) => {
          this.loading = false;
        console.log(error);
        if (error.response && error.response.status === 400) {
          this.showErrorCuenta = true;
          this.errorMessage = error.response.data;
        }
      });
      }
    },
    moveToLogin() {
      router.push('/')
    }
  }
});
</script>
<style>
@import '../theme/estilosInicio.css';
</style>