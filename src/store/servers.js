import Vue from 'vue';

export default {
    state: {
        serversData: [],
        credentials: JSON.parse(sessionStorage.getItem('credentials')),
    },
    mutations: {
        /**
         * @param {Array} payload serversData array
         */
        setServers(state, payload) {
            state.serversData = payload;
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
                let errorsArr = [error];
                if (error.response.data) {
                    errorsArr = error.response.data.errors.map(ele => `${ele.detail}`);
                }
                await commit('showMessage', {
                    text: errorsArr,
                    type: 'error',
                });
            }
        },
        /**
         * @param {Object} serverData Server object
         * @param {String} serverData.mode Mode to perform async request POST or Patch
         * @param {String} serverData.id Id of the server
         * @param {Object} serverData.relationships Relationships of the server
         * @param {Object} serverData.parameters Parameters for the server
         */
        async createOrUpdateServer({ commit, dispatch, state }, serverData) {
            const auth = {
                auth: state.credentials,
            };
            const payload = {
                data: {
                    id: serverData.id,
                    type: 'servers',
                    attributes: { parameters: serverData.parameters },
                    relationships: serverData.relationships,
                },
            };
            try {
                let res;
                let message;
                switch (serverData.mode) {
                    case 'post':
                        res = await Vue.axios.post(`/v1/servers/`, payload, auth);
                        message = [`Server ${serverData.id} is created`];
                        break;
                    case 'patch':
                        res = await Vue.axios.patch(`/v1/servers/${serverData.id}`, payload, auth);
                        message = [`Server ${serverData.id} is updated`];
                        break;
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
                let errorsArr = [error];
                if (error.response.data) {
                    errorsArr = error.response.data.errors.map(ele => `${ele.detail}`);
                }
                await commit('showMessage', {
                    text: errorsArr,
                    type: 'error',
                });
            }
        },
        /**
         * @param {String} id id of the server
         */
        async deleteServerById({ dispatch, commit, state }, id) {
            try {
                let res = await Vue.axios.delete(`/v1/servers/${id}`, {
                    auth: state.credentials,
                });
                // response ok
                if (res.status === 204) {
                    await dispatch('fetchServers');
                    await commit('showMessage', {
                        text: [`Server ${id} is deleted`],
                        type: 'success',
                    });
                }
            } catch (error) {
                let errorsArr = [error];
                if (error.response.data) {
                    errorsArr = error.response.data.errors.map(ele => `${ele.detail}`);
                }
                await commit('showMessage', {
                    text: errorsArr,
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
