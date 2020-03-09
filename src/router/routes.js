import Login from 'pages/Login';
// Sidebar components
import Dashboard from 'pages/Dashboard';
import Statistics from 'pages/Statistics';
// Slide Nav components
import Servers from 'pages/Servers';
import Services from 'pages/Services';
// Child components
import MaxScale from 'pages/MaxScale';

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
        },
    },
    // Sidebar Route
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
    // Slide Nav
    {
        path: '/dashboard/services',
        component: Services,
        meta: {
            requiresAuth: true,
        },
        name: 'services',
        isSlideNav: true,
    },
    {
        path: '/dashboard/servers',
        component: Servers,
        meta: {
            requiresAuth: true,
        },
        name: 'servers',
        isSlideNav: true,
    },
    // Child route
    {
        path: '/dashboard/maxscale',
        component: MaxScale,
        meta: {
            requiresAuth: true,
        },
        name: 'maxscale',
    },
];
