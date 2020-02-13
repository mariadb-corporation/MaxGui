<template>
  <fragment>
    <v-app-bar dense max-height="48px" color="primary"> </v-app-bar>
    <v-breadcrumbs :items="items" large></v-breadcrumbs>
  </fragment>
</template>

<script>
import { Fragment } from "vue-fragment";

export default {
  components: { Fragment },
  created: function() {
    this.generateBreadcrumbs();
  },

  watch: {
    $route: "generateBreadcrumbs"
  },
  methods: {
    generateBreadcrumbs() {
      let pathNames = this.$router.currentRoute.fullPath
        .split("/")
        .filter(x => x);
      let items = [];
      for (let i = 0; i < pathNames.length; i++) {
        const last = i === pathNames.length - 1;
        const toPath = `/${pathNames.slice(0, i + 1).join("/")}`;
        let item = {
          text: pathNames[i].toUpperCase(),
          href: toPath,
          disabled: false
        };
        items.push(item);
        this.items = items;
      }
    }
  },
  data() {
    return {
      items: []
    };
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.generateBreadcrumbs();
    });
  }
};
</script>

<style lang="scss" scoped></style>
