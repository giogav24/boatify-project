import { createRouter, createWebHistory } from "vue-router";
//import { auth } from "./middle.js";
import RegistrazioneView from "../views/RegistrazioneView.vue";
import LoginView from "../views/LoginView.vue";
import Dashboard from "../views/DashboardView.vue";
import ProfiloView from "../views/ProfiloView.vue";

const routes = [
  {
    path: "/registrazione",
    name: "Registrazione",
    component: RegistrazioneView,
  },
  {
    path: "/login",
    name: "Login",
    component: LoginView,
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: Dashboard,
    //beforeEnter: [auth],
    // middleware => login se non autenticato
  },
  {
    path: "/profilo",
    name: "Profilo",
    component: ProfiloView,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
