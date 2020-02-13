<template>
  <v-container class="server-padding">
    <v-row align="center" justify="center">
      <v-col :lg="6" :md="12" :sm="12">
        <v-row v-if="serversData" class="p-12 servers-list">
          <v-col
            :md="4"
            :sm="12"
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
              btnText="More Info"
            />
          </v-col>
        </v-row>
      </v-col>

      <v-col :lg="6" :md="12" :sm="12" align="center" justify="center">
        <h2 style="text-align:center">Last two second threads</h2>
        <br />
        <ThreadsChartContainer :datasets="datasets" :loaded="loaded" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";
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
      loaded: false,
      datasets: [],
      credentials: JSON.parse(localStorage.getItem("credentials"))
    };
  },
  methods: {
    dynamicColors() {
      let r = Math.floor(Math.random() * 255);
      let g = Math.floor(Math.random() * 255);
      let b = Math.floor(Math.random() * 255);
      return "rgb(" + r + "," + g + "," + b + ")";
    },
    delay(t, v) {
      return new Promise(function(resolve) {
        setTimeout(resolve.bind(null, v), t);
      });
    },
    genDataSet(threads) {
      let arr = [];
      let lineColors = [];
      let pointColors = [];
      for (let i = 0; i < threads.length; i++) {
        lineColors.push(this.dynamicColors(i, threads.length));
        pointColors.push(this.dynamicColors(i, threads.length));
        let obj = {
          type: "line",
          label: `THREAD ID - ${threads[i].id}`,

          backgroundColor: lineColors[i], // background of the line
          borderColor: lineColors[i], //theme.palette.primary.main, // line color

          //   pointBackgroundColor: "rgba(0,0,0,0)",
          //   pointBorderColor: "rgba(0,0,0,0)",
          borderWidth: 2,
          lineTension: 0.25,
          data: [threads[i].value.toString()]
        };
        arr.push(obj);
      }

      return arr;
    },
    async fetchThreads() {
      try {
        let res = await this.axios.get(`/v1/maxscale/threads`, {
          auth: this.credentials
        });
        let { data } = await res.data;
        let threads = await data.reduce((accumulator, _, index, array) => {
          let obj = {
            id: array[index].id,
            value: array[index].attributes.stats.load.last_second
          };
          accumulator.push(obj);
          return accumulator;
        }, []);
        this.loaded = true;

        // testing values
        let valuesTest = [];
        for (let i = 0; i < threads.length; i++) {
          let obj = {
            id: threads[i].id,
            value: Math.floor(Math.random() * 101)
          };
          valuesTest.push(obj);
        }
        this.datasets = this.genDataSet(valuesTest);
      } catch (error) {
        console.log("error", error);
      }

      await this.delay(2000).then(() => {
        return this.fetchThreads();
      });
    }
  },

  async created() {
    this.axios
      .get(`/v1/servers`, {
        auth: this.credentials
      })
      .then(res => (this.serversData = res.data));
    this.fetchThreads();
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
