import Vuex from "vuex";
import user from "store/user";
import threads from "./threads";
import servers from "./servers";

export default new Vuex.Store({
    modules: {
        user,
        servers,
        threads
    }
});
