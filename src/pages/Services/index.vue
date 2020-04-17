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

        <template v-slot:id="{ data: { item: { id } } }">
            <router-link :key="id" :to="`/dashboard/services/${id}`" class="no-underline">
                <span> {{ id }}</span>
            </router-link>
        </template>
        <template v-slot:state="{ data: { item: { state } } }">
            <icon-sprite-sheet size="13" class="status-icon" :frame="$help.serviceStateIcon(state)">
                status
            </icon-sprite-sheet>
        </template>
        <template v-slot:servers="{ data: { item: { servers }, i } }">
            <fragment v-if="servers === 'undefined'">
                <span>{{ servers }}</span>
            </fragment>

            <fragment v-else-if="servers.length < 3">
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

            <v-menu
                v-else
                :key="i"
                transition="slide-x-transition"
                :close-on-content-click="false"
                open-on-hover
                offset-x
            >
                <template v-slot:activator="{ on }">
                    <span class="pointer color text-links" v-on="on">
                        {{ servers.length }}
                        {{ $t('servers').toLowerCase() }}
                    </span>
                </template>

                <v-sheet style="border-radius: 4px;" class="px-4 py-2">
                    <template v-for="serverId in servers">
                        <router-link
                            :key="serverId"
                            :to="`/dashboard/servers/${serverId}`"
                            class="body-2 d-block no-underline"
                        >
                            <span>{{ serverId }} </span>
                        </router-link>
                    </template>
                </v-sheet>
            </v-menu>
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
                { text: 'Status', value: 'state', align: 'center' },
                { text: 'Router', value: 'router' },
                { text: 'Current Sessions', value: 'connections' },
                { text: 'Total Sessions', value: 'total_connections' },
                { text: 'Servers', value: 'servers' },
            ],
            isloading: true,
        }
    },
    computed: {
        ...mapGetters({
            searchKeyWord: 'searchKeyWord',
            allServices: 'service/allServices',
        }),

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
                        relationships: { servers: { data: allServers = undefined } = {} },
                    } = allServices[n] || {}

                    let serversList =
                        allServers !== undefined ? allServers.map(item => `${item.id}`) : allServers
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
}
</script>
