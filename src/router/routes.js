import Dashboard from 'pages/Dashboard';
import Statistics from 'pages/Statistics';
import Login from 'pages/Login';

export const routes = [
    {
        path: '*',
        name: 'default',
        redirect: '/dashboard',
    },
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
        path: '/login',
        name: 'login',
        component: Login,
        meta: {
            requiresAuth: false,
            guest: true,
        },
    },
];
