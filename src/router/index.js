import Vue from "vue";
import Router from "vue-router";
import { routes } from "./routes";
import store from "store";

Vue.use(Router);

let router = new Router({
    /* 
    To use history mode, the web server needs to configure to serve it
    https://router.vuejs.org/guide/essentials/history-mode.html
   */
    // mode: "history",
    routes: routes
});

router.beforeEach(async (to, from, next) => {
    if (to.matched.some(record => record.meta.requiresAuth)) {
        // Check if user is logged in
        console.log("localStorage", localStorage.getItem("credentials"));
        if (JSON.parse(localStorage.getItem("credentials")) == null) {
            next({
                path: "/login",
                params: { nextUrl: to.fullPath }
            });
        } else {
            next();
            await store.dispatch("fetchUser");
        }
    } else {
        next();
    }
});

export default router;
