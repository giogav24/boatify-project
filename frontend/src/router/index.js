import { createRouter, createWebHashHistory } from 'vue-router'


const routes = [
  
  {
    path: '/registrazione',
    name: 'Registrazione',
    component: RegistrazioneView
  },
  
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router