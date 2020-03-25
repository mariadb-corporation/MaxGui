import Login from 'pages/Login'
import sideBarRoutes from './sideBarRoutes'
import MaxScale from 'pages/MaxScale'
import ServiceDetail from 'pages/Services/ServiceDetail'
import ServerDetail from 'pages/Servers/ServerDetail'
import MonitorDetail from 'pages/Monitors/MonitorDetail'

export const routes = [
    {
        path: '*',
        name: 'default',
        redirect: '/dashboard/servers',
    },
    {
        path: '/login',
        name: 'login',
        component: Login,
        meta: {
            requiresAuth: false,
            guest: true,
            layout: 'no-layout',
        },
    },
    ...sideBarRoutes,

    // route but doesn't include in tabRoutes or sideBarRoutes
    {
        path: '/dashboard/maxscale',
        component: MaxScale,
        meta: {
            requiresAuth: true,
            layout: 'app-layout',
        },
        name: 'maxscale',
    },
    {
        path: '/dashboard/service/:id',
        component: ServiceDetail,
        meta: {
            requiresAuth: true,
            layout: 'app-layout',
        },
        name: 'service',
    },
    {
        path: '/dashboard/server/:id',
        component: ServerDetail,
        meta: {
            requiresAuth: true,
            layout: 'app-layout',
        },
        name: 'server',
    },
    {
        path: '/dashboard/monitor/:id',
        component: MonitorDetail,
        meta: {
            requiresAuth: true,
            layout: 'app-layout',
        },
        name: 'monitor',
    },
]
