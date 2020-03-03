import Vue from 'vue';

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
            state.user = userObj && userObj;
        },
        logout(state) {
            state.user = null;
        },
    },
    actions: {
        async logout({ commit }) {
            commit('logout');
            sessionStorage.removeItem('user');
            Vue.axios.defaults.headers.common['Authorization'];
        },
    },
    getters: {
        user: state => state.user,
    },
};
