import Vue from 'vue'
import { OVERLAY_LOADING } from 'store/overlayTypes'
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
            commit('setLayout', 'no-layout')
            sessionStorage.removeItem('user')
            delete Vue.axios.defaults.headers.common['Authorization']
            // commit('showOverlay', OVERLAY_LOADING)
            // await delay(10000000).then(() => {
            //     return commit('hideOverlay')
            // })
            router.push('login')
        },
    },
    getters: {
        user: state => state.user,
    },
}
