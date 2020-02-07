import Vue from "vue";
import Router from "vue-router";
import routes from "./routes";
import store from "store";

Vue.use(Router);

let router = new Router({
  mode: "history",
  routes: routes
});

router.beforeEach(async (to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // Check if user is logged in
    if (localStorage.getItem("isUserLogin") == null) {
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
