<template>
    <line-chart
        v-if="threadsChartData.datasets.length"
        id="threads-Chart"
        ref="threadsChart"
        :styles="isMiniChart ? { height: '70px' } : null"
        :chartData="threadsChartData"
        :options="options"
        :isRealTime="true"
        :yAxesTicks="{ max: 100, min: 0 }"
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

                plugins: {
                    streaming: {
                        duration: 20000,
                        refresh: 1000, // onRefresh callback will be called every 5000 ms
                        // delay of 5000 ms, so upcoming values are known before plotting a line
                        delay: 5000,
                        onRefresh: this.updatingThreads,
                    },
                },
            },
        }
    },
    computed: {
        ...mapGetters('maxscale', ['threadsChartData', 'threads']),
    },

    async created() {
        await this.fetchThreads()
        await this.genDataSetSchema()
    },
    beforeDestroy() {
        let chart = this.$refs.threadsChart.$data._chart
        chart.data.labels = []
        chart.data.datasets = []
        chart.destroy()
    },
    methods: {
        ...mapActions('maxscale', ['fetchThreads', 'genDataSetSchema']),
        updatingThreads(chart) {
            this.fetchThreads()
            this.threads.forEach((thread, i) => {
                chart.data.datasets[i].data.push({
                    x: Date.now(),
                    y: thread.attributes.stats.load.last_second,
                })
            })
            chart.update({
                preservation: true,
            })
        },
    },
}
</script>
