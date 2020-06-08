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
import Router from 'vue-router'
import { routes } from './routes'
import { OVERLAY_LOADING } from 'store/overlayTypes'
import store from 'store'
import { delay, getCookie } from 'utils/helpers'

Vue.use(Router)

let router = new Router({
    /* 
    To use history mode, the web server needs to configure to serve it
    https://router.vuejs.org/guide/essentials/history-mode.html
   */
    // mode: 'history',
    routes: routes,
})
router.beforeEach(async (to, from, next) => {
    // Check if user is logged in
    const token_body = getCookie('token_body')
    const user = JSON.parse(localStorage.getItem('user'))
    const isLoggedIn = user ? user.isLoggedIn : null

    if (to.matched.some(record => record.meta.requiresAuth)) {
        if (token_body && isLoggedIn) {
            if (from.path === '/login') {
                store.commit('showOverlay', OVERLAY_LOADING)
                await delay(1500).then(() => {
                    return store.commit('hideOverlay'), next()
                })
            } else {
                next()
            }
        } else {
            if (from.path === '/') {
                store.commit('showOverlay', OVERLAY_LOADING)

                await delay(600).then(() => {
                    return store.commit('hideOverlay')
                })
            }

            next({
                path: '/login',
                query: { redirect: to.path },
            })
        }
    } else {
        /* user will be logged out if maxscale is restarted or maxgui is updated as jwt token will be expired
                This action checking for available update after user is successfully authenticated
                */
        console.log('checkingForUpdate')
        store.dispatch('checkingForUpdate')
        // Public route
        next()
    }
})
export default router
