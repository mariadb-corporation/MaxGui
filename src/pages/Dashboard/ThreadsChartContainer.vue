<template>
    <div style="width:80%">
        <line-chart
            ref="threadsChart"
            :chartData="chartdata"
            :options="options"
        />
    </div>
</template>

<script>
import LineChart from "components/LineChart.vue";
import update from "immutability-helper";
import { mapGetters, mapMutations, mapActions } from "vuex";

export default {
    name: "threads-chart-container",
    components: {
        "line-chart": LineChart
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
                            display: true
                        }
                    ],
                    yAxes: [
                        {
                            display: true,
                            ticks: {
                                // beginAtZero: true,
                                max: 100,
                                min: 0
                            }
                        }
                    ]
                }
            }
        };
    },
    methods: {
        ...mapMutations(["clearState"])
    },
    computed: {
        ...mapGetters(["chartdata", "updateCount"])
    },
    // // update chartData
    watch: {
        // add new data every updateCount changes
        updateCount: function(newVal, oldVal) {
            /*Check Docs for syntax to access chartjs instance 
      https://vue-chartjs.org/api/#renderchart and 
      https://www.chartjs.org/docs/latest/developers/updates.html*/
            let chart = this.$refs.threadsChart.$data._chart;
            const timestamp = new Date().toLocaleTimeString();

            chart.data.labels.push(timestamp);
            chart.data.datasets.forEach(dataset => {
                dataset.data.push(Math.floor(Math.random() * 101));
            });
            // remove data when updateCount's value is more than 4
            if (newVal > 4) {
                chart.data.labels.shift();
                chart.data.datasets.forEach(dataset => {
                    dataset.data.shift();
                });
            }
            chart.update();
        }
    },
    beforeDestroy() {
        let chart = this.$refs.threadsChart.$data._chart;
        chart.data.labels = [];
        chart.data.datasets = [];
        chart.destroy();
        this.clearState();
    }
};
</script>
