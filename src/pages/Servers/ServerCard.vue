<template>
  <v-card width="100%" outlined>
    <v-list-item three-line>
      <v-list-item-content>
        <div class="overline mb-4">{{ overline }}</div>
        <v-list-item-title class="headline mb-1">
          {{ headline }}
        </v-list-item-title>
        <v-list-item-subtitle>{{ link }}</v-list-item-subtitle>
      </v-list-item-content>

      <v-icon>{{ mdiToolbox }}</v-icon>
    </v-list-item>

    <v-card-actions
      ><router-link :to="path">
        <v-btn dark color="primary" depressed>{{ btnText }} </v-btn>
      </router-link>
    </v-card-actions>
  </v-card>
</template>

<script>
import { mdiViewDashboard, mdiToolbox } from "@mdi/js";

export default {
  name: "server-card",
  props: {
    overline: String,
    headline: String,
    link: String,
    icon: String,
    path: String,
    btnText: String
  },
  data() {
    return {
      mdiToolbox: mdiToolbox
    };
  }
};
</script>

<style lang="scss" scoped></style>
