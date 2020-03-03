import Dashboard from 'pages/Dashboard';
import Statistics from 'pages/Statistics';
import Login from 'pages/Login';
import { mdiViewDashboard, mdiEqualizer } from '@mdi/js';

export const routes = [
    // {
    //     path: '*',
    //     name: 'default',
    //     redirect: '/dashboard',
    // },
    {
        path: '/dashboard',
        component: Dashboard,
        meta: {
            requiresAuth: true,
        },
        name: 'dashboard',
        icon: mdiViewDashboard,
        isSideBar: true,
    },
    {
        path: '/statistics',
        component: Statistics,
        meta: {
            requiresAuth: true,
        },
        name: 'statistics',
        icon: mdiEqualizer,
        isSideBar: true,
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
