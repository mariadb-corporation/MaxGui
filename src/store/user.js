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
import { OVERLAY_LOGOUT } from 'store/overlayTypes'
import { delay, dynamicColors, strReplaceAt } from 'utils/helpers'
import router from 'router'

export default {
    namespaced: true,
    state: {
        user: JSON.parse(sessionStorage.getItem('user')),
        currentNetworkUser: null,
        allNetworkUsers: [],
        allUNIXAccounts: [],
        allUsers: [],
        usersChartData: {
            datasets: [],
        },
    },
    mutations: {
        /**
         * @param {Object} userObj User token info
         * @param {String} userObj.token Token
         * @param {String} userObj.username username
         */
        setUser(state, userObj) {
            state.user = userObj
        },
        // ------------------- Network users
        setCurrentNetworkUser(state, obj) {
            state.currentNetworkUser = obj
        },
        setAllNetworkUsers(state, arr) {
            state.allNetworkUsers = arr
        },
        // ------------------- Unix accounts
        setAllUNIXAccounts(state, arr) {
            state.allUNIXAccounts = arr
        },
        // ------------------- All users
        setAllUsers(state, arr) {
            state.allUsers = arr
        },
        logout(state) {
            state.user = null
        },
        setUsersChartData(state, payload) {
            state.usersChartData = payload
        },
    },
    actions: {
        async logout({ commit }) {
            commit('logout')

            await commit('showOverlay', OVERLAY_LOGOUT, { root: true })
            await delay(1500).then(() => {
                return commit('hideOverlay', null, { root: true }), router.push('/login')
            })
            delete Vue.axios.defaults.headers.common['Authorization']
            sessionStorage.removeItem('user')
            commit('setUser', {})
        },
        // --------------------------------------------------- Network users -------------------------------------
        async fetchCurrentNetworkUser({ dispatch, commit, state }) {
            let res = await Vue.axios.get(`/users/inet/${state.user.username}`)
            // response ok
            if (res.status === 200) {
                let data = res.data.data
                commit('setCurrentNetworkUser', data)
                if (data.attributes.account === 'admin') {
                    await dispatch('fetchAllNetworkUsers')
                    await dispatch('fetchAllUNIXAccounts')
                    await dispatch('fetchAllUsers')
                }
            }
        },
        async fetchAllNetworkUsers({ commit }) {
            let res = await Vue.axios.get(`/users/inet`)
            // response ok
            if (res.status === 200) {
                commit('setAllNetworkUsers', res.data.data)
            }
        },
        /**Only admin accounts can perform POST, PUT, DELETE and PATCH requests
         * @param {Object} data data object
         * @param {String} data.mode Mode to perform async request POST or Patch
         * @param {String} data.id the username
         * @param {String} data.password The password for this user
         * @param {String} data.role Set to admin for administrative users and basic to read-only users
         */
        async createOrUpdateNetworkUser({ commit, dispatch }, data) {
            let res
            let message
            switch (data.mode) {
                case 'post':
                    {
                        const payload = {
                            data: {
                                id: data.id,
                                type: 'inet',
                                attributes: { password: data.password, account: data.role },
                            },
                        }
                        res = await Vue.axios.post(`/users/inet`, payload)
                        message = [`Network User ${data.id} is created`]
                    }
                    break
                case 'patch':
                    {
                        const payload = {
                            data: {
                                attributes: { password: data.password },
                            },
                        }
                        res = await Vue.axios.patch(`/users/inet/${data.id}`, payload)
                        message = [`Network User ${data.id} is updated`]
                    }
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
                await dispatch('fetchAllNetworkUsers')
            }
        },
        /**
         * @param {String} id id of the network user
         */
        async deleteNetworkUserById({ dispatch, commit }, id) {
            let res = await Vue.axios.delete(`/users/inet/${id}`)
            // response ok
            if (res.status === 204) {
                await dispatch('fetchAllNetworkUsers')
                await commit(
                    'showMessage',
                    {
                        text: [`Network user ${id} is deleted`],
                        type: 'success',
                    },
                    { root: true }
                )
            }
        },
        // --------------------------------------------------- Unix accounts -------------------------------------
        async fetchAllUNIXAccounts({ commit }) {
            let res = await Vue.axios.get(`/users/unix`)
            // response ok
            if (res.status === 200) {
                commit('setAllUNIXAccounts', res.data.data)
            }
        },
        async enableUNIXAccount({ commit, dispatch }, { id, role }) {
            let res = await Vue.axios.get(`/users/unix`, {
                data: {
                    id: id,
                    type: 'unix',
                    attributes: {
                        account: role,
                    },
                },
            })
            // response ok
            if (res.status === 204) {
                await commit(
                    'showMessage',
                    {
                        text: [`UNIX account ${id} is enabled`],
                        type: 'success',
                    },
                    { root: true }
                )
                await dispatch('fetchAllUNIXAccounts')
            }
        },
        /**
         * @param {String} id id of the UNIX user
         */
        async disableUNIXAccount({ dispatch, commit }, id) {
            let res = await Vue.axios.delete(`/users/unix/${id}`)
            // response ok
            if (res.status === 204) {
                await dispatch('fetchAllUNIXAccounts')
                await commit(
                    'showMessage',
                    {
                        text: [`UNIX account ${id} is disabled`],
                        type: 'success',
                    },
                    { root: true }
                )
            }
        },
        // --------------------------------------------------- All users -----------------------------------------
        async fetchAllUsers({ commit }) {
            let res = await Vue.axios.get(`/users`)
            // response ok
            if (res.status === 200) {
                commit('setAllUsers', res.data.data)
            }
        },

        genDataSetSchema({ commit, state }) {
            const { allUNIXAccounts } = state
            if (allUNIXAccounts) {
                let lineColors = dynamicColors(0)

                let indexOfOpacity = lineColors.lastIndexOf(')') - 1
                let dataset = [
                    {
                        label: `Total Unix User`,
                        type: 'line',
                        // background of the line
                        backgroundColor: strReplaceAt(lineColors, indexOfOpacity, '0.2'),
                        borderColor: lineColors, //theme.palette.primary.main, // line color
                        borderWidth: 1,
                        lineTension: 0,
                        data: [{ x: Date.now(), y: allUNIXAccounts.length }],
                    },
                ]

                let usersChartDataSchema = {
                    datasets: dataset,
                }
                commit('setUsersChartData', usersChartDataSchema)
            }
        },
    },
    getters: {
        user: state => state.user,
        currentNetworkUser: state => state.currentNetworkUser,
        allUsers: state => state.allUsers,
        usersChartData: state => state.usersChartData,
        allUNIXAccounts: state => state.allUNIXAccounts,
    },
}
