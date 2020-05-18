/*
 * Copyright (c) 2020 MariaDB Corporation Ab
 *
 * Use of this software is governed by the Business Source License included
 * in the LICENSE.TXT file and at www.mariadb.com/bsl11.
 *
 * Change Date: 2024-07-01
 *
 * On the date above, in accordance with the Business Source License, use
 * of this software will be governed by version 2 or later of the General
 * Public License.
 */
import Login from 'pages/Login'
import sideBarRoutes from './sideBarRoutes'
import ServiceDetail from 'pages/Services/ServiceDetail'
import ServerDetail from 'pages/Servers/ServerDetail'
import MonitorDetail from 'pages/Monitors/MonitorDetail'
import NotFound404 from 'pages/NotFound404'

export const routes = [
    {
        path: '/',
        redirect: '/dashboard/servers/',
    },
    {
        path: '*',
        redirect: '/404',
    },

    {
        path: '/login',
        name: 'login',
        component: Login,
        meta: {
            requiresAuth: false,
            guest: true,
            layout: 'no-layout',
        },
    },
    ...sideBarRoutes,
    // route but doesn't include in tabRoutes or sideBarRoutes

    {
        path: '/dashboard/services/:id',
        component: ServiceDetail,
        meta: {
            requiresAuth: true,
            layout: 'app-layout',
        },
        name: 'service',
    },
    {
        path: '/dashboard/servers/:id',
        component: ServerDetail,
        meta: {
            requiresAuth: true,
            layout: 'app-layout',
        },
        name: 'server',
    },
    {
        path: '/dashboard/monitors/:id',
        component: MonitorDetail,
        meta: {
            requiresAuth: true,
            layout: 'app-layout',
        },
        name: 'monitor',
    },
    {
        path: '/404',
        name: 'not-found',
        component: NotFound404,
        meta: {
            requiresAuth: true,
            layout: 'app-layout',
        },
    },
]
