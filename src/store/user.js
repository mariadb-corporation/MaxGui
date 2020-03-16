import Vue from 'vue'
import { OVERLAY_LOGOUT } from 'store/overlayTypes'
import { delay } from 'utils/helpers'

export default {
    state: {
        user: JSON.parse(sessionStorage.getItem('user')),
    },
    mutations: {
        /**
         * @param {Object} userObj User token info
         * @param {String} userObj.token Token
         * @param {String} userObj.username username
         */
        setUser(state, userObj) {
            state.user = userObj && userObj
        },
        logout(state) {
            state.user = null
        },
    },
    actions: {
        async logout({ commit }, router) {
            commit('logout')
            sessionStorage.removeItem('user')
            commit('setUser', {})
            delete Vue.axios.defaults.headers.common['Authorization']
            commit('showOverlay', OVERLAY_LOGOUT)
            router.push('login')
            await delay(600).then(() => {
                return commit('hideOverlay')
            })
        },
    },
    getters: {
        user: state => state.user,
    },
}
