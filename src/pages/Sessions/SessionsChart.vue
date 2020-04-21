<template>
    <line-chart
        v-if="sessionsChartData.datasets.length"
        id="sessions-Chart"
        ref="sessionsChart"
        :styles="{ height: '70px' }"
        :chartData="sessionsChartData"
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
import { mapActions } from 'vuex'

export default {
    name: 'sessions-chart',
    components: {
        'line-chart': LineChart,
    },
    props: {
        allSessions: { type: Array, required: true },
        sessionsChartData: { type: Object, required: true },
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
    watch: {
        allSessions: function(newVal, oldVal) {
            newVal !== oldVal && this.genDataSetSchema()
        },
    },

    beforeDestroy() {
        let chart = this.$refs.sessionsChart.$data._chart
        chart.data.labels = []
        chart.data.datasets = []
        chart.destroy()
    },
    methods: {
        ...mapActions('session', ['fetchAllSessions', 'genDataSetSchema']),
        updatingChart(chart) {
            //  LOOP polling
            this.fetchAllSessions()
            let self = this
            chart.data.datasets.forEach(function(dataset) {
                dataset.data.push({
                    x: Date.now(),
                    y: self.allSessions.length, //,Math.round(Math.random() * 100),
                })
            })
            chart.update({
                preservation: true,
            })
        },
    },
}
</script>
