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
  data() {
    return {
      items: [
        {
          text: "Dashboard",
          disabled: false,
          href: "breadcrumbs_dashboard"
        },
        {
          text: "Link 1",
          disabled: false,
          href: "breadcrumbs_link_1"
        },
        {
          text: "Link 2",
          disabled: true,
          href: "breadcrumbs_link_2"
        }
      ]
    };
  }
};
</script>

<style lang="scss" scoped></style>
