import Vue from 'vue';
import axios from 'axios';
import VueAxios from 'vue-axios';
const location = window.location;
const user = JSON.parse(sessionStorage.getItem('user'));
let token = user && user.token;
let apiClient = axios.create({
    baseURL: process.env.NODE_ENV === 'production' ? `${location.origin}` : process.env.VUE_APP_API,
    headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhZG1pbiIsImV4cCI6MTU4MzE4NjkzOCwiaWF0IjoxNTgzMTU4MTM4LCJpc3MiOiJtYXhzY2FsZSJ9.9at_w9cP0W0e0NvOci1W7FK-p0GUwvAToCFG9fcYVqU`,
    },
});
// // Add a request interceptor
// apiClient.interceptors.request.use(
//     config => {
//         // Do something before request is sent

//         config.headers['Authorization'] = `Basic ${token}`;

//         return config;
//     },
//     error => Promise.reject(error)
// );

Vue.use(VueAxios, apiClient);
// "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhZG1pbiIsImV4cCI6MTU4MzE4NjkzOCwiaWF0IjoxNTgzMTU4MTM4LCJpc3MiOiJtYXhzY2FsZSJ9.9at_w9cP0W0e0NvOci1W7FK-p0GUwvAToCFG9fcYVqU"
// 'X-Frame-Options': 'deny',
//         'X-XSS-Protection': '1; mode=?block',
//         'X-Content-Type-Options': 'nosniff',
//         'Referrer-Policy': 'same-origin',
