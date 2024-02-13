<template>
  <form class="container">
    <div class="text-center mb-8">
      <h1 class="text-4xl font-bold text-white">BOATIFY</h1>
      <img src="../assets/logo.png" alt="Logo BOATIFY" class="mt-4" />
    </div>
    <div v-if="error.status" class="alert alert-danger m-4" role="alert">
      <h1 v-text="error.message"></h1>
    </div>
    <div class="form-group">
      <label>Email</label>
      <input
        type="email"
        class="form-control"
        placeholder="Inserisci la tua email"
        v-model="user.email"
      />
      <small id="emailHelp" class="form-text text-muted"
        >We'll never share your email with anyone else.</small
      >
    </div>
    <div class="form-group">
      <label>Password</label>
      <input
        type="password"
        class="form-control"
        placeholder="Password"
        v-model="user.password"
      />
    </div>
    <button class="btn btn-primary" @click="login">Login</button>
    <p class="mt-3">
      Non hai ancora un account?
      <router-link :to="{ name: 'Registrazione' }">Registrati</router-link>
    </p>
  </form>
</template>

<script>
//import { config } from "@/config";
import { defineComponent } from "vue";
import store from "@/store/index";
//import router from "@/router";

export default defineComponent({
  name: "LoginForm",
  data() {
    return {
      user: {
        email: "",
        password: "",
      },
      error: {
        status: false,
        message: "default message",
      },
    };
  },
  methods: {
    async login(event) {
      event.preventDefault();
      //console.log("request received")
      const opzioniRichiesta = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(this.user),
      };
      //console.log(opzioniRichiesta.body);
      try {
        const res = await fetch(
          `${process.env.VUE_APP_SERVER_API_URL}/api/${process.env.VUE_APP_API_VERSION}/auth/loginUtente`,
          opzioniRichiesta
        );
        const data = await res.json();

        console.log(data);
        if (data.success) {
          //console.log('user logged in ' + data.nome)
          store.commit("setToken", {
            user: data.nome,
            email: data.email,
            token: data.token,
          });
          //router.push({ name: "Dashboard" });
        } else {
          //console.log("something went wrong")
          this.error.status = true;
          this.error.message =
            data?.error || data?.message || "Unexpected error";
        }
      } catch (error) {
        this.error.status = true;
        this.error.message = error || "Errore inaspettato";
      }
    },
  },
});
</script>
<style scoped></style>
