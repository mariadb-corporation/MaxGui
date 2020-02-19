export default {
    state: {
        username: null,
        password: null,
        token: null
    },
    mutations: {
        setUser(state, userObj) {
            state.username = userObj && userObj.username;
            state.password = userObj && userObj.password;
            state.token = userObj && userObj.token;
            // for now, testing purpose
            localStorage.setItem(
                "credentials",
                JSON.stringify({
                    username: userObj.username,
                    password: userObj.password,
                    token: userObj.token
                })
            );
        },
        logout(state) {
            state.username = null;
            state.password = null;
            state.token = null;
            localStorage.removeItem("credentials");
        }
    },
    actions: {
        fetchUser({ commit }) {
            // for testing purpose, a jwt should be stored instead
            commit({
                type: "setUser",
                username: "admin",
                password: "mariadb",
                token: "fakeToken"
            });
        }
    },
    getters: {
        user: state => {
            const { token, username, password } = state;

            return { token, username, password };
        }
    }
};
