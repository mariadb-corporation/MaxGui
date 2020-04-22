<template>
    <v-row>
        <v-col class="py-0 my-0" cols="4">
            <v-row class="pa-0 ma-0">
                <!-- SERVER TABLE -->
                <v-col cols="12" class="pa-0 ma-0">
                    <details-table-wrapper
                        :toggleOnClick="() => (showServers = !showServers)"
                        :toggleVal="showServers"
                        title="servers"
                        :titleInfo="serviceRelationshipServerTableData.length"
                        :onAddClick="() => (addServerDialog = true)"
                        addBtnText="addServer"
                    >
                        <template v-slot:table>
                            <data-table
                                :headers="serversTableHeader"
                                :data="serviceRelationshipServerTableData"
                                :sortDesc="false"
                                :noDataText="$t('noServer')"
                                sortBy="id"
                                :loading="loading"
                                :showActionsOnHover="true"
                            >
                                <template v-slot:id="{ data: { item: { id } } }">
                                    <router-link
                                        :key="id"
                                        :to="`/dashboard/servers/${id}`"
                                        class="no-underline"
                                    >
                                        <span> {{ id }} </span>
                                    </router-link>
                                </template>
                                <template v-slot:state="{ data: { item: { state } } }">
                                    <icon-sprite-sheet
                                        size="13"
                                        class="status-icon"
                                        :frame="$help.serverStateIcon(state)"
                                    >
                                        status
                                    </icon-sprite-sheet>
                                </template>
                                <template v-slot:actions="{ data: { item } }">
                                    <v-btn icon @click="onRelationShipTypeDelete('server', item)">
                                        <v-icon size="20" color="error">
                                            $vuetify.icons.unlink
                                        </v-icon>
                                    </v-btn>
                                </template>
                            </data-table>
                        </template>
                    </details-table-wrapper>
                </v-col>
                <!-- Filter TABLE -->
                <v-col cols="12" class="pa-0 mt-4">
                    <details-table-wrapper
                        :toggleOnClick="() => (showFilter = !showFilter)"
                        :toggleVal="showFilter"
                        title="filters"
                        :titleInfo="filtersLinked.length"
                        :onAddClick="() => (addFilterDialog = true)"
                        addBtnText="addFilter"
                    >
                        <template v-slot:table>
                            <data-table
                                :headers="filterTableHeader"
                                :data="filtersLinked"
                                :sortDesc="false"
                                :noDataText="$t('noFilter')"
                                :draggable="true"
                                :dragReorder="filterDragReorder"
                                :loading="loading"
                                :showActionsOnHover="true"
                                :hasOrderNumber="true"
                            >
                                <template v-slot:id="{ data: { item: { id } } }">
                                    <router-link
                                        :key="id"
                                        :to="`/dashboard/filters/${id}`"
                                        class="no-underline"
                                    >
                                        <span> {{ id }} </span>
                                    </router-link>
                                </template>
                                <template v-slot:actions="{ data: { item } }">
                                    <v-btn icon @click="onRelationShipTypeDelete('filter', item)">
                                        <v-icon size="14" color="error">
                                            $vuetify.icons.delete
                                        </v-icon>
                                    </v-btn>
                                </template>
                            </data-table>
                        </template>
                    </details-table-wrapper>
                </v-col>
                <!-- Avaiable dialog for both SERVERS/FILTERS Tables -->
                <delete-dialog
                    v-model="showDeleteDialog"
                    :title="deleteDialogTitle"
                    :type="deleteDialogType"
                    :resourceId="currentService.id"
                    :resourceName="`${$t('service')}`"
                    :item="targetItemDelete"
                    :dispatchDelete="
                        () => {
                            confirmDelete()
                        }
                    "
                    :onClose="() => (showDeleteDialog = false)"
                    :onCancel="() => (showDeleteDialog = false)"
                />
            </v-row>
        </v-col>
        <v-col class="pa-0 ma-0" cols="8">
            <details-table-wrapper
                :toggleOnClick="() => (showSessions = !showSessions)"
                :toggleVal="showSessions"
                title="currentSessions"
                :titleInfo="sessionsTableRow.length"
            >
                <template v-slot:table>
                    <data-table
                        :headers="sessionsTableHeader"
                        :data="sessionsTableRow"
                        :sortDesc="false"
                        :noDataText="$t('noSessions')"
                        :loading="loading"
                    >
                        <template v-slot:append-id>
                            <span class="ml-1 color text-field-text">
                                ({{ sessionsTableRow.length }})
                            </span>
                        </template>
                        <template v-slot:user="{ data: { item: { user } } }">
                            <router-link :key="user" :to="`/users/${user}`" class="no-underline">
                                <span> {{ user }} </span>
                            </router-link>
                        </template>
                        <template v-slot:connected="{ data: { item: { connected } } }">
                            <span> {{ $help.formatValue(connected) }} </span>
                        </template>
                    </data-table>
                </template>
            </details-table-wrapper>
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

import { mapMutations } from 'vuex'
import { OVERLAY_TRANSPARENT_LOADING } from 'store/overlayTypes'

