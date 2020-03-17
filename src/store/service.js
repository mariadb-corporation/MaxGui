import Vue from 'vue'

export default {
    state: {
        servicesData: [],
        // listenersByServiceIdMap: new Map(),
    },
    mutations: {
        /**
         * @param {Array} payload payload Array
         */
        setServices(state, payload) {
            state.servicesData = payload
        },
        // /**
        //  * @param {Object} payload payload object
        //  * @param {Array} payload.data Listeners of the service
        //  * @param {String} payload.id Name of the service
        //  */
        // setListenersByService(state, payload) {
        //     state.listenersByServiceIdMap = state.listenersByServiceIdMap.set(payload.id, payload.data);
        // },
    },
    actions: {
        async fetchServices({ commit }) {
            let res = await Vue.axios.get(`/v1/services`)
            await commit('setServices', res.data.data)
        },
        //-----------------------------------------------Service----------------------------------------------
        /**
         * @param {Object} serviceData Service object
         * @param {String} serviceData.mode Mode to perform async request POST or Patch
         * @param {String} serviceData.id Name of the service
         * @param {String} serviceData.router The router module to use

         * @param {Object} serviceData.parameters Parameters for the server
         * @param {String} serviceData.parameters.user The user to use
         * @param {String} serviceData.parameters.password The password to use
         * @param {Object} serviceData.relationships The relationships of the service to other resources
         * @param {Object} serviceData.relationships.servers Type of relationships
         * @param {Object} serviceData.relationships.filters Type of relationships
         */
        async createOrUpdateService({ commit, dispatch, state }, serviceData) {
            const payload = {
                data: {
                    id: serviceData.id,
                    type: 'services',
                    attributes: {
                        router: serviceData.router,
                        parameters: serviceData.parameters,
                    },
                    relationships: serviceData.relationships,
                },
            }

            let res
            let message
            switch (serviceData.mode) {
                case 'post':
                    res = await Vue.axios.post(`/v1/services/`, payload)
                    message = [`Service ${serviceData.id} is created`]
                    break
                case 'patch':
                    res = await Vue.axios.patch(`/v1/services/${serviceData.id}`, payload)
                    message = [`Service ${serviceData.id} is updated`]
                    break
            }

            // response ok
            if (res.status === 204) {
                await commit('showMessage', {
                    text: message,
                    type: 'success',
                })
                await dispatch('fetchServices')
            }
        },
        /**
         * @param {String} id id of the service
         */
        async destroyService({ dispatch, commit }, id) {
            let res = await Vue.axios.delete(`/v1/services/${id}`)
            // response ok
            if (res.status === 204) {
                await dispatch('fetchServices')
                await commit('showMessage', {
                    text: [`Service ${id} is deleted`],
                    type: 'success',
                })
            }
        },
        /**
         * @param {String} id id of the service
         * @param {String} mode Mode to start or stop service
         */
        async stopOrStartService({ dispatch, commit }, { id, mode }) {
            let res = await Vue.axios.put(`/v1/services/${id}/${mode}`)
            let message
            switch (mode) {
                case 'start':
                    message = [`Service ${id} is started`]
                    break
                case 'stop':
                    message = [`Service${id} is stopped`]
                    break
            }
            // response ok
            if (res.status === 204) {
                await dispatch('fetchServices')
                await commit('showMessage', {
                    text: message,
                    type: 'success',
                })
            }
        },

        //---------------------------------Listeners of the service-------------------------------------------
        // async fetchListenersByService({ commit, state }, serviceId) {
        //     try {
        //         let res = await Vue.axios.get(`/v1/services${serviceId}/listeners`);
        //         await commit('setListenersByService', { data: res.data.data, id: serviceId });
        //     } catch (error) {
        // let errorsArr = [error];
        // if (error.response.data) {
        //     errorsArr = error.response.data.errors.map(ele => `${ele.detail}`);
        // }
        // await commit('showMessage', {
        //     text: errorsArr,
        //     type: 'error',
        // });
        //     }
        // },
    },
    getters: {
        servicesData: state => state.servicesData,
        servicesDataMap: state => {
            let map = new Map()
            state.servicesData.forEach(ele => {
                map.set(ele.id, ele)
            })
            return map
        },

        allServicesInfo: state => {
            let idArr = []
            return state.servicesData.reduce((accumulator, _, index, array) => {
                idArr.push(array[index].id)
                return (accumulator = { idArr: idArr })
            }, [])
        },
    },
}
