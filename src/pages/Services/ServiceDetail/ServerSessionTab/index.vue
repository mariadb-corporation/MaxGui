<template>
    <v-row>
        <v-col class="py-0 my-0" cols="4">
            <v-row class="pa-0 ma-0">
                <!-- SERVER TABLE -->
                <v-col cols="12" class="pa-0 ma-0">
                    <details-table-wrapper
                        :toggleOnClick="() => (showServers = !showServers)"
                        :toggleVal="showServers"
                        :title="`${$tc('servers', 2)}`"
                        :titleInfo="serverStateTableRow.length"
                        :onAddClick="() => onAdd('servers')"
                        addBtnText="addServer"
                    >
                        <template v-slot:table>
                            <data-table
                                :headers="serversTableHeader"
                                :data="serverStateTableRow"
                                :sortDesc="false"
                                :noDataText="$t('noServers')"
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
                                    <v-btn icon @click="onDelete('servers', item)">
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
                        :title="`${$tc('filters', 2)}`"
                        :titleInfo="filtersLinked.length"
                        :onAddClick="() => onAdd('filters')"
                        addBtnText="addFilter"
                    >
                        <template v-slot:table>
                            <data-table
                                :headers="filterTableHeader"
                                :data="filtersLinked"
                                :sortDesc="false"
                                :noDataText="$t('noFilters')"
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
                                    <v-btn icon @click="onDelete('filters', item)">
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
                <confirm-dialog
                    v-model="showDeleteDialog"
                    :title="dialogTitle"
                    :type="deleteDialogType"
                    :item="Array.isArray(targetItem) ? {} : targetItem"
                    :onSave="() => confirmDelete()"
                    :onClose="() => (showDeleteDialog = false)"
                    :onCancel="() => (showDeleteDialog = false)"
                />

                <select-dialog
                    v-model="showSelectDialog"
                    :title="dialogTitle"
                    mode="add"
                    multiple
                    :entityName="targetSelectItemType"
                    :onClose="() => (showSelectDialog = false)"
                    :onCancel="() => (showSelectDialog = false)"
                    :handleSave="confirmAdd"
                    :itemsList="itemsList"
                    @get-selected-entities="targetItem = $event"
                    @get-all-entities="getAllEntities"
                />
            </v-row>
        </v-col>
        <sessions-table :loading="loading" :sessionsByService="sessionsByService" />
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

import { mapMutations, mapGetters, mapActions } from 'vuex'
import { OVERLAY_TRANSPARENT_LOADING } from 'store/overlayTypes'
import SessionsTable from './SessionsTable'

