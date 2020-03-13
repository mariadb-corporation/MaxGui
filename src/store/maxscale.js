import Vue from 'vue'

export default {
    state: {
        maxscaleDetails: {},
    },
    mutations: {
        /**
         * @param {Object} payload setMaxScaleDetails array
         */
        setMaxScaleDetails(state, payload) {
            state.maxscaleDetails = payload
        },
    },
    actions: {
        async fetchMaxScaleDetails({ commit, state }) {
            let res = await Vue.axios.get(`/v1/maxscale`)
            await commit('setMaxScaleDetails', res.data.data.attributes)
        },
    },
    getters: {
        maxscaleDetails: state => state.maxscaleDetails,
    },
}
