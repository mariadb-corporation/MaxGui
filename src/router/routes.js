import Dashboard from "../pages/Dashboard";
import Login from "pages/Login";
import Servers from "pages/Servers";
import { mdiViewDashboard, mdiEqualizer } from "@mdi/js";

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
    icon: mdiViewDashboard,
    isSideBar: true
  },
  {
    path: "/server/:id",
    component: Servers,
    meta: {
      requiresAuth: true
    },
    name: "Server"
  },
  {
    path: "/statistics",
    component: Dashboard,
    meta: {
      requiresAuth: true
    },
    name: "Statistics",
    icon: mdiEqualizer,
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
