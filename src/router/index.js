import Vue from 'vue';
import Router from 'vue-router';
import { routes } from './routes';
import store from 'store';

Vue.use(Router);

let router = new Router({
    /* 
    To use history mode, the web server needs to configure to serve it
    https://router.vuejs.org/guide/essentials/history-mode.html
   */
    // mode: "history",
    routes: routes,
});
router.beforeEach(async (to, from, next) => {
    // Check if user is logged in
    const cookies = JSON.parse(sessionStorage.getItem('credentials'));
    const token = cookies ? cookies.token : null;

    if (to.matched.some(record => record.meta.requiresAuth)) {
        if (token === null) {
            next({
                path: '/login',
                params: { nextUrl: to.fullPath },
            });
        } else {
            // console.log("user is authenticated", to);
            next();
            await store.dispatch('fetchUser');
        }
    } else {
        // console.log("public route", to);
        // If user is already authenticated redirect to dashboard
        token ? next('/dashboard') : next();
    }
});
export default router;
