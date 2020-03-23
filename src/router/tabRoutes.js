import Servers from 'pages/Servers'
import Services from 'pages/Services'

export default [
    // Tab Routes
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
        path: '/dashboard/servers',
        component: Servers,
        meta: {
            requiresAuth: true,
            layout: 'app-layout',
        },
        name: 'servers',
        isTabRoute: true,
    },
]