export default {
    name: 'server-session-tab',
    components: {
        SessionsTable,
    },
    props: {
        currentService: { type: Object, required: true },
        getServerState: { type: Function, required: true },
        loading: { type: Boolean, required: true },
        dispatchRelationshipUpdate: { type: Function, required: true },
        sessionsByService: { type: Array, required: true },
        serverStateTableRow: { type: Array, required: true },
    },
    data() {
        return {
            // servers
            showServers: true,
            serversTableHeader: [
                { text: 'Server', value: 'id' },
                { text: 'Status', value: 'state', align: 'center' },
                { text: '', value: 'action', sortable: false },
            ],
            // filters
            showFilter: true,
            filterTableHeader: [
                { text: 'Filter', value: 'id', sortable: false },
                { text: '', value: 'action', sortable: false },
            ],
            //---------------- common
            dialogTitle: '',
            targetItem: null,
            //delete dialog
            showDeleteDialog: false,
            deleteDialogType: 'delete',

            //select dialog
            showSelectDialog: false,
            targetSelectItemType: 'servers',
            itemsList: [],
        }
    },

    computed: {
        ...mapGetters({
            allFilters: 'filter/allFilters',
        }),
        filtersLinked: function() {
            const {
                filters: { data: filtersLinkedData = [] } = {},
            } = this.currentService.relationships
            return filtersLinkedData
                ? filtersLinkedData.map(item => ({ id: item.id, type: item.type }))
                : []
        },
    },

    methods: {
        ...mapMutations({
            showOverlay: 'showOverlay',
            hideOverlay: 'hideOverlay',
        }),
        ...mapActions({
            fetchAllFilters: 'filter/fetchAllFilters',
        }),
        //--------------------------------------------------------- FILTERS ------------------------------------------
        async filterDragReorder({ oldIndex, newIndex }) {
            let self = this
            if (oldIndex !== newIndex) {
                const moved = self.filtersLinked.splice(oldIndex, 1)[0]
                self.filtersLinked.splice(newIndex, 0, moved)
                await self.dispatchRelationshipUpdate('filters', self.filtersLinked)
            }
        },

        //--------------------------------------------------------- COMMON ---------------------------------------------

        // -------------- Delete handle
        onDelete(type, item) {
            this.targetItem = item
            switch (type) {
                case 'filters':
                    this.deleteDialogType = 'delete'
                    this.dialogTitle = `${this.$t('delete')} ${this.$tc('filters', 1)}`
                    break
                case 'servers':
                    this.deleteDialogType = 'unlink'
                    this.dialogTitle = `${this.$t('unlink')} ${this.$tc('servers', 1)}`
                    break
            }

            this.showDeleteDialog = true
        },

        async confirmDelete() {
            let self = this
            switch (self.targetItem.type) {
                case 'filters':
                    await self.dispatchRelationshipUpdate(
                        'filters',
                        self.filtersLinked.filter(item => item !== self.targetItem)
                    )
                    break
                case 'servers':
                    {
                        let ori = self.serverStateTableRow
                        let serversRelationship = []
                        for (let i = 0; i < ori.length; ++i) {
                            if (ori[i].id !== self.targetItem.id) {
                                let cloneO = self.$help.cloneDeep(ori[i])
                                delete cloneO.state
                                serversRelationship.push(cloneO)
                            }
                        }

                        await self.dispatchRelationshipUpdate('servers', serversRelationship)
                    }
                    break
            }
        },
        // -------------- Add handle
        async getAllEntities() {
            switch (this.targetSelectItemType) {
                case 'servers':
                    {
                        let data = await this.getServerState()
                        let all = data.map(server => ({
                            id: server.id,
                            type: server.type,
                            state: server.attributes.state,
                        }))

                        let self = this
                        let availableEntities = self.$help.xorWith(
                            all,
                            self.serverStateTableRow,
                            self.$help.isEqual
                        )
                        this.itemsList = availableEntities
                    }
                    break
                case 'filters':
                    {
                        await this.fetchAllFilters()
                        let all = this.$help.cloneDeep(this.allFilters).map(filter => ({
                            id: filter.id,
                            type: filter.type,
                        }))

                        let self = this
                        let availableEntities = self.$help.xorWith(
                            all,
                            self.filtersLinked,
                            self.$help.isEqual
                        )
                        this.itemsList = availableEntities
                    }
                    break
            }
        },
        onAdd(type) {
            let self = this
            self.dialogTitle = `${self.$t(`addEntity`, {
                entityName: self.$tc(type, 2),
            })}`

            switch (type) {
                case 'filters':
                    self.targetSelectItemType = 'filters'
                    break
                case 'servers':
                    self.targetSelectItemType = 'servers'
                    break
            }

            this.showSelectDialog = true
        },
        async confirmAdd() {
            let self = this

            switch (self.targetSelectItemType) {
                case 'filters':
                    {
                        let clone = self.$help.cloneDeep(self.filtersLinked)
                        await self.dispatchRelationshipUpdate('filters', [
                            ...clone,
                            ...self.targetItem,
                        ])
                    }

                    break
                case 'servers':
                    {
                        let ori = self.serverStateTableRow
                        let merge = [...ori, ...self.targetItem]
                        let serversRelationship = []
                        for (let i = 0; i < merge.length; ++i) {
                            let cloneO = self.$help.cloneDeep(merge[i])
                            delete cloneO.state
                            serversRelationship.push(cloneO)
                        }
                        await self.dispatchRelationshipUpdate('servers', serversRelationship)
                    }
                    break
            }
        },
    },
}
</script>
