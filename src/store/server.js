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

export default {
    namespaced: true,
    state: {
        allServers: [],
        currentServer: {},
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
    },
    actions: {
        async fetchAllServers({ commit }) {
            let res = await Vue.axios.get(`/servers`)
            await commit('setServers', res.data.data)
        },
        async fetchServerById({ commit, state }, id) {
            let res = await Vue.axios.get(`/servers/${id}`, {
                auth: state.credentials,
            })
            commit('setCurrentServer', res.data.data)
        },

        /**
         * @param {Object} serverData Server object
         * @param {String} serverData.mode Mode to perform async request POST or Patch
         * @param {String} serverData.id Name of the server
         * @param {Object} serverData.relationships Relationships of the server
         * @param {Object} serverData.parameters Parameters for the server
         */
        async createOrUpdateServer({ commit, dispatch }, serverData) {
            const payload = {
                data: {
                    id: serverData.id,
                    type: 'servers',
                    attributes: { parameters: serverData.parameters },
                    relationships: serverData.relationships,
                },
            }
            let res
            let message
            switch (serverData.mode) {
                case 'post':
                    res = await Vue.axios.post(`/servers/`, payload)
                    message = [`Server ${serverData.id} is created`]
                    break
                case 'patch':
                    res = await Vue.axios.patch(`/servers/${serverData.id}`, payload)
                    message = [`Server ${serverData.id} is updated`]
                    break
            }

            // response ok
            if (res.status === 204) {
                await commit('showMessage', {
                    text: message,
                    type: 'success',
                })
                await dispatch('fetchAllServers')
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
                await commit('showMessage', {
                    text: [`Server ${id} is deleted`],
                    type: 'success',
                })
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
                await commit('showMessage', {
                    text: message,
                    type: 'success',
                })
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
    },
}
