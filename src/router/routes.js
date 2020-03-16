import Login from 'pages/Login'
import sideBarRoutes from './sideBarRoutes'
import tabRoutes from './tabRoutes'
import MaxScale from 'pages/MaxScale'

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
]
