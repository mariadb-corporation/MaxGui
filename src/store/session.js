import Vue from 'vue'
import { dynamicColors, strReplaceAt } from 'utils/helpers'

export default {
    state: {
        sessions: [],
        sessionsChartData: {
            datasets: [],
        },
    },
    mutations: {
        /**
         * @param {Array} payload  // Array of sessions resources
         */
        setSessions(state, payload) {
            state.sessions = payload
        },
        setSessionsChartData(state, payload) {
            state.sessionsChartData = payload
        },
    },
    actions: {
        async fetchAllSessions({ commit }) {
            let res = await Vue.axios.get(`/sessions`)
            await commit('setSessions', res.data.data)
        },
        genDataSetSchema({ commit, state }) {
            const { sessions } = state
            if (sessions) {
                let lineColors = dynamicColors(0)

                let indexOfOpacity = lineColors.lastIndexOf(')') - 1
                let dataset = [
                    {
                        label: `Total sessions`,
                        type: 'line',
                        // background of the line
                        backgroundColor: strReplaceAt(lineColors, indexOfOpacity, '0.2'),
                        borderColor: lineColors, //theme.palette.primary.main, // line color
                        borderWidth: 1,
                        lineTension: 0,
                        //sessions.length
                        data: [{ x: Date.now(), y: Math.round(Math.random() * 100) }],
                    },
                ]

                let sessionsChartDataSchema = {
                    datasets: dataset,
                }
                commit('setSessionsChartData', sessionsChartDataSchema)
            }
        },
    },
    getters: {
        sessions: state => state.sessions,
        sessionsChartData: state => state.sessionsChartData,
    },
}
