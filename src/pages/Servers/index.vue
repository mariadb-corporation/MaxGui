<template>
  <v-container class="server-padding">
    <v-row align="center" justify="center">
      <v-col :lg="6" :md="12" :sm="12">
        <v-row v-if="serversData" class="p-12 servers-list">
          <v-col
            :md="6"
            :lg="6"
            :sm="12"
            v-for="item in serversData.data"
            :key="item.id"
          >
            <server-card
              :overline="`Type: ${item.type}`"
              :headline="item.id"
              :link="`URL: ${item.links.self}`"
              icon='<i class="material-icons">dashboard</i>'
              :path="`/server/${item.id}`"
              btnText="More Info"
            />
          </v-col>
        </v-row>
      </v-col>

      <v-col :lg="6" :md="12" :sm="12" align="center" justify="center">
        <h2 style="text-align:center">Last two second threads</h2>
        <br />
        <ThreadsChartContainer />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import ServerCard from "./ServerCard";
// import MetricGraph from "components/MetricGraph";
import ThreadsChartContainer from "./ThreadsChartContainer";

export default {
  name: "Servers",
  components: {
    "server-card": ServerCard,
    ThreadsChartContainer
    // "metric-graph": MetricGraph
  },
  computed: {
    ...mapGetters(["user"])
  },
  data() {
    return {
      serversData: null,
      credentials: JSON.parse(localStorage.getItem("credentials"))
    };
  },

  mounted() {
    this.axios
      .get(`/v1/servers`, {
        auth: this.credentials
      })
      .then(res => (this.serversData = res.data));
  }
};
</script>

<style lang="scss" scoped>
.server-padding {
  padding-top: 70px;
}
.servers-list {
  margin-bottom: 60px;
}
</style>
