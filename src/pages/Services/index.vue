<template>
    <data-table :headers="tableHeaders" :data="generateTableRows" :sortDesc="false" sortBy="id">
        <template v-slot:append-id>
            <span class="ml-1 color text-field-text"> ({{ allServices.length }}) </span>
        </template>

        <template v-slot:id="{ data: { item: { id } } }">
            <router-link :key="id" :to="`/dashboard/services/${id}`" class="no-underline">
                <span> {{ id }}</span>
            </router-link>
        </template>
        <template v-slot:state="{ data: { item: { state } } }">
            <icon-sprite-sheet size="13" class="status-icon" :frame="serviceStateIcon(state)">
                status
            </icon-sprite-sheet>
        </template>
        <template v-slot:servers="{ data: { item: { servers } } }">
            <fragment v-if="servers.length === 0">
                <span>n/a </span>
            </fragment>

            <fragment v-else-if="servers.length < 4">
                <template v-for="(serverId, i) in servers">
                    <router-link
                        :key="serverId"
                        :to="`/dashboard/servers/${serverId}`"
                        class="no-underline"
                    >
                        <span> {{ serverId }}{{ i !== servers.length - 1 ? ', ' : '' }} </span>
                    </router-link>
                </template>
            </fragment>

            <template v-else>
                <v-tooltip top transition="fade-transition">
                    <template v-slot:activator="{ on }">
                        <span class="pointer color text-links" v-on="on">
                            {{ servers.length }}
                            {{ $t('servers').toLowerCase() }}
                        </span>
                    </template>
                    <template v-for="serverId in servers">
                        <router-link
                            :key="serverId"
                            :to="`/dashboard/servers/${serverId}`"
                            class="no-underline"
                        >
                            <span>{{ serverId }} </span>
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
    name: 'services',

    data() {
        return {
            tableHeaders: [
                { text: 'Service', value: 'id' },
                { text: 'Status', value: 'state' },
                { text: 'Router', value: 'router' },
                { text: 'Connections', value: 'connections' },
                { text: 'Total Connections', value: 'total_connections' },
                { text: 'Servers', value: 'servers' },
            ],
            isloading: true,
        }
    },
    computed: {
        ...mapGetters(['allServices']),
        /**
         * @return {Array} An array of objects
         */
        generateTableRows: function() {
            /**
             * @param {Array} itemsArr
             *  Elements are {Object} row
             */
            if (this.allServices) {
                let itemsArr = []
                const { allServices } = this
                for (let n = allServices.length - 1; n >= 0; --n) {
                    /**
                     * @typedef {Object} row
                     * @property {String} row.id - Service's name
                     * @property {String} row.router - Server's address
                     * @property {Number} row.total_connections - Server's address
                     * @property {Number} row.connections - Number of connections to the server
                     * @property {Array} row,servers - Server's state
                     */
                    const {
                        id,
                        attributes: { state, router, connections, total_connections },
                        relationships: { servers: { data: allServers = [] } = {} },
                    } = allServices[n] || {}

                    let serversList = allServers ? allServers.map(item => `${item.id}`) : []
                    let row = {
                        id: id,
                        state: state,
                        router: router,
                        connections: connections,
                        total_connections: total_connections,
                        servers: serversList,
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
