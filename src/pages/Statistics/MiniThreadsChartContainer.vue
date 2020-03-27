<template>
    <line-chart
        ref="threadsChart"
        :styles="{ height: '85px', overflow: 'visible' }"
        :chartData="threadsChartData"
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

    props: {
        onRefresh: Function,
    },

    data() {
        return {
            options: {
                plugins: {
                    streaming: {
                        onRefresh: this.onRefresh,
                    },
                },
            },
        }
    },
    computed: {
        ...mapGetters(['threadsChartData', 'updateCount']),
    },

    watch: {
        /*
        Update threadsChartData by adding new data whenever updateCount's value changes
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
