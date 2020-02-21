import Vue from 'vue';

export default {
    state: {
        serversData: [],
        credentials: JSON.parse(sessionStorage.getItem('credentials')),
        currentServer: {},
    },
    mutations: {
        setServers(state, payload) {
            state.serversData = payload;
        },
        setCurrentServer(state, payload) {
            state.currentServer = payload;
        },
    },
    actions: {
        async fetchServers({ commit, state }) {
            try {
                let res = await Vue.axios.get(`/v1/servers`, {
                    auth: state.credentials,
                });
                await commit('setServers', res.data.data);
            } catch (error) {
                await commit('showMessage', {
                    text: error,
                    type: 'error',
                });
            }
        },
        async fetchServerById({ commit, state }, id) {
            try {
                let res = await Vue.axios.get(`/v1/servers/${id}`, {
                    auth: state.credentials,
                });
                commit('setCurrentServer', res.data.data);
            } catch (error) {
                await commit('showMessage', {
                    text: error,
                    type: 'error',
                });
            }
        },
        async createServer({ commit, dispatch, state }, serverData) {
            try {
                let res = await Vue.axios.post(
                    `/v1/servers/`,
                    {
                        data: {
                            id: serverData.id,
                            type: 'servers',
                            attributes: {
                                parameters: serverData.parameters,
                            },
                        },
                    },
                    {
                        auth: state.credentials,
                    }
                );
                // response ok
                if (res.status === 204) {
                    await dispatch('fetchServers');
                    await commit('showMessage', {
                        text: 'Server Created',
                        type: 'success',
                    });
                }
            } catch (error) {
                await commit('showMessage', {
                    text: error,
                    type: 'error',
                });
            }
        },
        async deleteServerById({ dispatch, commit, state }, id) {
            try {
                let res = await Vue.axios.delete(`/v1/servers/${id}`, {
                    auth: state.credentials,
                });
                // response ok
                if (res.status === 204) {
                    await dispatch('fetchServers');
                    await commit('showMessage', {
                        text: 'Server Deleted',
                        type: 'success',
                    });
                }
            } catch (error) {
                await commit('showMessage', {
                    text: error,
                    type: 'error',
                });
            }
        },
    },
    getters: {
        serversData: state => state.serversData,
        currentServer: state => state.currentServer,
    },
};
