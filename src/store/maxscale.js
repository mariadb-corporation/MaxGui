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
import Vue from 'vue'
import { dynamicColors, strReplaceAt } from 'utils/helpers'

export default {
    namespaced: true,
    state: {
        maxscaleDetails: {},
        threads: [],
        threadsChartData: {
            datasets: [],
        },
    },
    mutations: {
        /**
         * @param {Object} payload setMaxScaleDetails array
         */
        setMaxScaleDetails(state, payload) {
            state.maxscaleDetails = payload
        },
        // ---------------------------- last two second threads--------------------------
        setThreads(state, payload) {
            state.threads = payload
        },
        setThreadsChartData(state, payload) {
            state.threadsChartData = payload
        },
    },
    actions: {
        async fetchMaxScaleDetails({ commit }) {
            let res = await Vue.axios.get(`/maxscale`)
            await commit('setMaxScaleDetails', res.data.data.attributes)
        },
        // ---------------------------- last two second threads--------------------------
        async fetchThreads({ commit }) {
            let res = await Vue.axios.get(`/maxscale/threads?fields[threads]=stats`)
            commit('setThreads', res.data.data)
        },

        genDataSetSchema({ commit, state }) {
            const { threads } = state
            if (threads) {
                let arr = []
                let lineColors = []
                //threads.length
                for (let i = 0; i < threads.length; ++i) {
                    lineColors.push(dynamicColors(i))
                    let indexOfOpacity = lineColors[i].lastIndexOf(')') - 1
                    let obj = {
                        label: `THREAD ID - ${threads[i].id}`,
                        id: `THREAD ID - ${threads[i].id}`,
                        type: 'line',
                        // background of the line
                        backgroundColor: strReplaceAt(lineColors[i], indexOfOpacity, '0.2'),
                        borderColor: lineColors[i], //theme.palette.primary.main, // line color
                        borderWidth: 1,
                        lineTension: 0,
                        data: [{ x: Date.now(), y: threads[i].attributes.stats.load.last_second }],
                    }
                    arr.push(obj)
                }
                let threadsChartDataSchema = {
                    datasets: arr,
                }
                commit('setThreadsChartData', threadsChartDataSchema)
            }
        },
    },
    getters: {
        maxscaleDetails: state => state.maxscaleDetails,
        threadsChartData: state => state.threadsChartData,
        threads: state => state.threads,
    },
}
