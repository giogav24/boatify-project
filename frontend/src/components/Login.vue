<template>
  <form>
    <div class="text-center mb-8">
      <h1 class="text-4xl font-bold text-white">BOATIFY</h1>
      <img src="../assets/logo.png" alt="Logo BOATIFY" class="mt-4" />
    </div>
    <div class="form-group">
      <label for="exampleInputEmail1">Email</label>
      <input
        type="email"
        class="form-control"
        id="exampleInputEmail1"
        aria-describedby="emailHelp"
        placeholder="Inserisci la tua email"
      />
      <small id="emailHelp" class="form-text text-muted"
        >We'll never share your email with anyone else.</small
      >
    </div>
    <div class="form-group">
      <label for="exampleInputPassword1">Password</label>
      <input
        type="password"
        class="form-control"
        id="exampleInputPassword1"
        placeholder="Password"
      />
    </div>
    <button type="submit" class="btn btn-primary">Login</button>
    <p class="mt-3">
      Non hai ancora un account?
      <router-link :to="{ name: 'Registrazione' }">Registrati</router-link>
    </p>
  </form>
</template>

<script>
import { config } from "@/config";
import { defineComponent } from "vue";
import store from "@/store/index";
import router from "@/router";

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
    async login() {
      //console.log("request received")
      const opzioniRichiesta = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(this.user),
      };
      //console.log(opzioniRichiesta.body);
      try {
        const res = await fetch(
          `/api/${config.API_VERSION}/auth/loginUtente`,
          opzioniRichiesta
        );
        const data = await res.json();

        if (data.success) {
          //console.log('user logged in ' + data.nome)
          store.commit("setToken", {
            user: data.nome,
            email: data.email,
            token: data.token,
          });
          router.push({ name: "DashBoard" });
        } else {
          //console.log("something went wrong")
          this.error.status = true;
          this.error.message =
            data?.error || data?.message || "Unexpected error";
          console.error(this.error.message);
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
