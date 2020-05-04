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
        maxScaleOverviewInfo: {},
        allModules: [],
        threads: [],
        threadsChartData: {
            datasets: [],
        },
    },
    mutations: {
        /**
         * @param {Object} payload setMaxScaleOverviewInfo array
         */
        setMaxScaleOverviewInfo(state, payload) {
            state.maxScaleOverviewInfo = payload
        },
        setAllModules(state, payload) {
            state.allModules = payload
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
        async fetchMaxScaleOverviewInfo({ commit }) {
            let res = await Vue.axios.get(
                `/maxscale?fields[maxscale]=version,commit,started_at,activated_at,uptime`
            )
            await commit('setMaxScaleOverviewInfo', res.data.data.attributes)
        },
        async fetchAllModules({ commit }) {
            let res = await Vue.axios.get(`/maxscale/modules`)
            await commit('setAllModules', res.data.data)
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
                        backgroundColor: strReplaceAt(lineColors[i], indexOfOpacity, '0.1'),
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
        maxScaleOverviewInfo: state => state.maxScaleOverviewInfo,
        allModules: state => state.allModules,
        threadsChartData: state => state.threadsChartData,
        threads: state => state.threads,
    },
}
