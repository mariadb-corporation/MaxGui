import Servers from "pages/Servers";
import Login from "pages/Login";
import Server from "pages/Server";
import { mdiViewDashboard, mdiEqualizer } from "@mdi/js";

export const routes = [
  {
    path: "*",
    redirect: "/server"
  },
  {
    path: "/",
    redirect: "/server"
  },
  {
    path: "/server",
    component: Servers,
    meta: {
      requiresAuth: true
    },
    name: "Servers",
    icon: mdiViewDashboard,
    isSideBar: true
  },
  {
    path: "/server/:id",
    component: Server,
    meta: {
      requiresAuth: true
    },
    name: "Server"
  },
  {
    path: "/statistics",
    component: Servers,
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
