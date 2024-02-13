<template>
  <form class="container" @submit.prevent="registerUser">
    <div class="text-center mb-8">
      <h1 class="text-4xl font-bold text-white">BOATIFY</h1>
      <img src="../assets/logo.png" alt="Logo BOATIFY" class="mt-4" />
    </div>
    <div v-if="error.status" class="alert alert-danger m-4" role="alert">
      <h1 v-text="error.message"></h1>
    </div>
    <div class="mb-3">
      <label for="nome" class="form-label">Nome</label>
      <input v-model="user.nome" type="text" class="form-control" id="nome" />
    </div>
    <div class="mb-3">
      <label for="cognome" class="form-label">Cognome</label>
      <input
        v-model="user.cognome"
        type="text"
        class="form-control"
        id="cognome"
      />
    </div>
    <div class="mb-3">
      <label for="prefisso" class="form-label">Prefisso</label>
      <select v-model="user.prefisso" class="form-select" id="prefisso">
        <option value="+39">Italia (+39)</option>
        <option value="+33">Francia (+33)</option>
        <option value="+49">Germania (+49)</option>
        <option value="+44">Regno Unito (+44)</option>
        <option value="+34">Spagna (+34)</option>
        <option value="+31">Paesi Bassi (+31)</option>
        <option value="+41">Svizzera (+41)</option>
      </select>
    </div>
    <div class="mb-3">
      <label for="nr_telefono" class="form-label">Numero di telefono</label>
      <div class="input-group">
        <span class="input-group-text" id="prefisso-addon">{{
          user.prefisso
        }}</span>
        <input
          v-model="user.nr_telefono"
          type="text"
          class="form-control"
          id="nr_telefono"
        />
      </div>
    </div>
    <div class="mb-3">
      <label for="data_nascita" class="form-label"
        >Data di nascita (YYYY-MM-DD)</label
      >
      <input
        v-model="user.data_nascita"
        type="text"
        class="form-control"
        id="data_nascita"
      />
    </div>
    <div class="mb-3">
      <label for="email" class="form-label">Email</label>
      <input
        v-model="user.email"
        type="email"
        class="form-control"
        id="email"
      />
    </div>
    <div class="mb-3">
      <label for="password" class="form-label">Password</label>
      <input
        v-model="user.password"
        type="password"
        class="form-control"
        id="password"
      />
    </div>
    <div class="mb-3">
      <label for="conferma_password" class="form-label"
        >Conferma password</label
      >
      <input
        v-model="user.conferma_password"
        type="password"
        class="form-control"
        id="conferma_password"
      />
    </div>
    <div class="mb-3">
      <label for="ruolo" class="form-label">Ruolo</label>
      <select v-model="user.ruolo" class="form-select" id="ruolo">
        <option value="Proprietario">Proprietario</option>
        <option value="Noleggiatore">Noleggiatore</option>
      </select>
    </div>
    <button class="btn btn-primary" @click="registrazione">Registrati</button>
  </form>
</template>

<script>
import router from "@/router";
import { defineComponent } from "vue";

export default defineComponent({
  name: "RegistrazioneUtente",
  data() {
    return {
      user: {
        nome: "",
        cognome: "",
        nr_telefono: "",
        data_nascita: "",
        email: "",
        password: "",
        conferma_password: "",
        ruolo: "", // Imposta il ruolo di default
      },
      error: {
        status: false,
        message: "default error message",
      },
    };
  },
  methods: {
    async registrazione(event) {
      event.preventDefault();
      if (this.user.password !== this.user.conferma_password) {
        this.error.status = true;
        this.error.message = "Le password inserite non coincidono!";
        return;
      }

      const opzioniRichiesta = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(this.user),
      };

      try {
        const res = await fetch(
          `${process.env.VUE_APP_SERVER_API_URL}/api/${process.env.VUE_APP_API_VERSION}/auth/registraUtente`,
          opzioniRichiesta
        );
        const data = await res.json();

        if (data.success) {
          router.push({ name: "Login" });
        } else {
          this.error.status = true;
          this.error.message =
            data?.error || data?.message || "Unexpected error";
        }
      } catch (error) {
        this.error.status = true;
        this.error.message = error.message || "Failed to fetch";
      }
    },
  },
});
</script>

<style scoped>
/* Aggiungi stili personalizzati se necessario */
</style>
