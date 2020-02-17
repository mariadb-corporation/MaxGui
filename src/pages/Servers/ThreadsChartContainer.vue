<template>
  <div style="width:80%">
    <line-chart :chartData="chartdata" :options="options" />
  </div>
</template>

<script>
import LineChart from "components/LineChart.vue";
import update from "immutability-helper";
import { mapGetters, mapActions } from "vuex";

export default {
  name: "threads-chart-container",
  components: {
    "line-chart": LineChart
  },
  data() {
    return {
      credentials: JSON.parse(localStorage.getItem("credentials")),
      options: {
        showLines: true,
        responsive: true,
        animation: {
          duration: 250 * 1.5,
          easing: "linear"
        },
        maintainAspectRatio: false,
        tooltips: {
          enabled: true
        },
        scales: {
          xAxes: [
            {
              display: true,
              ticks: {
                autoSkip: true,
                maxTicksLimit: 15
              }
            }
          ],
          yAxes: [
            {
              display: true,
              ticks: {
                max: 100,
                min: 0
              }
            }
          ]
        }
      },
      threads: null,
      chartdata: {
        labels: [],
        datasets: []
      }
    };
  },
  methods: {
    genDataSet() {
      if (this.threads) {
        let arr = [];
        let lineColors = [];
        let pointColors = [];
        for (let i = 0; i < /*this.threads.length*/ 3; i++) {
          lineColors.push(
            this.$help.dynamicColors(i, /*this.threads.length*/ 3)
          );
          pointColors.push(
            this.$help.dynamicColors(i, /*this.threads.length*/ 3)
          );
          let obj = {
            id: `THREAD ID - ${this.threads[i].id}`,
            type: "line",
            label: `THREAD ID - ${this.threads[i].id}`,
            backgroundColor: "rgba(0,0,0,0)", // background of the line
            borderColor: lineColors[i], //theme.palette.primary.main, // line color
            borderWidth: 2,
            lineTension: 0.25,
            data: [Math.floor(Math.random() * 100)]
          };
          arr.push(obj);
        }
        return (this.chartdata = update(this.chartdata, {
          datasets: {
            $set: arr
          },
          labels: { $push: [new Date().toLocaleTimeString()] }
        }));
      }
    },
    delay(t, v) {
      return new Promise(function(resolve) {
        setTimeout(resolve.bind(null, v), t);
      });
    },
    async fetchThreadsAsync() {
      try {
        let res = await this.axios.get(`/v1/maxscale/threads`, {
          auth: this.credentials
        });
        this.threads = res.data.data;
        // only generate DataSet one
        if (this.chartdata.datasets.length === 0) {
          this.genDataSet();
        } else {
          // else push new data to datasets
          const timestamp = new Date().toLocaleTimeString();
          for (let i = 0; i < /*this.threads.length*/ 3; i++) {
            this.chartdata = update(this.chartdata, {
              datasets: {
                [i]: { data: { $push: [Math.floor(Math.random() * 101)] } }
              }
            });
          }
          this.chartdata = update(this.chartdata, {
            labels: {
              $push: [timestamp]
            }
          });
        }
        await this.delay(2000).then(() => this.fetchThreadsAsync());
      } catch (error) {
        console.log("error", error);
        this.delay(5000).then(() => this.fetchThreadsAsync());
      }
    }
  },

  async mounted() {
    this.fetchThreadsAsync();
  },
  // // update chartData
  watch: {
    chartdata: function(newVal, oldVal) {
      console.log("newVal", newVal);

      // this.$data._chart.update();
    }
  }
};
</script>
