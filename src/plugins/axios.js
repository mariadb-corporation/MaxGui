/*
 * Copyright (c) 2020 MariaDB Corporation Ab
 *
 * Use of this software is governed by the Business Source License included
 * in the LICENSE.TXT file and at www.mariadb.com/bsl11.
 *
 * Change Date: 2024-07-01
 *
 * On the date above, in accordance with the Business Source License, use
 * of this software will be governed by version 2 or later of the General
 * Public License.
 */
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

apiClient.interceptors.request.use(
    config => {
        const user = JSON.parse(sessionStorage.getItem('user'))
        let token = user && user.token
        // Add token before request is sent
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
            delete axios.defaults.headers.common['Authorization']

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
