import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import store from 'store'
import { getErrorsArr } from '@/utils/helpers'

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
apiClient.interceptors.response.use(
    response => {
        return response
    },
    error => {
        if (error.response.status === 401) {
            store.dispatch('logout')
            return Promise.reject(error)
        } else {
            store.commit('showMessage', {
                text: getErrorsArr(error),
                type: 'error',
            })

            return Promise.reject(error)
        }
    }
)
Vue.use(VueAxios, apiClient)
