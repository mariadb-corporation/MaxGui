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
import Vuex from 'vuex'
import user from 'store/user'
import maxscale from './maxscale'
import server from './server'
import service from './service'
import monitor from './monitor'
import filter from './filter'
import session from './session'
import listener from './listener'
import { APP_CONFIG } from 'utils/constants'

export default new Vuex.Store({
    state: {
        config: APP_CONFIG,
        message: {
            status: false,
            text: '',
            type: 'info',
        },
        searchKeyWord: '',
        overlay: false,
    },
    mutations: {
        showOverlay(state, type) {
            state.overlay = type
        },
        hideOverlay(state) {
            state.overlay = false
        },
        /**
         * @param {Object} obj Object message
         * @param {Array} obj.text An array of string
         * @param {String} obj.type Type of response
         */
        showMessage(state, obj) {
            const { text, type } = obj
            state.message.status = true
            state.message.text = text
            state.message.type = type
        },
        /**
         * @param {String} keyword global search keyword
         */
        setSearchKeyWord(state, keyword) {
            state.searchKeyWord = keyword
        },
    },
    // actions: {
    //     async filterFetch({ commit }) {
    //         let res = await Vue.axios.get(`/filters`)
    //         await commit('setFilters', res.data.data)
    //     },
    // },
    getters: {
        searchKeyWord: state => state.searchKeyWord,
        overlay: state => state.overlay,
    },
    modules: {
        filter,
        listener,
        maxscale,
        monitor,
        server,
        service,
        session,
        user,
    },
})
