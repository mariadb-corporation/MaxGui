<template>
  <v-app>
    <v-content>
      <!-- <Dashboard/> -->
      <Login />
    </v-content>
  </v-app>
</template>

<script>
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

export default {
  name: "App",

  components: {
    // Dashboard,
    Login
  },

  data: () => ({
    //
  })
};
</script>
