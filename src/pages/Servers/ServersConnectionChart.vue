<template>
    <line-chart
        v-if="serversConnectionsChartData.datasets.length"
        id="servers-connection-Chart"
        ref="serversConnectionChart"
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
                        frameRate: 30,
                        duration: 10000,
                        ttl: 20000,
                        refresh: 10000, // onRefresh callback will be called every 10000 ms
                        /* delay of 10000 ms, so upcoming values are known before plotting a line
                      delay value can be larger but not smaller than refresh value to remain realtime streaming data */
                        delay: 10000,
                        onRefresh: this.updatingChart,
                    },
                },
            },
            key: 0,
        }
    },

    async created() {
        await this.generateDataSetSchema()
    },

    beforeDestroy() {
        let chart = this.$refs.serversConnectionChart.$data._chart
        chart.data.labels = []
        chart.data.datasets = []
        chart.destroy()
    },
    methods: {
        ...mapActions('server', ['fetchAllServers', 'genDataSetSchema']),
        async generateDataSetSchema() {
            await this.genDataSetSchema()
        },
        async updatingChart(chart) {
            let self = this
            //  LOOP polling
            await self.fetchAllServers()
            const time = Date.now()
            let gap = self.allServers.length - chart.data.datasets.length

            self.allServers.forEach((server, i) => {
                if (gap > 0 && i > chart.data.datasets.length - 1) {
                    let lineColors = self.$help.dynamicColors(i)
                    let indexOfOpacity = lineColors.lastIndexOf(')') - 1
                    let dataset = {
                        label: `Server ID - ${server.id}`,
                        id: `Server ID - ${server.id}`,
                        type: 'line',
                        // background of the line
                        backgroundColor: self.$help.strReplaceAt(lineColors, indexOfOpacity, '0.2'),
                        borderColor: lineColors, //theme.palette.primary.main, // line color
                        borderWidth: 1,
                        lineTension: 0,
                        data: [
                            {
                                x: time,
                                y: server.attributes.statistics.connections,
                            },
                        ],
                    }

                    chart.data.datasets.push(dataset)
                } else {
                    chart.data.datasets[i].data.push({
                        x: time,
                        y: server.attributes.statistics.connections,
                    })
                }
                chart.update({
                    preservation: true,
                })
            })
        },
    },
}
</script>
