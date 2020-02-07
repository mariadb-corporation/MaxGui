import Dashboard from "../pages/Dashboard";
import Login from "pages/Login";

export const routes = [
  {
    path: "/",
    redirect: "/dashboard"
  },
  {
    path: "/dashboard",
    component: Dashboard,
    meta: {
      requiresAuth: true
    },
    name: "Dashboard",
    icon: '<i class="material-icons">dashboard</i>',
    isSideBar: true
  },
  {
    path: "/login",
    name: "login",
    component: Login,
    meta: {
      guest: true
    }
  }
];
