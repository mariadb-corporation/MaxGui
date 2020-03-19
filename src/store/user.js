import Vue from 'vue'
import { OVERLAY_LOGOUT } from 'store/overlayTypes'
import { delay } from 'utils/helpers'
import router from 'router'

export default {
    state: {
        user: JSON.parse(sessionStorage.getItem('user')),
        currentNetworkUser: null,
        allNetworkUsers: [],
        allUNIXAccounts: [],
        allUsers: [],
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
    },
    actions: {
        async logout({ commit }) {
            commit('logout')
            sessionStorage.removeItem('user')
            commit('setUser', {})
            delete Vue.axios.defaults.headers.common['Authorization']
            await commit('showOverlay', OVERLAY_LOGOUT)
            await delay(1500).then(() => {
                return commit('hideOverlay'), router.push('login')
            })
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
                await commit('showMessage', {
                    text: message,
                    type: 'success',
                })
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
                await commit('showMessage', {
                    text: [`Network user ${id} is deleted`],
                    type: 'success',
                })
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
                await commit('showMessage', {
                    text: [`UNIX account ${id} is enabled`],
                    type: 'success',
                })
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
                await commit('showMessage', {
                    text: [`UNIX account ${id} is disabled`],
                    type: 'success',
                })
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
    },
    getters: {
        user: state => state.user,
    },
}
