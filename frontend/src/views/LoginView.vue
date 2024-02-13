<template>
  <div>
    <NavBar />
    <LoginForm />
  </div>
</template>

<script>
// @ is an alias to /src
import NavBar from "@/components/NavBar.vue";
import LoginForm from "@/components/Login.vue";

export default {
  name: "LoginView",
  components: {
    NavBar,
    LoginForm,
  },
};
</script>
