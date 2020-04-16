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
import { dynamicColors, strReplaceAt, isUndefined } from 'utils/helpers'

export default {
    namespaced: true,
    state: {
        allServices: [],
        // listenersByServiceIdMap: new Map(),
        currentService: {},
        totalConnectionsChartData: {
            datasets: [],
        },
    },
    mutations: {
        /**
         * @param {Array} payload payload Array
         */
        setServices(state, payload) {
            state.allServices = payload
        },
        setCurrentService(state, payload) {
            state.currentService = payload
        },
        setTotalConnectionsChartData(state, payload) {
            state.totalConnectionsChartData = payload
        },
    },
    actions: {
        async fetchServiceById({ commit, state }, id) {
            let res = await Vue.axios.get(`/services/${id}`, {
                auth: state.credentials,
            })
            commit('setCurrentService', res.data.data)
        },
        genDataSetSchema({ commit, state }) {
            const { currentService } = state
            if (currentService) {
                let lineColors = dynamicColors(0)
                let indexOfOpacity = lineColors.lastIndexOf(')') - 1
                let dataset = [
                    {
                        label: `Current connections`,
                        type: 'line',
                        // background of the line
                        backgroundColor: strReplaceAt(lineColors, indexOfOpacity, '0.2'),
                        borderColor: lineColors,
                        borderWidth: 1,
                        lineTension: 0,
                        //currentService.attributes.total_connections
                        data: [{ x: Date.now(), y: Math.round(Math.random() * 100) }],
                    },
                ]

                let totalConnectionsChartDataSchema = {
                    datasets: dataset,
                }
                commit('setTotalConnectionsChartData', totalConnectionsChartDataSchema)
            }
        },
        async fetchAllServices({ commit }) {
            let res = await Vue.axios.get(`/services`)
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
        async createOrUpdateService({ commit }, serviceData, callback) {
            const payload = {
                data: {
                    id: serviceData.id,
                    type: 'services',
                    attributes: {},
                },
            }
            let res
            let message
            switch (serviceData.mode) {
                case 'post':
                    payload.data.attributes.router = serviceData.router
                    payload.data.attributes.parameters = serviceData.parameters
                    payload.data.relationships = serviceData.relationships
                    res = await Vue.axios.post(`/services/`, payload)
                    message = [`Service ${serviceData.id} is created`]

                    break
                case 'patch':
                    if (!isUndefined(serviceData.parameters)) {
                        payload.data.attributes.parameters = serviceData.parameters
                    }
                    if (!isUndefined(serviceData.relationships)) {
                        payload.data.relationships = serviceData.relationships
                    }
                    res = await Vue.axios.patch(`/services/${serviceData.id}`, payload)
                    message = [`Service ${serviceData.id} is updated`]
                    break
            }

            // response ok
            if (res.status === 204) {
                await commit(
                    'showMessage',
                    {
                        text: message,
                        type: 'success',
                    },
                    { root: true }
                )
                await callback
            }
        },
        /**
         * @param {String} id id of the service
         */
        async destroyService({ dispatch, commit }, id) {
            let res = await Vue.axios.delete(`/services/${id}`)
            // response ok
            if (res.status === 204) {
                await dispatch('fetchAllServices')
                await commit(
                    'showMessage',
                    {
                        text: [`Service ${id} is deleted`],
                        type: 'success',
                    },
                    { root: true }
                )
            }
        },
        /**
         * @param {String} id id of the service
         * @param {String} mode Mode to start or stop service
         */
        async stopOrStartService({ dispatch, commit }, { id, mode }) {
            let res = await Vue.axios.put(`/services/${id}/${mode}`)
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
                await dispatch('fetchAllServices')
                await commit(
                    'showMessage',
                    {
                        text: message,
                        type: 'success',
                    },
                    { root: true }
                )
            }
        },
    },
    getters: {
        allServices: state => state.allServices,
        currentService: state => state.currentService,
        allServicesMap: state => {
            let map = new Map()
            state.allServices.forEach(ele => {
                map.set(ele.id, ele)
            })
            return map
        },

        allServicesInfo: state => {
            let idArr = []
            return state.allServices.reduce((accumulator, _, index, array) => {
                idArr.push(array[index].id)
                return (accumulator = { idArr: idArr })
            }, [])
        },
        totalConnectionsChartData: state => state.totalConnectionsChartData,
    },
}
