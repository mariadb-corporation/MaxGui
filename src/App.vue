<template>
  <v-app>
    <sidebar v-if="user.isLoggedIn" />
    <v-content id="page-wrap">
      <router-view></router-view>
    </v-content>
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
  },
  async created() {
    if (localStorage.getItem("isUserLogin") !== null) {
      // testing
      this.$store.commit({
        type: "setUser",
        name: "admin"
      });
    }
  }
};
</script>

<style lang="scss">
@import "styles/main";
</style>
