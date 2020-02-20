import Vue from "vue";

export default {
    state: {
        serversData: [],
        credentials: JSON.parse(sessionStorage.getItem("credentials")),
        currentServer: {}
    },
    mutations: {
        setServers(state, payload) {
            state.serversData = payload;
        },
        setCurrentServer(state, payload) {
            state.currentServer = payload;
        }
    },
    actions: {
        async fetchServers({ commit, state }) {
            try {
                let res = await Vue.axios.get(`/v1/servers`, {
                    auth: state.credentials
                });
                console.log("fetchServers", res.data.data);
                commit("setServers", res.data.data);
            } catch (error) {
                console.log("fetchServers error", error);
            }
        },
        async fetchServerById({ commit, state }, id) {
            try {
                let res = await Vue.axios.get(`/v1/servers/${id}`, {
                    auth: state.credentials
                });
                commit("setCurrentServer", res.data.data);
            } catch (error) {
                console.log("fetchServerById error", error);
            }
        },
        async createServer({ dispatch, state }, obj) {
            try {
                let res = await Vue.axios.post(
                    `/v1/servers/`,
                    {
                        data: {
                            id: "row_server_8",
                            type: "servers",
                            attributes: {
                                parameters: {
                                    address: "127.0.0.1",
                                    port: 8989
                                }
                            }
                        }
                    },
                    {
                        auth: state.credentials
                    }
                );
                // response ok
                res.status === 204 && (await dispatch("fetchServers"));
            } catch (error) {
                console.log("createServer error", error);
            }
        },
        async deleteServerById({ dispatch, state }, id) {
            try {
                let res = await Vue.axios.delete(`/v1/servers/${id}`, {
                    auth: state.credentials
                });
                // response ok
                res.status === 204 && (await dispatch("fetchServers"));
            } catch (error) {
                console.log("createServer error", error);
            }
        }
    },
    getters: {
        serversData: state => state.serversData,
        currentServer: state => state.currentServer
    }
};
