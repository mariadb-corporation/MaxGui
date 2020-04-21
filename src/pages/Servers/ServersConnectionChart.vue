<template>
    <line-chart
        v-if="serversConnectionsChartData.datasets.length"
        id="users-Chart"
        ref="usersChart"
        :styles="{ height: '70px' }"
        :chartData="serversConnectionsChartData"
        :options="options"
        :isRealTime="true"
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
    name: 'servers-connection-chart',
    components: {
        'line-chart': LineChart,
    },
    props: {
        allServers: { type: Array, required: true },
        serversConnectionsChartData: { type: Object, required: true },
    },

    data() {
        return {
            options: {
                plugins: {
                    streaming: {
                        duration: 20000,
                        refresh: 10000, // onRefresh callback will be called every 10000 ms
                        /* delay of 10000 ms, so upcoming values are known before plotting a line
                      delay value can be larger but not smaller than refresh value to remain realtime streaming data */
                        delay: 10000,
                        onRefresh: this.updatingChart,
                    },
                },
            },
        }
    },

    async created() {
        await this.genDataSetSchema()
    },

    beforeDestroy() {
        let chart = this.$refs.usersChart.$data._chart
        chart.data.labels = []
        chart.data.datasets = []
        chart.destroy()
    },
    methods: {
        ...mapActions('server', ['fetchAllServers', 'genDataSetSchema']),
        async updatingChart(chart) {
            //  LOOP polling
            await this.fetchAllServers()
            let self = this
            this.allServers.forEach((server, i) => {
                chart.data.datasets[i].data.push({
                    x: Date.now(),
                    y: server.attributes.statistics.connections,
                })
            })

            chart.update({
                preservation: true,
            })
        },
    },
}
</script>
