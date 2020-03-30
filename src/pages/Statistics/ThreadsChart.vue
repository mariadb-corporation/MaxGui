<template>
    <line-chart
        v-if="threadsChartData.datasets.length"
        id="threads-Chart"
        ref="threadsChart"
        :styles="isMiniChart ? { height: '85px' } : null"
        :chartData="threadsChartData"
        :options="options"
    />
</template>

<script>
import LineChart from 'components/LineChart.vue'
import { mapGetters, mapState, mapMutations, mapActions } from 'vuex'

export default {
    name: 'threads-chart',
    components: {
        'line-chart': LineChart,
    },
    props: {
        isMiniChart: Boolean,
    },
    data() {
        return {
            options: {
                legend: {
                    display: this.isMiniChart ? false : true,
                },
                scales: {
                    xAxes: [
                        {
                            type: 'realtime',
                            time: {
                                displayFormats: {
                                    second: 'HH:mm:ss',
                                },
                            },
                            realtime: {
                                duration: 20000,
                                refresh: 5000, // onRefresh callback will be called every 5000 ms
                                // delay of 5000 ms, so upcoming values are known before plotting a line
                                delay: 5000,
                            },
                        },
                    ],
                    yAxes: [
                        {
                            ticks: {
                                max: 100,
                                min: 0,
                            },
                        },
                    ],
                },
                plugins: {
                    streaming: {
                        onRefresh: this.updatingThreads,
                    },
                },
            },
        }
    },
    computed: {
        ...mapGetters(['threadsChartData', 'threads']),
    },

    async created() {
        await this.fetchThreads()
        //  generate DataSet Schema
        await this.genDataSetSchema()
    },
    beforeDestroy() {
        let chart = this.$refs.threadsChart.$data._chart
        chart.data.labels = []
        chart.data.datasets = []
        chart.destroy()
    },
    methods: {
        ...mapActions(['fetchThreads', 'genDataSetSchema']),
        updatingThreads(chart) {
            // this.threads.forEach(thread => console.log(thread.attributes.stats.load.last_second))
            this.fetchThreads()
            chart.data.datasets.forEach(function(dataset) {
                dataset.data.push({
                    x: Date.now(),
                    y: Math.round(Math.random() * 100),
                })
            })
            chart.update()
        },
    },
}
</script>
