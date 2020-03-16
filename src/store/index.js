import Vuex from 'vuex'
import user from 'store/user'
import maxscale from './maxscale'
import threads from './threads'
import servers from './servers'
import services from './services'
import { APP_CONFIG } from 'utils/constants'

export default new Vuex.Store({
    state: {
        config: APP_CONFIG,
        message: {
            status: false,
            text: '',
            type: 'info',
        },
        darkTheme: localStorage.getItem('darkTheme') === 'true' ? true : false,
        searchKeyWord: '',
        overlay: false,
        layout: 'no-layout',
    },
    mutations: {
        setLayout(state, payload) {
            state.layout = payload
        },
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
         * @param {Boolean} obj Boolean darkmode
         */
        toggleDarkTheme(state) {
            state.darkTheme = !state.darkTheme
            localStorage.setItem('darkTheme', state.darkTheme)
        },
        setSearchKeyWord(state, keyword) {
            state.searchKeyWord = keyword
        },
    },
    getters: {
        searchKeyWord: state => state.searchKeyWord,
        darkTheme: state => state.darkTheme,
        layout: state => state.layout,
    },
    modules: {
        user,
        maxscale,
        servers,
        services,
        threads,
    },
})
