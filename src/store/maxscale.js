import Vue from 'vue'
import { delay, dynamicColors, strReplaceAt } from 'utils/helpers'

export default {
    state: {
        maxscaleDetails: {},
        isDestroyed: false,
        threads: [],
        updateCount: 1,
        chartdata: {
            labels: [],
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
            state.chartdata = payload
        },
        updateCount(state) {
            state.updateCount += 1
        },
        resetDestroyState(state) {
            state.isDestroyed = false
        },
        clearThreadsState(state) {
            state.isDestroyed = true
            state.chartdata = {
                labels: [],
                datasets: [],
            }
            state.threads = []
            state.updateCount = 1
        },
    },
    actions: {
        async fetchMaxScaleDetails({ commit }) {
            let res = await Vue.axios.get(`/maxscale`)
            await commit('setMaxScaleDetails', res.data.data.attributes)
        },
        // ---------------------------- last two second threads--------------------------
        async fetchThreads({ dispatch, commit, state }) {
            try {
                let res = await Vue.axios.get(`/maxscale/threads`)
                // console.log("state.threads", state.threads.length);
                // console.log("res.data.data", res.data.data.length);
                if (state.threads.length !== res.data.data.length) {
                    //set threads
                    commit('setThreads', res.data.data)
                    //  generate DataSet Schema
                    await dispatch('genDataSetSchema')
                } else {
                    //set threads
                    commit('setThreads', res.data.data)
                    await commit('updateCount')
                }

                // LOOP polling

                // !state.isDestroyed &&
                //     (await delay(2000).then(() => {
                //         return dispatch('fetchThreads')
                //     }))
            } catch (error) {
                !state.isDestroyed &&
                    (await delay(5000).then(() => {
                        return dispatch('fetchThreads')
                    }))
            }
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
                        data: [],
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
        chartdata: state => state.chartdata,
        updateCount: state => state.updateCount,
    },
}
