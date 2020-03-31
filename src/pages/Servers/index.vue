<template>
    <v-row class="mt-0">
        <v-col class="pt-0" cols="12">
            <rowspan-data-table
                :headers="tableHeaders"
                :data="getData"
                :sortDesc="false"
                :singleExpand="false"
                :showExpand="false"
                :numOfColsHasRowSpan="2"
                :search="searchKeyWord"
                :loading="!getData.length"
                sortBy="id"
            >
                <template v-slot:id="{ data: { item: { id } } }">
                    <router-link :to="`/dashboard/monitor/${id}`" class="no-underline">
                        <span class="font-weight-bold">{{ id }} </span>
                    </router-link>
                </template>
                <template v-slot:monitorState="{ data: { item: { monitorState } } }">
                    <icon-sprite-sheet
                        size="13"
                        class="status-icon"
                        :frame="monitorStateIcon(monitorState)"
                    >
                        status
                    </icon-sprite-sheet>
                    <span>{{ monitorState }} </span>
                </template>
                <template v-slot:serverId="{ data: { item: { serverId } } }">
                    <fragment v-if="!serverId">
                        <span>n/a </span>
                    </fragment>
                    <router-link v-else :to="`/dashboard/server/${serverId}`" class="no-underline">
                        <span>{{ serverId }} </span>
                    </router-link>
                </template>
                <template v-slot:serverStatus="{ data: { item: { serverStatus } } }">
                    <icon-sprite-sheet
                        size="13"
                        class="status-icon"
                        :frame="serverStateIcon(serverStatus)"
                    >
                        status
                    </icon-sprite-sheet>
                </template>
                <template v-slot:servicesIdArr="{ data: { item: { servicesIdArr } } }">
                    <fragment v-if="servicesIdArr.length === 0">
                        <span>n/a </span>
                    </fragment>

                    <fragment v-else-if="servicesIdArr.length < 2">
                        <template v-for="serviceId in servicesIdArr">
                            <router-link
                                :key="serviceId"
                                :to="`/dashboard/service/${serviceId}`"
                                class="no-underline"
                            >
                                <span>{{ serviceId }} </span>
                            </router-link>
                        </template>
                    </fragment>

                    <template v-else>
                        <v-tooltip left transition="fade-transition">
                            <template v-slot:activator="{ on }">
                                <span class="pointer color text-links" v-on="on">
                                    {{ servicesIdArr.length }}
                                    {{ $t('services').toLowerCase() }}
                                </span>
                            </template>
                            <template v-for="serviceId in servicesIdArr">
                                <router-link
                                    :key="serviceId"
                                    :to="`/dashboard/service/${serviceId}`"
                                    class="no-underline"
                                >
                                    <span>{{ serviceId }} </span>
                                </router-link>
                            </template>
                        </v-tooltip>
                    </template>
                </template>
            </rowspan-data-table>
        </v-col>
    </v-row>
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

import RowspanDataTable from 'components/RowspanDataTable'
export default {
    components: {
        RowspanDataTable,
    },
    data() {
        return {
            tableHeaders: [
                { text: 'Monitor', value: 'id' },
                { text: 'State', value: 'monitorState' },

                { text: 'Servers', sortable: false, value: 'serverId' },
                { text: 'Status', sortable: false, value: 'serverStatus' },
                { text: 'Address', sortable: false, value: 'serverAddress' },
                { text: 'Port', sortable: false, value: 'serverPort' },
                { text: 'Connections', sortable: false, value: 'serverConnections' },
                { text: 'State', sortable: false, value: 'serverState' },
                { text: 'Services', sortable: false, value: 'servicesIdArr' },
            ],
        }
    },
    computed: {
        ...mapGetters(['serversDataMap', 'allMonitors', 'searchKeyWord']),

        getData: function() {
            if (this.allMonitors) {
                let monitorInfo = []
                /*  First loop through monitors to get associated(linked) servers ID
                    and monitor's id and monitor's state
                */
                let allMonitors = this.$_.cloneDeep(this.allMonitors)
                for (let n = 0; n < allMonitors.length; ++n) {
                    const {
                        id: monitorId,
                        attributes: { state: monitorState },
                        relationships: { servers: { data: linkedServers = [] } = {} },
                    } = allMonitors[n]
                    // Get array of obj linked servers based on linkedServers array of IDs
                    let serversArr = []
                    if (linkedServers.length) {
                        for (let l = 0; l < linkedServers.length; ++l) {
                            let serversLinked = this.serversDataMap.get(linkedServers[l].id)
                            serversArr.push(serversLinked)
                        }
                    }

                    /*  Loop through serversArr of objects to add value to row*/
                    if (serversArr.length) {
                        let lastIndex = serversArr.length - 1
                        for (let index = 0; index < serversArr.length; ++index) {
                            const {
                                id: serverId,
                                attributes: { state: serverState, parameters, statistics },
                                relationships: { services: { data: servicesData = [] } = {} },
                            } = serversArr[index]
                            let servicesIdArr = servicesData
                                ? servicesData.map(item => `${item.id}`)
                                : []
                            let row = {
                                id: monitorId,
                                monitorState: monitorState,
                                originalRowSpan: serversArr.length,
                                alterableRowspan: serversArr.length,
                                originalHidden: false,
                                hidden: false,
                                serverId: serverId,
                                serverStatus: serverState,
                                serverAddress: parameters.address,
                                serverPort: parameters.port,
                                serverConnections: statistics.connections,
                                serverState: serverState,
                                servicesIdArr: servicesIdArr,
                            }
                            /*  only visible the td alterableRowspan on the first index, others row needs to have
                                the data but don't neccessary to visible,
                                this makes alterableRowspan work and preserves searching function
                            */
                            if (index !== 0) {
                                row.hidden = true
                                row.originalHidden = true
                            }

                            monitorInfo.push(row)
                        }
                    } else {
                        let row = {
                            id: monitorId,
                            monitorState: monitorState,
                            originalRowSpan: 1,
                            alterableRowspan: 1,
                            originalHidden: false,
                            hidden: false,
                            serverId: null,
                            serverStatus: null,
                            serverAddress: null,
                            serverPort: null,
                            serverConnections: null,
                            serverState: null,
                            servicesIdArr: [],
                        }
                        monitorInfo.push(row)
                    }
                }
                return monitorInfo
            }
            return []
        },
    },

    methods: {
        ...mapActions(['destroyServer']),
        monitorStateIcon(monitorState) {
            if (monitorState.includes('Running')) return 2
            if (monitorState.includes('Stopped')) return 1
            else return ''
        },
        serverStateIcon(serverStatus) {
            if (serverStatus) {
                if (serverStatus.includes('Running')) return 2
                if (serverStatus.includes('Down')) return 0
                else return ''
            } else return ''
        },
    },
}
</script>
