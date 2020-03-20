import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import store from 'store'
import { getErrorsArr } from '@/utils/helpers'

const location = window.location

let apiClient = axios.create({
    baseURL: process.env.NODE_ENV === 'production' ? `${location.origin}` : '/',
    headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
    },
})

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
