<template>
    <div style="width:100%">
        <line-chart ref="threadsChart" :chartData="chartdata" :options="options" />
    </div>
</template>

<script>
import LineChart from 'components/LineChart.vue'
import { mapGetters, mapState, mapMutations, mapActions } from 'vuex'

export default {
    name: 'threads-chart-container',
    components: {
        'line-chart': LineChart,
    },

    data() {
        return {
            options: {
                showLines: true,
                responsive: true,
                // animation: {
                //     duration: 250 * 1.5,
                //     easing: "linear"
                // },
                maintainAspectRatio: false,
                tooltips: {
                    enabled: true,
                },
                scales: {
                    xAxes: [
                        {
                            display: true,
                        },
                    ],
                    yAxes: [
                        {
                            display: true,
                            ticks: {
                                max: 100,
                                min: 0,
                            },
                        },
                    ],
                },
            },
        }
    },
    computed: {
        ...mapGetters(['chartdata', 'updateCount']),
        ...mapState(['darkTheme']),
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
            let chart = this.$refs.threadsChart.$data._chart
            const timestamp = new Date().toLocaleTimeString()

            chart.data.labels.push(timestamp)
            chart.data.datasets.forEach(dataset => {
                dataset.data.push(Math.floor(Math.random() * 101))
            })
            // remove item in data when updateCount's value is more than 4
            if (newVal > 7) {
                chart.data.labels.shift()
                chart.data.datasets.forEach(dataset => {
                    dataset.data.shift()
                })
            }
            chart.update()
        },
    },
    beforeDestroy() {
        let chart = this.$refs.threadsChart.$data._chart
        chart.data.labels = []
        chart.data.datasets = []
        chart.destroy()
        this.clearState()
    },
    methods: {
        ...mapMutations(['clearState']),
    },
}
</script>
