import Vue from "vue";
import Router from "vue-router";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
Vue.use(Router);

export default new Router({
  mode: "history",
  routes: [
    {
      path: "/",
      component: Dashboard
    },
    {
      path: "/login",
      component: Login
    }
  ]
});
