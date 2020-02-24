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
        /**
         * 
         * 
         * @param { 
                mode: String,
                id:String,
                relationships: Object,
                parameters: Object,
            } serverData 
         *
         */
        async createOrUpdateServer({ commit, dispatch, state }, serverData) {
            try {
                let res;
                let message;
                if (serverData.mode === 'post') {
                    res = await Vue.axios.post(
                        `/v1/servers/`,
                        {
                            data: {
                                id: serverData.id,
                                type: 'servers',
                                attributes: {
                                    parameters: serverData.parameters,
                                },
                                relationships: serverData.relationships,
                            },
                        },
                        {
                            auth: state.credentials,
                        }
                    );
                    message = `Server ${serverData.id} is created`;
                } else if (serverData.mode === 'patch') {
                    res = await Vue.axios.patch(
                        `/v1/servers/${serverData.id}`,
                        {
                            data: {
                                id: serverData.id,
                                type: 'servers',
                                attributes: {
                                    parameters: serverData.parameters,
                                },
                                relationships: serverData.relationships,
                            },
                        },
                        {
                            auth: state.credentials,
                        }
                    );
                    message = `Server ${serverData.id} is updated`;
                }

                // response ok
                if (res.status === 204) {
                    await commit('showMessage', {
                        text: message,
                        type: 'success',
                    });
                    await dispatch('fetchServers');
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
                        text: `Server ${id} Deleted`,
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
        serversDataMap: state => {
            let map = new Map();
            state.serversData.forEach(ele => {
                map.set(ele.id, ele);
            });
            return map;
        },
        currentServer: state => state.currentServer,
        allServersInfo: state => {
            let idArr = [];
            let portNumArr = [];
            return state.serversData.reduce((accumulator, _, index, array) => {
                idArr.push(array[index].id);
                portNumArr.push(array[index].attributes.parameters.port);

                return (accumulator = { idArr: idArr, portNumArr: portNumArr });
            }, []);
        },
    },
};
