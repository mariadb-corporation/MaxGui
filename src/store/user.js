export default {
  state: {
    isLoggedIn: false,
    name: null
  },
  mutations: {
    setUser(state, userObj) {
      console.log("userObj", userObj);
      state.isLoggedIn = true;
      state.name = userObj && userObj.name;
      localStorage.setItem("isUserLogin", state.isLoggedIn);
    }
  },
  actions: {
    async fetchUser({ commit }) {
      // testing
      console.log("should run");
      commit({
        type: "setUser",
        name: "admin"
      });
    }
  },
  getters: {
    user: state => {
      const { isLoggedIn, name } = state;

      return { isLoggedIn, name };
    }
  }
};
