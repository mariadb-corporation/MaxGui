<template>
    <line-chart
        ref="threadsChart"
        :styles="{ height: '70px', position: 'relative' }"
        :chartData="chartdata"
        :options="options"
    />
</template>

<script>
import LineChart from 'components/LineChart.vue'
import { mapGetters, mapState, mapMutations, mapActions } from 'vuex'

export default {
    name: 'mini-threads-chart-container',
    components: {
        'line-chart': LineChart,
    },

    data() {
        return {
            options: {
                showLines: true,
                legend: {
                    display: false,
                },
                layout: {
                    padding: {
                        left: 0,
                        right: 0,
                        top: 0,
                        bottom: 0,
                    },
                },
                responsive: true,
                maintainAspectRatio: false,
                elements: {
                    point: {
                        radius: 0,
                    },
                },
                tooltips: {
                    mode: 'nearest',
                    intersect: false,
                },
                hover: {
                    mode: 'nearest',
                    intersect: false,
                },
                scales: {
                    xAxes: [
                        {
                            display: true,
                            ticks: {
                                fontSize: 10,
                                fontColor: '#424F62',
                                fontFamily: "'azo-sans-web', adrianna, serif",
                            },
                            type: 'realtime',
                            realtime: {
                                onRefresh: function(chart) {
                                    chart.data.datasets.forEach(function(dataset) {
                                        dataset.data.push({
                                            x: Date.now(),
                                            y: Math.round(Math.random() * 100),
                                        })
                                    })
                                },

                                duration: 20000,
                                refresh: 1000,
                                delay: 2000,
                            },
                        },
                    ],
                    yAxes: [
                        {
                            display: true,
                            ticks: {
                                maxTicksLimit: 3,
                                fontSize: 10,
                                fontFamily: "'azo-sans-web', adrianna, serif",
                                fontColor: '#424F62',
                                max: 100,
                                min: 0,
                                padding: 5,
                            },
                        },
                    ],
                },
            },
        }
    },
    computed: {
        ...mapGetters(['chartdata', 'updateCount']),
    },

    watch: {
        /*
        Update chartData by adding new data whenever updateCount's value changes
        this prevents parent component rerender
         */
        updateCount: function(newVal, oldVal) {
            /*
            Check Docs for syntax to access chartjs instance
            https://vue-chartjs.org/api/#renderchart and
            https://www.chartjs.org/docs/latest/developers/updates.html
            */
            // let chart = this.$refs.threadsChart.$data._chart
            // const timestamp = new Date().toLocaleTimeString([], {
            //     hour: '2-digit',
            //     minute: '2-digit',
            //     second: '2-digit',
            //     hour12: false,
            // })
            // chart.data.labels.push(timestamp)
            // chart.data.datasets.forEach((dataset, i) => {
            //     dataset.data.push(Math.floor(Math.random() * 100))
            // })
            // // remove item in data when updateCount's value is more than 4
            // if (newVal > 4) {
            //     chart.data.labels.shift()
            //     chart.data.datasets.forEach(dataset => {
            //         dataset.data.shift()
            //     })
            // }
            // chart.update()
        },
    },
    beforeDestroy() {
        let chart = this.$refs.threadsChart.$data._chart
        chart.data.labels = []
        chart.data.datasets = []
        chart.destroy()
        this.clearThreadsState()
    },
    methods: {
        ...mapMutations(['clearThreadsState']),
    },
}
</script>
