import Vuex from 'vuex';
import user from 'store/user';
import threads from './threads';
import servers from './servers';

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
        showMessage(state, { text, type }) {
            state.message.status = true;
            state.message.text = text;
            state.message.type = type;
        },
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
        servers,
        threads,
    },
});
