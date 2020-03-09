import Vuex from 'vuex';
import user from 'store/user';
import maxscale from './maxscale';
import threads from './threads';
import servers from './servers';
import services from './services';

export default new Vuex.Store({
    state: {
        message: {
            status: false,
            text: '',
            type: 'info',
        },
        darkTheme: localStorage.getItem('darkTheme') === 'true' ? true : false,
    },
    mutations: {
        /**
         * @param {Object} obj Object message
         * @param {Array} obj.text An array of string
         * @param {String} obj.type Type of response
         */
        showMessage(state, obj) {
            const { text, type } = obj;
            state.message.status = true;
            state.message.text = text;
            state.message.type = type;
        },
        /**
         * @param {Boolean} obj Boolean darkmode
         */
        toggleDarkTheme(state) {
            state.darkTheme = !state.darkTheme;
            localStorage.setItem('darkTheme', state.darkTheme);
        },
    },
    getters: {
        darkTheme: state => state.darkTheme,
    },
    modules: {
        user,
        maxscale,
        servers,
        services,
        threads,
    },
});
