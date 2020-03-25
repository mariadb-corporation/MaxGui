import Servers from 'pages/Servers'
import Services from 'pages/Services'
import Monitors from 'pages/Monitors'

export default [
    // Tab Routes
    {
        path: '/dashboard/servers',
        component: Servers,
        meta: {
            requiresAuth: true,
            layout: 'app-layout',
        },
        name: 'servers',
        isTabRoute: true,
    },
    {
        path: '/dashboard/services',
        component: Services,
        meta: {
            requiresAuth: true,
            layout: 'app-layout',
        },
        name: 'services',
        isTabRoute: true,
    },

    {
        path: '/dashboard/monitors',
        component: Monitors,
        meta: {
            requiresAuth: true,
            layout: 'app-layout',
        },
        name: 'monitors',
        isTabRoute: true,
    },
]
