// Sidebar components
import Dashboard from 'pages/Dashboard';
import Statistics from 'pages/Statistics';

export default [
    // Sidebar Routes
    {
        path: '/dashboard',
        component: Dashboard,
        meta: {
            requiresAuth: true,
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
        component: Statistics,
        meta: {
            requiresAuth: true,
        },
        name: 'users',
    },
];
