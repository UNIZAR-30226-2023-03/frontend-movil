import { NavigationGuard } from 'vue-router';
import Cookies from 'js-cookie';

// Middleware para comprobar si el usuario está autenticado
const comprobarAutenticacion: NavigationGuard = (to, from, next) => {
  const sessionId = Cookies.get('sessionId');
  if (sessionId) {
    // Si la cookie de sesión existe, pasa a la siguiente pantalla
    next();
  } else {
    // Si no existe la cookie de sesión, redirige al usuario al login
    next('/login');
  }
};

export default comprobarAutenticacion;
