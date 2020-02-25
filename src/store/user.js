export default {
    state: {
        username: null,
        password: null,
        token: null,
    },
    mutations: {
        /**
         * @param {Object} userObj User credentials info
         * @param {String} userObj.username plain text
         * @param {String} userObj.password plain text
         * @param {String} userObj.token Token
         */
        setUser(state, userObj) {
            state.username = userObj && userObj.username;
            state.password = userObj && userObj.password;
            state.token = userObj && userObj.token;
            // for now, testing purpose
            sessionStorage.setItem(
                'credentials',
                JSON.stringify({
                    username: userObj.username,
                    password: userObj.password,
                    token: userObj.token,
                })
            );
        },
        logout(state) {
            state.username = null;
            state.password = null;
            state.token = null;
            sessionStorage.removeItem('credentials');
        },
    },
    actions: {
        fetchUser({ commit }) {
            // for testing purpose, a jwt should be stored instead
            commit({
                type: 'setUser',
                username: 'admin',
                password: 'mariadb',
                token: 'fakeToken',
            });
        },
    },
    getters: {
        user: state => {
            const { token, username, password } = state;

            return { token, username, password };
        },
    },
};
