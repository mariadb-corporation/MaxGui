import Servers from 'pages/Servers';
import Services from 'pages/Services';

export default [
    // Tab Routes
    {
        path: '/dashboard/services',
        component: Services,
        meta: {
            requiresAuth: true,
        },
        name: 'services',
        isTabRoute: true,
    },
    {
        path: '/dashboard/servers',
        component: Servers,
        meta: {
            requiresAuth: true,
        },
        name: 'servers',
        isTabRoute: true,
    },
];
