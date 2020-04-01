<template>
    <rowspan-data-table
        :headers="tableHeaders"
        :data="dataProcessing"
        :sortDesc="true"
        :singleExpand="false"
        :showExpand="false"
        :numOfColsHasRowSpan="2"
        :search="searchKeyWord"
        :loading="!isloaded"
        sortBy="id"
    >
        <template v-slot:append-id>
            <span class="ml-1 color text-field-text"> ({{ allMonitors.length }}) </span>
        </template>

        <template v-slot:id="{ data: { item: { id } } }">
            <router-link
                v-if="id !== 'Not monitored'"
                :to="`/dashboard/monitors/${id}`"
                class="no-underline"
            >
                <span class="font-weight-bold">{{ id }} </span>
            </router-link>
            <span v-else>{{ id }} </span>
        </template>

        <template v-slot:monitorState="{ data: { item: { monitorState } } }">
            <fragment v-if="monitorState !== 'null'">
                <icon-sprite-sheet
                    size="13"
                    class="status-icon"
                    :frame="monitorStateIcon(monitorState)"
                >
                    status
                </icon-sprite-sheet>
                <span>{{ monitorState }} </span>
            </fragment>
        </template>

        <template v-slot:serverId="{ data: { item: { serverId } } }">
            <fragment v-if="!serverId">
                <span>Null</span>
            </fragment>
            <router-link v-else :to="`/dashboard/servers/${serverId}`" class="no-underline">
                <span>{{ serverId }} </span>
            </router-link>
        </template>

        <template v-slot:serverStatus="{ data: { item: { serverStatus } } }">
            <icon-sprite-sheet size="13" class="status-icon" :frame="serverStateIcon(serverStatus)">
                status
            </icon-sprite-sheet>
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
    </rowspan-data-table>
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
                { text: `Monitor`, value: 'id' },
                { text: 'State', value: 'monitorState' },
                { text: 'Servers', sortable: false, value: 'serverId' },
                { text: 'Status', sortable: false, value: 'serverStatus' },
                { text: 'Address', sortable: false, value: 'serverAddress' },
                { text: 'Port', sortable: false, value: 'serverPort' },
                { text: 'Connections', sortable: false, value: 'serverConnections' },
                { text: 'State', sortable: false, value: 'serverState' },
                { text: 'GTID', sortable: false, value: 'gtid' },
                { text: 'Services', sortable: false, value: 'servicesIdArr' },
            ],
        }
    },
    computed: {
        ...mapGetters([
            'allMonitorsMap',
            'allServers',
            'allServersMap',
            'allMonitors',
            'searchKeyWord',
        ]),
        isloaded: function() {
            if (this.allServers.length && this.allMonitorsMap.size) {
                return true
            }
            return false
        },
        dataProcessing: function() {
            if (this.isloaded) {
                let tableRows = []
                let allServers = this.$_.cloneDeep(this.allServers)

                for (let index = 0; index < allServers.length; ++index) {
                    const {
                        id: serverId,
                        attributes: {
                            state: serverState,
                            parameters,
                            statistics,
                            gtid_current_pos,
                        },
                        relationships: {
                            services: { data: allServices = [] } = {},
                            monitors: { data: linkedMonitors = [] } = {},
                        },
                    } = allServers[index]
                    let servicesIdArr = allServices ? allServices.map(item => `${item.id}`) : []

                    let row = {
                        originalHidden: false,
                        hidden: false,
                        serverId: serverId,
                        serverStatus: serverState,
                        serverAddress: parameters.address,
                        serverPort: parameters.port,
                        serverConnections: statistics.connections,
                        serverState: serverState,
                        servicesIdArr: servicesIdArr,
                        gtid: gtid_current_pos ? gtid_current_pos : 'null',
                    }
                    if (linkedMonitors.length) {
                        // The linkedMonitors is always an array with one element -> get monitor at index 0
                        let monitorLinked = this.allMonitorsMap.get(linkedMonitors[0].id)
                        row.id = monitorLinked.id // aka monitorId
                        row.monitorState = monitorLinked.attributes.state
                    } else {
                        row.id = 'Not monitored'
                        row.monitorState = 'null' // using 'null' won't break filter result in table
                    }
                    tableRows.push(row)
                }
                // get all unique monitorId
                let uniqueSet = new Set(tableRows.map(item => item.id))
                let monitorIds = [...uniqueSet]
                let groupByMonitors = this.$help.groupBy(tableRows, 'id')
                for (let i = 0; i < monitorIds.length; ++i) {
                    let group = groupByMonitors[`${monitorIds[i]}`]

                    for (let n = 0; n < group.length; ++n) {
                        group[n].alterableRowspan = group.length
                        group[n].originalRowSpan = group.length
                        if (n !== 0) {
                            group[n].originalHidden = true
                            group[n].hidden = true
                        }
                    }
                }

                return tableRows
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
