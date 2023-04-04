import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import TabsPage from '../views/TabsPage.vue'
import LoginPage from '../views/LoginPage.vue'
import ParchisPage from '../views/ParchisPage.vue'
import RegistroPage from '../views/RegistroPage.vue'


const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: LoginPage
    //redirect: '/tabs/tab1'
  },
  {
    path: '/registrarse',
    component: RegistroPage
    //redirect: '/tabs/tab1'
  },
  {
    path: '/partida',
    component: ParchisPage
  },
  {
    path: '/tabs/',
    component: TabsPage,
    children: [
      {
        path: '',
        redirect: '/tabs/tab1'
      },
      {
        path: 'tab1',
        component: () => import('@/views/Tab1Page.vue')
      },
      {
        path: 'tab2',
        component: () => import('@/views/Tab2Page.vue')
      },
      {
        path: 'tab3',
        component: () => import('@/views/Tab3Page.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
