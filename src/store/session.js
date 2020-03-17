import Vue from 'vue'

export default {
    state: {
        sessions: [],
    },
    mutations: {
        /**
         * @param {Array} payload  // Array of sessions resources
         */
        setSessions(state, payload) {
            state.sessions = payload
        },
    },
    actions: {
        async fetchAllSessions({ commit }) {
            let res = await Vue.axios.get(`/v1/sessions`)
            await commit('setSessions', res.data.data)
        },
    },
    getters: {
        sessions: state => state.sessions,
    },
}
