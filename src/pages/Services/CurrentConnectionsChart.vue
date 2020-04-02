<template>
    <line-chart
        v-if="totalConnectionsChartData.datasets.length"
        id="total-connections-chart"
        ref="totalConnectionsChart"
        :styles="{ height: '70px' }"
        :chartData="totalConnectionsChartData"
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
    name: 'current-connections-chart',
    components: {
        'line-chart': LineChart,
    },
    props: {
        updatingChart: Function,
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
        ...mapGetters('service', ['totalConnectionsChartData', 'currentService']),
    },
    created() {
        this.genDataSetSchema()
    },

    beforeDestroy() {
        let chart = this.$refs.totalConnectionsChart.$data._chart
        chart.data.labels = []
        chart.data.datasets = []
        chart.destroy()
    },
    methods: {
        ...mapActions('service', ['genDataSetSchema']),
    },
}
</script>
