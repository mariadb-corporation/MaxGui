import Vue from 'vue'
import { delay, dynamicColors, strReplaceAt } from 'utils/helpers'

export default {
    state: {
        maxscaleDetails: {},
        isDestroyed: false,
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
        async fetchThreads({ dispatch, commit }) {
            let res = await Vue.axios.get(`/maxscale/threads`)
            commit('setThreads', res.data.data)
            //  generate DataSet Schema
            await dispatch('genDataSetSchema')
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
                        data: [{ x: Date.now(), y: Math.round(Math.random() * 100) }],
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
    },
}
