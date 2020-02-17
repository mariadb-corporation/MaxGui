<template>
  <v-app id="vue-app">
    <div id="app">
      <sidebar v-if="token" />
      <v-content id="page-wrap">
        <appbar />
        <router-view></router-view>
      </v-content>
    </div>
  </v-app>
</template>

<script>
import store from "store";
import Layouts from "layouts";

export default {
  name: "App",
  store,
  components: {
    ...Layouts
  },
  store,
  data() {
    return {
      token: null
    };
  },
  mounted() {
    let credentials = JSON.parse(localStorage.getItem("credentials"));
    this.token = credentials.token;
  }
};
</script>

<style lang="scss">
@import "styles/main";
@import "styles/font.css";
</style>
