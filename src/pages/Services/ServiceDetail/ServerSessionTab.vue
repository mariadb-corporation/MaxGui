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
                        :titleInfo="serversLinked.length"
                        :onAddClick="() => (addServerDialog = true)"
                        addBtnText="addServer"
                    >
                        <template v-slot:table>
                            <data-table
                                :headers="serversTableHeader"
                                :data="serversLinked"
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
                <delete-modal
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
        <v-col class="pa-0 ma-0" cols="8"> </v-col>
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

import { mapGetters, mapActions, mapMutations } from 'vuex'
import { OVERLAY_TRANSPARENT_LOADING } from 'store/overlayTypes'

export default {
    name: 'server-session-tab',
    props: {
        currentService: { type: Object, required: true },
        searchKeyWord: { type: String, required: true },
        updateServiceRelationship: { type: Function, required: true },
        loading: { type: Boolean, required: true },
        onEditSucceeded: { type: Function, required: true },
    },
    data() {
        return {
            // servers
            serversLinked: [],
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
    },

    watch: {
        /*  This watcher update the serversLinked
            If there is no servers type in service relationship, set serversLinked to empty array
         */
        currentService: function(newVal) {
            !this.$help.isEmpty(newVal.relationships.servers)
                ? this.getServersIdArr()
                : (this.serversLinked = [])
        },
    },

    async created() {
        /*  When the component is created the first time,
            First call getServersIdArr(): get the list of servers linked to this currentService
            Finally, fetchServerFieldsets() : fetch the server information using fieldsets()
            and set the data to serversLinked

         */
        if (!this.$help.isEmpty(this.currentService.relationships.servers)) {
            await this.getServersIdArr()
        }
    },

    methods: {
        ...mapMutations(['showOverlay', 'hideOverlay']),

        //--------------------------------------------------------- SERVERS -------------------------------------------
        getServersIdArr() {
            let servers = this.currentService.relationships.servers.data
            let serversIdArr = servers ? servers.map(item => `${item.id}`) : []
            // Get array of obj linked servers based on linkedServers array of IDs
            return this.fetchServerFieldsets(serversIdArr)
        },

        async fetchServerFieldsets(idArray) {
            let arr = []
            for (let i = 0; i < idArray.length; ++i) {
                let res = await this.axios.get(`/servers/${idArray[i]}?fields[servers]=state`)
                if (res.status === 200) {
                    const {
                        id,
                        type,
                        attributes: { state },
                    } = res.data.data
                    arr.push({ id: id, state: state, type: type })
                }
            }
            this.serversLinked = arr
        },

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

        // This approach helps reusing the delete-modal for both filters and severs
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

        confirmDelete() {
            let self = this
            switch (self.targetItemDelete.type) {
                case 'filters':
                    self.performAsyncLoadingAction(
                        'filter',
                        self.filtersLinked.filter(item => item !== self.targetItemDelete)
                    )
                    break
                case 'servers':
                    self.performAsyncLoadingAction(
                        'server',
                        self.serversLinked.filter(item => item !== self.targetItemDelete)
                    )
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
