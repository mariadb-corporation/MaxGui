import Vue from 'vue'

export default {
    state: {
        filters: [],
    },
    mutations: {
        /**
         * @param {Array} payload  // Array of filter resources
         */
        setFilters(state, payload) {
            state.filters = payload
        },
    },
    actions: {
        async fetchAllFilters({ commit }) {
            let res = await Vue.axios.get(`/filters`)
            await commit('setFilters', res.data.data)
        },

        /**
         * @param {Object} object Object payload for creating filter
         * @param {String} object.id Name of the filter
         * @param {String} object.module The filter uses the qlafilter module
         * @param {Object} object.parameters Filter parameters
         */
        async createFilter({ dispatch, commit }, object) {
            let res = await Vue.axios.post(`/filters`, {
                data: {
                    id: object.id,
                    type: 'filters',
                    attributes: {
                        module: object.module,
                        parameters: object.parameters,
                    },
                },
            })
            if (res.status === 204) {
                await dispatch('fetchAllFilters')
                await commit('showMessage', {
                    text: [`Filter ${object.id} is created`],
                    type: 'success',
                })
            }
        },
        /**
         * @param {String} object.id Name of the filter to be destroyed,
         * A filter can only be destroyed if no service uses it.
         * This means that the data.relationships object for the filter must be empty.
         * Note that the service → filter relationship cannot be modified from the filters resource and must
         * be done via the services resource.
         */
        async destroyFilter({ dispatch, commit }, id) {
            let res = await Vue.axios.delete(`/filters/${id}`)
            if (res.status === 204) {
                await dispatch('fetchAllFilters')
                await commit('showMessage', {
                    text: [`Filter ${id} is destroyed`],
                    type: 'success',
                })
            }
        },
    },
    getters: {
        filters: state => state.filters,
    },
}
