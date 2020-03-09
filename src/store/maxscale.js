import Vue from 'vue';
import { getErrorsArr } from '@/utils/helpers';

export default {
    state: {
        maxscaleDetails: {},
    },
    mutations: {
        /**
         * @param {Object} payload setMaxScaleDetails array
         */
        setMaxScaleDetails(state, payload) {
            state.maxscaleDetails = payload;
        },
    },
    actions: {
        async fetchMaxScaleDetails({ commit, state }) {
            try {
                let res = await Vue.axios.get(`/v1/maxscale`);
                await commit('setMaxScaleDetails', res.data.data.attributes);
            } catch (error) {
                await commit('showMessage', {
                    text: getErrorsArr(error),
                    type: 'error',
                });
            }
        },
    },
    getters: {
        maxscaleDetails: state => state.maxscaleDetails,
    },
};
