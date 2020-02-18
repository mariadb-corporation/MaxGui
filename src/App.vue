<template>
  <v-app id="vue-app">
    <div id="app">
      <sidebar />
      <v-content id="page-wrap">
        <appbar v-if="user.token" />
        <router-view>

        </router-view>
      </v-content>
    </div>
  </v-app>
</template>

<script>
import store from "store";
import Layouts from "layouts";
import { mapGetters } from "vuex";

export default {
  name: "App",
  store,
  components: {
    ...Layouts
  },
  store,
  computed: {
    ...mapGetters(["user"])
  }
};
</script>

<style lang="scss">
@import "styles/main";
@import "styles/font.css";
</style>
