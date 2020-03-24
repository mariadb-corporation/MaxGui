import Login from 'pages/Login'
import sideBarRoutes from './sideBarRoutes'
import tabRoutes from './tabRoutes'
import MaxScale from 'pages/MaxScale'
import ServiceRead from 'pages/Services/ServicesTable/ServiceRead'
import ServerRead from 'pages/Servers/ServersTable/ServerRead'
import MonitorRead from 'pages/Monitors/MonitorsTable/MonitorRead'

export const routes = [
    {
        path: '*',
        name: 'default',
        redirect: '/dashboard',
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
    ...tabRoutes,
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
        component: ServiceRead,
        meta: {
            requiresAuth: true,
            layout: 'app-layout',
        },
        name: 'service',
    },
    {
        path: '/dashboard/server/:id',
        component: ServerRead,
        meta: {
            requiresAuth: true,
            layout: 'app-layout',
        },
        name: 'server',
    },
    {
        path: '/dashboard/monitor/:id',
        component: MonitorRead,
        meta: {
            requiresAuth: true,
            layout: 'app-layout',
        },
        name: 'monitor',
    },
]
