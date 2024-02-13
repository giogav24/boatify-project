<template class="container">
  <div class="buttons-container">
    <button class="custom-button" @click="goToPage('/profilo')">Profilo</button>
    <button class="custom-button" @click="goToPage('/impostazioni')">
      Impostazioni
    </button>
    <button class="custom-button" @click="goToPage('/mappe')">Mappe</button>
    <button class="custom-button" @click="goToPage('/meteo-maree')">
      Meteo e Maree
    </button>
    <button class="custom-button" @click="goToPage('/mie-prenotazioni')">
      Le mie prenotazioni
    </button>
  </div>
</template>

<script>
export default {
  methods: {
    goToPage(route) {
      // Implementa la navigazione a pagina qui
      this.$router.push(route);
    },
  },
};
</script>

<style scoped>
.custom-button {
  width: 100%;
  padding: 20px;
  border: none;
  cursor: pointer;
}

.buttons-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  /* Allinea i bottoni all'inizio dell'asse verticale */
  height: 100vh;
  margin-top: 20px;
  /* Aggiungi margine superiore per spostare i bottoni più in alto */
}

.buttons-container button:not(:last-child) {
  margin-bottom: 10px;
}
</style>
