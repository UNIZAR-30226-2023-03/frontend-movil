
<template>
  <div class="login-background">
    <div class="bg-image"></div>
    <div class="login-container">
      <form @submit.prevent="login" name="login_form" class="login-form" method="post">
        <h1>Iniciar sesion</h1>
        <input class="login-input" type="text" placeholder="Username" aria-label="Username" name="username"
          v-model="userLogin" required autofocus>
        <input class="login-input" type="password" placeholder="Password" aria-label="Password" name="password"
          v-model="password" required>
        <div v-if="loading" class="loading-spinner"></div>
        <div v-if="showErrorPass" class="error-message" style="color: red;">Usuario o contraseña incorrectos</div>
        <button class="login-button" type="submit">Iniciar Sesión</button>
        ¿Aun no tienes una cuenta?
        Registrate <span class="register-link" @click="moveToRegister">aquí</span>
        <p></p>
        <a class="register-link" @click="showModalPass = true">Olvidé mi contraseña</a>
      </form>

    </div>

    <Teleport to="body">
      <RecoverPass :show="showModalPass" @close="showModalPass = false">
      </RecoverPass>
    </Teleport>
  </div>
</template>
  
<script>
import { defineComponent } from 'vue';
import axios from 'axios';
import router from "@/router";
import Cookies from 'js-cookie';
import RecoverPass from "@/components/RecoverPassComponent.vue"
export default defineComponent({
  components: {
    RecoverPass
  },
  data() {
    return {
      idUsuario: 0,
      userLogin: '',
      password: '',
      showErrorPass: false,
      loading: false,
      showModalPass: false,
      fichaActiva: '',
      tableroActivo: ''
    };
  },
  methods: {
    async verSkinsActivas(id) {
      console.log('cargando skins activas de ', id);
      axios.get('https://lamesa-backend.azurewebsites.net/usuario/ficha-activa/' + id)
        .then(response => {
          console.log('TableroAvtivo= ', response.data.id);
          this.fichaActiva = response.data.id;
          Cookies.set('fichaActiva', this.fichaActiva);
        })
        .catch(error => {
          console.log(error);
        });


      axios.get('https://lamesa-backend.azurewebsites.net/usuario/tablero-activo/' + parseInt(id))
        .then(response => {
          console.log('responseo= ', response);
          this.tableroActivo = response.data.id;
          Cookies.set('sessionId', id);
          
          
          Cookies.set('tableroActivo', this.tableroActivo);
          router.push({
            path: '/menu',
            query: {
              userId: id,
              tablero: this.tableroActivo,
              username: response.data.username,
              monedas: response.data.numMonedas
            }
          });

        })
        .catch(error => {
          console.log(error);
        })
        .finally((response) => {
          this.loading = false;


        });

      

      Cookies.set('tableroActivo', this.tableroActivo);
      Cookies.set('fichaActiva', this.fichaActiva);
    },
    login() {
      this.showErrorPass = false;
      this.loading = true;
      axios.post('https://lamesa-backend.azurewebsites.net/usuario/login', {
        login: this.userLogin,
        password: this.password
      })
        .then(async (response) => {
          const success = response.status === 200;
          console.log(response.data.username)
          if (success) {
            Cookies.set('username', response.data.username);
            Cookies.set('email', response.data.email);

            await this.verSkinsActivas(response.data.id); // cambiar funcion cuando funcione el backend

          }
        })
        .catch((error) => {
          console.log(error);
          if (error.response && error.response.status === 400) {
            this.loading = false;
            this.showErrorPass = true;

          }
        })
    }
    ,
    moveToRegister() {
      router.push('/registrarse'); // navigate to /registrarse route
    }
  }
});
</script>
  

<style>
@import '../theme/estilosInicio.css';
</style>


  