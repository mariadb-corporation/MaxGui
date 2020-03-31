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
import MaxScale from 'pages/MaxScale'
import ServiceDetail from 'pages/Services/ServiceDetail'
import ServerDetail from 'pages/Servers/ServerDetail'
import MonitorDetail from 'pages/Monitors/MonitorDetail'

export const routes = [
    {
        path: '*',
        name: 'default',
        redirect: '/dashboard/servers',
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
        path: '/dashboard/maxscale',
        component: MaxScale,
        meta: {
            requiresAuth: true,
            layout: 'app-layout',
        },
        name: 'maxscale',
    },
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
]
