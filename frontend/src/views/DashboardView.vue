<template>
  <div class="dashboard-view">
    <div class="welcome-header">
      <h1>Benvenuto in Boatify</h1>
      <div class="text-center mb-4">
        <img src="../assets/logo.png" alt="Logo BOATIFY" class="mt-4" />
      </div>
      <MenuBar />
    </div>
  </div>
</template>

<script>
import MenuBar from "@/components/MenuBar.vue";

export default {
  name: "DashboardView",
  components: {
    MenuBar,
  },
};
</script>

<style scoped>
.dashboard-view {
  background-color: #87ceeb;
  padding: 20px;
  height: 100vh;
}

.welcome-header {
  text-align: center;
  margin-bottom: 20px;
  color: white;
}

.text-center {
  margin-bottom: 8px;
  /* Regola il margine inferiore */
}

/* Rimuovi la regola di .welcome-text */
</style>
