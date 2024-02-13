import { createRouter, createWebHistory } from "vue-router";
import RegistrazioneView from "../views/RegistrazioneView.vue";
import LoginView from "../views/LoginView.vue";

const routes = [
  {
    path: "/registrazione",
    name: "Registrazione",
    component: RegistrazioneView,
  },
  {
    path: "/login",
    name: "LoginForm",
    component: LoginView,
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
