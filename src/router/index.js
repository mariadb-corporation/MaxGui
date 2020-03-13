import Vue from 'vue'
import Router from 'vue-router'
import { routes } from './routes'

Vue.use(Router)

let router = new Router({
    /* 
    To use history mode, the web server needs to configure to serve it
    https://router.vuejs.org/guide/essentials/history-mode.html
   */
    // mode: "history",
    routes: routes,
})
router.beforeEach(async (to, from, next) => {
    // Check if user is logged in
    const user = JSON.parse(sessionStorage.getItem('user'))
    const token = user ? user.token : null

    if (to.matched.some(record => record.meta.requiresAuth)) {
        if (token === null) {
            next({
                path: '/login',
                params: { nextUrl: to.fullPath },
            })
        } else {
            next()
        }
    } else {
        // console.log("public route", to);
        // If user is already authenticated redirect to dashboard
        token ? next('/dashboard') : next()
    }
})
export default router
