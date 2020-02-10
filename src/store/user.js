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
      // for now, testing purpose
      localStorage.setItem(
        "credentials",
        JSON.stringify({
          username: userObj.username,
          password: userObj.password,
          token: userObj.token
        })
      );
    }
  },
  actions: {
    fetchUser({ commit }) {
      // for testing purpose, a jwt should be stored instead
      console.log("vfetchUser");
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
