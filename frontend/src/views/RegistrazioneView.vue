<template>
  <div>
    <NavBar />
    <LoginView />
  </div>
</template>

<script>
// @ is an alias to /src
import LoginView from "@/components/Registrazione.vue";
import NavBar from "@/components/NavBar.vue";

export default {
  name: "RegistrazioneView",
  components: {
    NavBar,
    LoginView,
  },
};
</script>
