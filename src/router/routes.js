import Dashboard from 'pages/Dashboard';
import Statistics from 'pages/Statistics';
import Servers from 'pages/Servers';
import Services from 'pages/Services';

import Login from 'pages/Login';

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
];
