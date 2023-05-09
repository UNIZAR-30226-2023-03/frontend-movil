import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import Cookies from 'js-cookie';

import LoginPage from '../views/LoginPage.vue';
import ParchisPage from '../views/ParchisPage.vue';
import RegistroPage from '../views/RegistroPage.vue';
import MenuPage from '../views/MenuPage.vue';
import TiendaPage from '../views/TiendaPage.vue';
// Middleware para comprobar si el usuario está autenticado
const comprobarAutenticacion = (to:any, from:any, next:any) => {
  const sessionId = Cookies.get('sessionId');
  if (sessionId) {
    // Si la cookie de sesión existe, pasa a la siguiente pantalla
    next();
  } else {
    // Si no existe la cookie de sesión, redirige al usuario al login
    next('/');
  }
};

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: LoginPage
  },
  {
    path: '/menu',
    component: MenuPage,
    //beforeEnter: comprobarAutenticacion
  },
  {
    path: '/tienda',
    component: TiendaPage,
    //beforeEnter: comprobarAutenticacion
  },
  {
    path: '/registrarse',
    component: RegistroPage
  },
  {
    name: 'partida',
    path: '/partida',
    component: ParchisPage,
    beforeEnter: comprobarAutenticacion
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;
