<template>
  <div style="width:80%">
    <line-chart v-if="loaded" :chartdata="chartdata" :options="options" />
  </div>
</template>

<script>
import LineChart from "components/LineChart.vue";

export default {
  name: "threads-chart-container",
  components: {
    "line-chart": LineChart
  },
  props: {
    loaded: Boolean,
    datasets: Array
  },
  data() {
    return {
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
                maxTicksLimit: 5
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
      chartdata: {
        labels: [],
        datasets: []
      }
    };
  },
  watch: {
    datasets: function(newVal, oldVal) {
      this.chartdata.datasets = newVal;
      for (let i = 0; i < this.datasets.length; i++) {
        this.chartdata.datasets[i].data.push(Math.floor(Math.random() * 101));

        this.chartdata.labels.push(new Date().toLocaleTimeString());
      }
      //   this.renderChart()
    }
  }
};
</script>