export default {
    name: 'server-session-tab',
    props: {
        currentService: { type: Object, required: true },
        searchKeyWord: { type: String, required: true },
        updateServiceRelationship: { type: Function, required: true },
        loading: { type: Boolean, required: true },
        onEditSucceeded: { type: Function, required: true },
        sessionsByService: { type: Array, required: true },
        serviceRelationshipServerTableData: { type: Array, required: true },
    },
    data() {
        return {
            // servers
            showServers: true,
            addServerDialog: false,
            serversTableHeader: [
                { text: 'Server', value: 'id' },
                { text: 'Status', value: 'state', align: 'center' },
                { text: '', value: 'action', sortable: false },
            ],
            // filters
            showFilter: true,
            addFilterDialog: false,
            filterTableHeader: [
                { text: 'Filter', value: 'id', sortable: false },
                { text: '', value: 'action', sortable: false },
            ],
            // sessions
            showSessions: true,
            sessionsTableHeader: [
                { text: 'ID', value: 'id' },
                { text: 'Client', value: 'user' },
                { text: 'Connected', value: 'connected' },
                { text: 'IDLE (s)', value: 'idle' },
            ],
            // common
            showDeleteDialog: false,
            deleteDialogType: 'delete',
            deleteDialogTitle: '',
            targetItemDelete: null,
        }
    },

    computed: {
        filtersLinked: function() {
            const {
                filters: { data: filtersLinkedData = [] } = {},
            } = this.currentService.relationships
            return filtersLinkedData
                ? filtersLinkedData.map(item => ({ id: item.id, type: item.type }))
                : []
        },
        sessionsTableRow: function() {
            if (this.sessionsByService.length) {
                let itemsArr = []
                let allSessions = this.$help.cloneDeep(this.sessionsByService)
                for (let n = allSessions.length - 1; n >= 0; --n) {
                    /**
                     * @typedef {Object} row
                     * @property {Number} row.id - sessions's id
                     * @property {String} row.user - sessions's user
                     * @property {String} row.connected - sessions's sessions
                     * @property {Number} row.idle - idle (seconds)
                     */
                    const {
                        id,
                        attributes: { idle, connected, user, remote },
                    } = allSessions[n] || {}

                    let row = {
                        id: id,
                        user: `${user}@${remote}`,
                        connected: connected,
                        idle: idle,
                    }
                    itemsArr.push(row)
                }
                return itemsArr
            }
            return []
        },
    },

    methods: {
        ...mapMutations({
            showOverlay: 'showOverlay',
            hideOverlay: 'hideOverlay',
            setServiceRelationshipServerTableData: 'service/setServiceRelationshipServerTableData',
        }),

        //--------------------------------------------------------- FILTERS ------------------------------------------
        async filterDragReorder({ oldIndex, newIndex }) {
            let self = this
            if (oldIndex !== newIndex) {
                const moved = self.filtersLinked.splice(oldIndex, 1)[0]
                self.filtersLinked.splice(newIndex, 0, moved)
                await self.performAsyncLoadingAction('filter', self.filtersLinked)
            }
        },

        //--------------------------------------------------------- COMMON ---------------------------------------------

        // This approach helps reusing the delete-dialog for both filters and severs
        onRelationShipTypeDelete(type, item) {
            this.targetItemDelete = item
            switch (type) {
                case 'filter':
                    this.deleteDialogType = 'delete'
                    this.deleteDialogTitle = `${this.$t('delete')} ${this.$t('filter')}`
                    break
                case 'server':
                    this.deleteDialogType = 'unlink'
                    this.deleteDialogTitle = `${this.$t('unlink')} ${this.$t('server')}`
                    break
            }

            this.showDeleteDialog = true
        },

        async confirmDelete() {
            let self = this
            switch (self.targetItemDelete.type) {
                case 'filters':
                    await self.performAsyncLoadingAction(
                        'filter',
                        self.filtersLinked.filter(item => item !== self.targetItemDelete)
                    )
                    break
                case 'servers':
                    {
                        let ori = self.serviceRelationshipServerTableData
                        let serversRelationship = []
                        let newTableData = []
                        for (let i = 0; i < ori.length; ++i) {
                            if (ori[i].id !== self.targetItemDelete.id) {
                                let cloneO = self.$help.cloneDeep(ori[i])
                                newTableData.push(cloneO)
                                //  {id:id,type:"server"} schema
                                delete cloneO.state
                                serversRelationship.push(cloneO)
                            }
                        }
                        // set new data for server table
                        await self.setServiceRelationshipServerTableData(newTableData)
                        //  serversRelationship with {id:id,type:"server"} object
                        await self.performAsyncLoadingAction('server', serversRelationship)
                    }
                    break
            }
        },

        // actions to vuex
        async performAsyncLoadingAction(action, data) {
            let self = this
            self.showOverlay(OVERLAY_TRANSPARENT_LOADING)
            switch (action) {
                case 'filter':
                    await self.updateServiceRelationship({
                        id: self.currentService.id,
                        type: 'filters',
                        filters: data,
                        callback: self.onEditSucceeded,
                    })
                    break
                case 'server':
                    await self.updateServiceRelationship({
                        id: self.currentService.id,
                        type: 'servers',
                        servers: data,
                        callback: self.onEditSucceeded,
                    })
                    break
            }

            // wait time out for loading animation
            await setTimeout(() => {
                self.hideOverlay()
            }, 300)
        },
    },
}
</script>
