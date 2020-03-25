// Sidebar components
import Dashboard from 'pages/Dashboard'
import Statistics from 'pages/Statistics'
import Users from 'pages/Users'
import Settings from 'pages/Settings'
import tabRoutes from './tabRoutes'

export default [
    // Sidebar Routes
    {
        path: '/dashboard/servers',
        component: Dashboard,
        meta: {
            requiresAuth: true,
            keepAlive: true,
            layout: 'app-layout',
            size: 22,
            icon: '$vuetify.icons.tachometer',
        },
        name: 'dashboard',
        children: tabRoutes,
    },

    {
        path: '/statistics',
        component: Statistics,
        meta: {
            requiresAuth: true,
            layout: 'app-layout',
            size: 22,
            icon: '$vuetify.icons.reports',
        },
        name: 'statistics',
    },
    {
        path: '/users',
        component: Users,
        meta: {
            requiresAuth: true,
            layout: 'app-layout',
            size: 22,
            icon: '$vuetify.icons.users',
        },
        name: 'users',
    },
    {
        path: '/settings',
        component: Settings,
        meta: {
            requiresAuth: true,
            layout: 'app-layout',
            size: 22,
            icon: '$vuetify.icons.settings',
        },
        name: 'settings',
    },
]
