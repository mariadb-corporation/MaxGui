import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
const location = window.location
const user = JSON.parse(sessionStorage.getItem('user'))
let token = user && user.token

let apiClient = axios.create({
    baseURL: process.env.NODE_ENV === 'production' ? `${location.origin}` : process.env.VUE_APP_API,
    headers: {
        'Content-Type': 'application/json',
    },
})

// Add a request interceptor
apiClient.interceptors.request.use(
    config => {
        // Do something before request is sent
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`
        }
        return config
    },
    error => Promise.reject(error)
)

Vue.use(VueAxios, apiClient)
