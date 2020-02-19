import Vue from "vue";

export default {
    state: {
        serversData: [],
        credentials: JSON.parse(localStorage.getItem("credentials"))
    },
    mutations: {
        setServers(state, payload) {
            state.serversData = payload;
        }
    },
    actions: {
        async fetchServersAsync({ commit, state }) {
            try {
                let res = await Vue.axios.get(`/v1/servers`, {
                    auth: state.credentials
                });
                commit("setServers", res.data.data);
            } catch (error) {
                console.log("fetchServers error", error);
            }
        }
    },
    getters: {
        serversData: state => state.serversData
    }
};
