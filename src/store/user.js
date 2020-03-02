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
            sessionStorage.setItem('user', JSON.stringify(userObj));
        },
        logout(state) {
            state.user = null;
            sessionStorage.removeItem('user');
        },
    },
    getters: {
        user: state => state.user,
    },
};
