<template>
    <line-chart
        v-if="sessionsChartData.datasets.length"
        id="sessions-Chart"
        ref="sessionsChart"
        :styles="{ height: '85px' }"
        :chartData="sessionsChartData"
        :options="options"
    />
</template>

<script>
/*
 * Copyright (c) 2020 MariaDB Corporation Ab
 *
 * Use of this software is governed by the Business Source License included
 * in the LICENSE.TXT file and at www.mariadb.com/bsl11.
 *
 * Change Date: 2024-07-01
 *
 * On the date above, in accordance with the Business Source License, use
 * of this software will be governed by version 2 or later of the General
 * Public License.
 */
import LineChart from 'components/LineChart.vue'
import { mapGetters, mapState, mapMutations, mapActions } from 'vuex'

export default {
    name: 'sessions-chart',
    components: {
        'line-chart': LineChart,
    },
    data() {
        return {
            options: {
                legend: {
                    display: false,
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
                                // delay of 1000 ms, so upcoming values are known before plotting a line
                                delay: 5000,
                            },
                        },
                    ],
                    yAxes: [
                        {
                            ticks: {
                                maxTicksLimit: 3,
                            },
                        },
                    ],
                },
                plugins: {
                    streaming: {
                        onRefresh: this.updatingChart,
                    },
                },
            },
        }
    },
    computed: {
        ...mapGetters(['sessionsChartData', 'sessions']),
    },
    created() {
        this.fetchAllSessions()
        this.genDataSetSchema()
    },

    beforeDestroy() {
        let chart = this.$refs.sessionsChart.$data._chart
        chart.data.labels = []
        chart.data.datasets = []
        chart.destroy()
    },
    methods: {
        ...mapActions(['fetchAllSessions', 'genDataSetSchema']),
        updatingChart(chart) {
            //  LOOP polling
            this.fetchAllSessions()
            let self = this
            chart.data.datasets.forEach(function(dataset) {
                dataset.data.push({
                    x: Date.now(),
                    y: Math.round(Math.random() * 100), //self.sessions.length,
                })
            })
            chart.update({
                preservation: true,
            })
        },
    },
}
</script>
