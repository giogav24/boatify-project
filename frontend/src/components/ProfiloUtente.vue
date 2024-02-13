<template>
  <div class="profilo-container">
    <h1>Dati Utente</h1>
    <div v-if="loading">Caricamento...</div>
    <div v-else>
      <div><strong>Nome:</strong> {{ datiUtente.nome }}</div>
      <div><strong>Cognome:</strong> {{ datiUtente.cognome }}</div>
      <div><strong>Email:</strong> {{ datiUtente.email }}</div>
      <div><strong>Ruolo:</strong> {{ datiUtente.ruolo }}</div>
      <div>
        <strong>Numero di Telefono:</strong> {{ datiUtente.numero_di_telefono }}
      </div>
      <div>
        <strong>Patenti:</strong>
        <ul>
          <li v-for="patente in datiUtente.patenti" :key="patente._id">
            {{ patente.tipo }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import store from "@/store/index";

export default {
  data() {
    return {
      loading: true,
      datiUtente: {},
    };
  },
  async mounted() {
    if (store.state.token) {
      await this.getDatiUtente();
    }
  },
  methods: {
    async getDatiUtente() {
      try {
        const response = await fetch(
          `${process.env.VUE_APP_SERVER_API_URL}/api/${process.env.VUE_APP_API_VERSION}/auth/getDatiUtente`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${store.getters.getToken}`, // Aggiungi il token alle intestazioni
            },
            body: JSON.stringify({ email: store.getters.getEmail }),
          }
        );

        const data = await response.json();

        if (data.success) {
          this.datiUtente = data.datiUtente;
        } else {
          console.error(
            "Errore nel recupero dei dati dell'utente:",
            data.message
          );
        }
      } catch (error) {
        console.error(
          "Errore nel recupero dei dati dell'utente:",
          error.message
        );
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
/* Aggiungi stili se necessario */
</style>
