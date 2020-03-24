import Vue from 'vue'

export default {
    state: {
        allMonitors: [],
        currentMonitor: {},
    },
    mutations: {
        /**
         * @param {Object} payload setMaxScaleDetails array
         */
        setAllMonitors(state, payload) {
            state.allMonitors = payload
        },
        setCurrentMonitor(state, payload) {
            state.currentMonitor = payload
        },
    },
    actions: {
        async fetchAllMonitors({ commit }) {
            let res = await Vue.axios.get(`/monitors`)
            await commit('setAllMonitors', res.data.data)
        },
        async fetchMonitorById({ commit }, id) {
            let res = await Vue.axios.get(`/monitors/${id}`)
            await commit('setCurrentMonitor', res.data.data)
        },
        /**
         * @param {Object} data Monitor data object
         * @param {String} data.mode Mode to perform async request POST or Patch
         * @param {String} data.id Name of the monitor
         * @param {String} data.module The monitor module to use
         * @param {Object} data.parameters All monitor parameters can be defined at creation time.
         * @param {Array} data.servers Servers to be monitored
         */
        async createOrUpdateMonitor({ commit, dispatch }, data) {
            let res
            let message
            const payload = {
                data: {
                    id: data.id,
                    type: 'monitors',
                    attributes: {
                        module: data.module,
                        parameters: data.parameters,
                        /* These are standard Modifiable parameters
                        user
                        password
                        monitor_interval
                        backend_connect_timeout
                        backend_write_timeout
                        backend_read_timeout
                        backend_connect_attempts
                        */
                    },
                    relationships: {
                        servers: { data: data.servers }, // [{id:"severId", type:"servers"}]
                    },
                },
            }
            switch (data.mode) {
                case 'post':
                    {
                        res = await Vue.axios.post(`/monitors`, payload)
                        message = [`Monitor ${data.id} is created`]
                    }
                    break
                case 'patch':
                    {
                        res = await Vue.axios.patch(`/monitors/${data.id}`, payload)
                        message = [`Monitor ${data.id} is updated`]
                    }
                    break
            }
            // response ok
            if (res.status === 204) {
                await commit('showMessage', {
                    text: message,
                    type: 'success',
                })
                await dispatch('fetchAllMonitors')
            }
        },
        /**
         * @param {String} id id of the monitor to be manipulated
         * @param {String} mode Mode to manipulate the monitor ( destroy, stop, start)
         */
        async monitorManipulate({ dispatch, commit }, { id, mode }) {
            let res, message
            switch (mode) {
                case 'destroy':
                    /*  Destroy a created monitor. 
                    The monitor must not have relationships to any servers in order to be destroyed. */
                    res = await Vue.axios.delete(`/monitors/${id}`)
                    message = [`Monitor ${id} is destroyed`]
                    break
                case 'stop':
                    //Stops a started monitor.
                    res = await Vue.axios.put(`/monitors/${id}/stop`)
                    message = [`Monitor ${id} is stopped`]
                    break
                case 'start':
                    //Starts a stopped monitor.
                    res = await Vue.axios.put(`/monitors/${id}/start`)
                    message = [`Monitor ${id} is started`]
                    break
            }
            // response ok
            if (res.status === 204) {
                await dispatch('fetchAllMonitors')
                await commit('showMessage', {
                    text: message,
                    type: 'success',
                })
            }
        },
    },
    getters: {
        allMonitors: state => state.allMonitors,
        currentMonitor: state => state.currentMonitor,
    },
}
