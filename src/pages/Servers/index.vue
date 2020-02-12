<template>
  <v-container class="server-padding">
    <v-row v-if="serversData" class="p-12 servers-list">
      <v-col
        :md="4"
        :sm="6"
        class="d-sm-flex"
        v-for="item in serversData.data"
        :key="item.id"
      >
        <server-card
          :overline="`Type: ${item.type}`"
          :headline="item.id"
          :link="`URL: ${item.links.self}`"
          icon='<i class="material-icons">dashboard</i>'
          :path="`/server/${item.id}`"
          btnText="click"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";
import ServerCard from "./ServerCard";

export default {
  name: "Servers",
  components: {
    "server-card": ServerCard
  },
  computed: {
    ...mapGetters(["user"])
  },
  data() {
    return {
      serversData: null
    };
  },

  mounted() {
    let credentials = JSON.parse(localStorage.getItem("credentials"));
    this.axios
      .get(`/v1/servers`, {
        auth: credentials
      })
      .then(res => (this.serversData = res.data));
  }
};
</script>

<style lang="scss" scoped>
.server-padding {
  padding-top: 70px;
}
</style>
