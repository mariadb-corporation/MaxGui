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
import { dynamicColors, strReplaceAt, orderBy, isUndefined, isFunction } from 'utils/helpers'

export default {
    namespaced: true,
    state: {
        allServers: [],
        currentServer: {},
        serversConnectionsChartData: {
            datasets: [],
        },
    },
    mutations: {
        /**
         * @param {Array} payload // List of server resources
         */
        setServers(state, payload) {
            state.allServers = payload
        },
        setCurrentServer(state, payload) {
            state.currentServer = payload
        },
        setServersConnectionsChartData(state, payload) {
            state.serversConnectionsChartData = payload
        },
    },
    actions: {
        async fetchAllServers({ commit }) {
            let res = await Vue.axios.get(`/servers`)
            let newArr = res.data.data.map((server, i) => ({ ...server, idNum: i }))
            let sorted = orderBy(newArr, 'idNum', 'desc')
            await commit('setServers', sorted)
        },
        async fetchServerById({ commit, state }, id) {
            let res = await Vue.axios.get(`/servers/${id}`, {
                auth: state.credentials,
            })
            commit('setCurrentServer', res.data.data)
        },

        /**
         * @param {Object} payload payload object
         * @param {String} payload.mode Mode to perform async request POST or Patch
         * @param {String} payload.id Name of the server
         * @param {Object} payload.parameters Parameters for the server
         */
        async createServer({ commit }, payload) {
            const body = {
                data: {
                    id: payload.id,
                    type: 'servers',
                    attributes: {},
                },
            }
            let res
            let message

            switch (payload.mode) {
                case 'post':
                    body.data.attributes.parameters = payload.parameters
                    body.data.relationships = payload.relationships
                    res = await Vue.axios.post(`/servers/`, body)
                    message = [`Server ${payload.id} is created`]

                    break

                case 'patch':
                    if (!isUndefined(payload.parameters)) {
                        body.data.attributes.parameters = payload.parameters
                    }

                    res = await Vue.axios.patch(`/servers/${payload.id}`, body)
                    message = [`Server ${payload.id} is updated`]
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
                if (isFunction(payload.callback)) await payload.callback()
            }
        },
        //-----------------------------------------------Server parameter update---------------------------------
        /**
         * @param {Object} payload payload object
         * @param {String} payload.id Name of the server
         * @param {Object} payload.parameters Parameters for the server
         * @param {Object} payload.callback callback function after successfully updated
         */
        async updateServerParameters({ commit }, payload) {
            const body = {
                data: {
                    id: payload.id,
                    type: 'servers',
                    attributes: { parameters: payload.parameters },
                },
            }
            let res = await Vue.axios.patch(`/servers/${payload.id}`, body)
            // response ok
            if (res.status === 204) {
                await commit(
                    'showMessage',
                    {
                        text: [`Server ${payload.id} is updated`],
                        type: 'success',
                    },
                    { root: true }
                )
                if (isFunction(payload.callback)) await payload.callback()
            }
        },
        //-----------------------------------------------Server relationship update---------------------------------
        /**
         * @param {Object} payload payload object
         * @param {String} payload.id Name of the server
         * @param {Array} payload.services services array
         * @param {Array} payload.monitors monitors array
         * @param {Object} payload.type Type of relationships
         * @param {Function} payload.callback callback function after successfully updated
         */
        async updateServerRelationship({ commit }, payload) {
            let res
            let message

            res = await Vue.axios.patch(`/servers/${payload.id}/relationships/${payload.type}`, {
                data: payload.type === 'services' ? payload.services : payload.monitors,
            })
            message = [`The ${payload.type} relationships in ${payload.id} is updated`]

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
                if (isFunction(payload.callback)) await payload.callback()
            }
        },

        /**
         * @param {String} id id of the server
         */
        async destroyServer({ dispatch, commit }, id) {
            let res = await Vue.axios.delete(`/servers/${id}`)
            // response ok
            if (res.status === 204) {
                await dispatch('fetchAllServers')
                await commit(
                    'showMessage',
                    {
                        text: [`Server ${id} is deleted`],
                        type: 'success',
                    },
                    { root: true }
                )
            }
        },
        /**
         * @param {String} id id of the server
         * @param {String} state state of the server (master, slave, maintenance, running, synced or stale)
         * @param {String} mode mode set or clear
         */
        async setOrClearServerState({ dispatch, commit }, { id, state, mode }) {
            let res, message
            switch (mode) {
                case 'set':
                    res = await Vue.axios.put(`/servers/${id}/set?state=${state}`)
                    message = [`Server ${id} is set to ${state}`]
                    break
                case 'clear':
                    res = await Vue.axios.put(`/servers/${id}/clear?state=${state}`)
                    message = [`State ${state} of server ${id} is cleared`]
                    break
            }
            // response ok
            if (res.status === 204) {
                await dispatch('fetchAllServers')
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

        /**
        Generate data schema for total connections of each server
         */
        genDataSetSchema({ commit, state }) {
            const { allServers } = state
            if (allServers.length) {
                let arr = []
                let lineColors = []
                for (let i = 0; i < allServers.length; ++i) {
                    const {
                        id,
                        attributes: { statistics },
                    } = allServers[i]
                    lineColors.push(dynamicColors(i))
                    let indexOfOpacity = lineColors[i].lastIndexOf(')') - 1
                    let obj = {
                        label: `Server ID - ${id}`,
                        id: `Server ID - ${id}`,
                        type: 'line',
                        // background of the line
                        backgroundColor: strReplaceAt(lineColors[i], indexOfOpacity, '0.2'),
                        borderColor: lineColors[i], //theme.palette.primary.main, // line color
                        borderWidth: 1,
                        lineTension: 0,
                        data: [{ x: Date.now(), y: statistics.connections }],
                    }
                    arr.push(obj)
                }
                let serversConnectionsChartDataSchema = {
                    datasets: arr,
                }
                commit('setServersConnectionsChartData', serversConnectionsChartDataSchema)
            }
        },
    },
    getters: {
        allServers: state => state.allServers,
        currentServer: state => state.currentServer,
        allServersMap: state => {
            let map = new Map()
            state.allServers.forEach(ele => {
                map.set(ele.id, ele)
            })
            return map
        },
        allServersInfo: state => {
            let idArr = []
            let portNumArr = []
            return state.allServers.reduce((accumulator, _, index, array) => {
                idArr.push(array[index].id)
                portNumArr.push(array[index].attributes.parameters.port)

                return (accumulator = { idArr: idArr, portNumArr: portNumArr })
            }, [])
        },

        serversConnectionsChartData: state => state.serversConnectionsChartData,
    },
}
