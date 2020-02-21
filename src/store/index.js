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
    },
    mutations: {
        showMessage(state, { text, type }) {
            state.message.status = true;
            state.message.text = text;
            state.message.type = type;
        },
    },
    modules: {
        user,
        servers,
        threads,
    },
});
