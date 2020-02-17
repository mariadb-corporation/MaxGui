import Vuex from "vuex";
import user from "store/user";
import threads from "./threads";

export default new Vuex.Store({
  modules: {
    user,
    threads
  }
});
