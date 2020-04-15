<template>
    <data-table
        :search="searchKeyWord"
        :headers="tableHeaders"
        :data="generateTableRows"
        :sortDesc="false"
        sortBy="id"
    >
        <template v-slot:append-id>
            <span class="ml-1 color text-field-text"> ({{ allServices.length }}) </span>
        </template>

        <template v-slot:user="{ data: { item: { user } } }">
            <router-link :key="user" :to="`/users/${user}`" class="no-underline">
                <span> {{ user }} </span>
            </router-link>
        </template>
        <template v-slot:servicesIdArr="{ data: { item: { servicesIdArr } } }">
            <fragment v-if="servicesIdArr.length === 0">
                <span>No service</span>
            </fragment>

            <fragment v-else-if="servicesIdArr.length < 2">
                <template v-for="serviceId in servicesIdArr">
                    <router-link
                        :key="serviceId"
                        :to="`/dashboard/services/${serviceId}`"
                        class="no-underline"
                    >
                        <span>{{ serviceId }} </span>
                    </router-link>
                </template>
            </fragment>

            <template v-else>
                <v-tooltip top transition="fade-transition">
                    <template v-slot:activator="{ on }">
                        <span class="pointer color text-links" v-on="on">
                            {{ servicesIdArr.length }}
                            {{ $t('services').toLowerCase() }}
                        </span>
                    </template>
                    <template v-for="serviceId in servicesIdArr">
                        <router-link
                            :key="serviceId"
                            :to="`/dashboard/services/${serviceId}`"
                            class="no-underline"
                        >
                            <span>{{ serviceId }} </span>
                        </router-link>
                    </template>
                </v-tooltip>
            </template>
        </template>
    </data-table>
</template>

<script>
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
import { mapGetters, mapActions } from 'vuex'

export default {
    name: 'sessions',

    data() {
        return {
            tableHeaders: [
                { text: 'ID', value: 'id' },
                { text: 'Client', value: 'user' },
                { text: 'Connected', value: 'connected' },
                { text: 'IDLE (s)', value: 'idle' },
                { text: 'Service', value: 'servicesIdArr' },
            ],
        }
    },
    computed: {
        ...mapGetters({
            searchKeyWord: 'searchKeyWord',
            allSessions: 'session/allSessions',
            allServices: 'service/allServices',
        }),

        generateTableRows: function() {
            let sessionsTest = [
                {
                    id: '8',
                    type: 'sessions',
                    relationships: {
                        services: {
                            links: {
                                self: 'http://localhost:8989/v1/services/',
                            },
                            data: [
                                {
                                    id: 'RCR-Writer',
                                    type: 'services',
                                },
                            ],
                        },
                    },
                    attributes: {
                        state: 'Session ready for routing',
                        user: 'lee',
                        remote: '::ffff:127.0.0.1',
                        connected: 'Mon Jul 17 11:10:39 2017',
                        idle: 62.899999999999999,
                    },
                    links: {
                        self: 'http://localhost:8989/v1/sessions/9',
                    },
                },
                {
                    id: '9',
                    type: 'sessions',
                    relationships: {
                        services: {
                            links: {
                                self: 'http://localhost:8989/v1/services/',
                            },
                            data: [
                                {
                                    id: 'RCR-Writer',
                                    type: 'services',
                                },
                            ],
                        },
                    },
                    attributes: {
                        state: 'Session ready for routing',
                        user: 'maxuser',
                        remote: '::ffff:127.0.0.1',
                        connected: 'Mon Jul 17 11:10:39 2017',
                        idle: 62.899999999999999,
                    },
                    links: {
                        self: 'http://localhost:8989/v1/sessions/9',
                    },
                },
                {
                    id: '10',
                    type: 'sessions',
                    relationships: {
                        services: {
                            links: {
                                self: 'http://localhost:8989/v1/services/',
                            },
                            data: [
                                {
                                    id: 'RCR-Router',
                                    type: 'services',
                                },
                            ],
                        },
                    },
                    attributes: {
                        state: 'Session ready for routing',
                        user: 'skysql',
                        remote: '::ffff:127.0.0.1',
                        connected: 'Mon Jul 17 11:11:37 2017',
                        idle: 5.2000000000000002,
                    },
                    links: {
                        self: 'http://localhost:8989/v1/sessions/10',
                    },
                },
            ]
            //   if (this.allSessions && this.allServices) {
            if (sessionsTest.length) {
                let itemsArr = []

                let allSessions = this.$help.cloneDeep(sessionsTest)
                for (let n = allSessions.length - 1; n >= 0; --n) {
                    /**
                     * @typedef {Object} row
                     * @property {Number} row.id - sessions's id
                     * @property {String} row.user - sessions's user
                     * @property {String} row.connected - sessions's sessions
                     * @property {Number} row.idle - idle (seconds)
                     * @property {Array} row.servicesIdArr - Sessions's services relationships
                     */
                    const {
                        id,
                        attributes: { idle, connected, user, remote },
                        relationships: { services: { data: allServices = [] } = {} },
                    } = allSessions[n] || {}

                    let serversList = allServices ? allServices.map(item => `${item.id}`) : []

                    let row = {
                        id: id,
                        user: `${user}@${remote}`,
                        connected: connected,
                        idle: idle,
                        servicesIdArr: serversList,
                    }
                    itemsArr.push(row)
                }
                return itemsArr
            }
            return []
        },
    },

    methods: {
        serviceStateIcon(monitorState) {
            if (monitorState.includes('Started')) return 2
            if (monitorState.includes('Stopped')) return 0
            else return ''
        },
    },
}
</script>
