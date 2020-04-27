<template>
    <rowspan-data-table
        :headers="tableHeaders"
        :data="dataProcessing"
        :sortDesc="true"
        :singleExpand="false"
        :showExpand="false"
        :numOfColsHasRowSpan="2"
        :search="searchKeyWord"
        sortBy="id"
    >
        <template v-slot:append-id>
            <span class="ml-1 color text-field-text"> ({{ allMonitors.length }}) </span>
        </template>
        <template v-slot:append-serverId>
            <span class="ml-1 color text-field-text"> ({{ allServers.length }}) </span>
        </template>
        <template v-slot:append-servicesIdArr>
            <span class="ml-1 color text-field-text"> ({{ allLinkedServices }}) </span>
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
            <div v-if="monitorState !== 'undefined'" class="d-flex align-center">
                <icon-sprite-sheet
                    size="13"
                    class="status-icon mr-1"
                    :frame="$help.monitorStateIcon(monitorState)"
                >
                    status
                </icon-sprite-sheet>
                <span>{{ $help.sliceStrAtChar(monitorState, '|', true) }} </span>
            </div>
            <span v-else />
        </template>

        <template v-slot:serverId="{ data: { item: { serverId } } }">
            <router-link :to="`/dashboard/servers/${serverId}`" class="no-underline">
                <span>{{ serverId }} </span>
            </router-link>
        </template>

        <template v-slot:serverState="{ data: { item: { serverState } } }">
            <div class="d-flex align-center">
                <icon-sprite-sheet
                    size="13"
                    class="mr-1 status-icon"
                    :frame="$help.serverStateIcon(serverState)"
                >
                    status
                </icon-sprite-sheet>
                <span>{{ serverState }}</span>
            </div>
        </template>

        <template v-slot:servicesIdArr="{ data: { item: { servicesIdArr }, i } }">
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
                <v-menu
                    :key="i"
                    transition="slide-x-transition"
                    :close-on-content-click="false"
                    open-on-hover
                    offset-x
                    content-class="shadow-drop"
                >
                    <template v-slot:activator="{ on }">
                        <span class="pointer color text-links" v-on="on">
                            {{ servicesIdArr.length }}
                            {{ $t('services').toLowerCase() }}
                        </span>
                    </template>

                    <v-sheet style="border-radius: 4px;" class="px-4 py-2">
                        <template v-for="serviceId in servicesIdArr">
                            <router-link
                                :key="serviceId"
                                :to="`/dashboard/services/${serviceId}`"
                                class="body-2 d-block no-underline"
                            >
                                <span>{{ serviceId }} </span>
                            </router-link>
                        </template>
                    </v-sheet>
                </v-menu>
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
                { text: 'Address', sortable: false, value: 'serverAddress' },
                { text: 'Port', sortable: false, value: 'serverPort' },
                { text: 'Connections', sortable: false, value: 'serverConnections' },
                { text: 'State', sortable: false, value: 'serverState' },
                { text: 'GTID', sortable: false, value: 'gtid' },
                { text: 'Services', sortable: false, value: 'servicesIdArr' },
            ],
            allLinkedServices: 0,
        }
    },
    computed: {
        ...mapGetters({
            searchKeyWord: 'searchKeyWord',
            allMonitorsMap: 'monitor/allMonitorsMap',
            allMonitors: 'monitor/allMonitors',
            allServers: 'server/allServers',
            allServersMap: 'server/allServersMap',
        }),
        dataProcessing: function() {
            if (this.allServers.length && this.allMonitorsMap.size) {
                let tableRows = []
                let allServers = this.$help.cloneDeep(this.allServers)
                let totalServices = []
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
                    totalServices = [...totalServices, ...servicesIdArr]
                    let uniqueSet = new Set(totalServices)
                    this.setTotalNumOfLinkedServices([...uniqueSet].length)
                    let row = {
                        originalHidden: false,
                        hidden: false,
                        serverId: serverId,
                        serverAddress: parameters.address,
                        serverPort: parameters.port,
                        serverConnections: statistics.connections,
                        serverState: serverState,
                        servicesIdArr: servicesIdArr,
                        gtid: gtid_current_pos,
                    }
                    if (linkedMonitors.length) {
                        // The linkedMonitors is always an array with one element -> get monitor at index 0
                        let monitorLinked = this.allMonitorsMap.get(linkedMonitors[0].id)
                        row.id = monitorLinked.id // aka monitorId
                        /*  associate with monitorID will make this column sortable
                            This is because, when two rowspan td have the same value the default sort won't recognize
                            which td belongs to which row. The rendered result just needs to display the first part,
                            separate by the |
                        */
                        row.monitorState = `${monitorLinked.id}|${monitorLinked.attributes.state}`
                    } else {
                        row.id = 'Not monitored'
                        row.monitorState = undefined
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
        setTotalNumOfLinkedServices(total) {
            this.allLinkedServices = total
        },
    },
}
</script>
