// Sidebar components
import Dashboard from 'pages/Dashboard'
import Statistics from 'pages/Statistics'
import Users from 'pages/Users'
import Settings from 'pages/Settings'

export default [
    // Sidebar Routes
    {
        path: '/dashboard',
        component: Dashboard,
        meta: {
            requiresAuth: true,
            keepAlive: true,
        },
        name: 'dashboard',
    },

    {
        path: '/statistics',
        component: Statistics,
        meta: {
            requiresAuth: true,
        },
        name: 'statistics',
    },
    {
        path: '/users',
        component: Users,
        meta: {
            requiresAuth: true,
        },
        name: 'users',
    },
    {
        path: '/settings',
        component: Settings,
        meta: {
            requiresAuth: true,
        },
        name: 'settings',
    },
]
