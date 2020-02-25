import Vue from 'vue';
import axios from 'axios';
import VueAxios from 'vue-axios';
const location = window.location;

const apiClient = axios.create({
    baseURL: process.env.NODE_ENV === 'production' ? `${location.origin}` : process.env.VUE_APP_API,
    headers: {
        'Content-Type': 'application/json',
    },
});

Vue.use(VueAxios, apiClient);
