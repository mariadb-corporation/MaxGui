<template>
    <v-row>
        <v-col class="py-0 my-0" cols="4">
            <v-row class="pa-0 ma-0">
                <!-- STATISTICS TABLE -->
                <v-col cols="12" class="pa-0 ma-0">
                    <details-table-wrapper
                        :toggleOnClick="() => (showStatistics = !showStatistics)"
                        :toggleVal="showStatistics"
                        title="statistics"
                    >
                        <template v-slot:table>
                            <data-table
                                :headers="variableValueTableHeaders"
                                :data="statisticsTableRow"
                                :tdBorderLeft="true"
                            />
                        </template>
                    </details-table-wrapper>
                </v-col>
                <!-- SERVICE TABLE -->
                <v-col cols="12" class="pa-0 mt-4">
                    <details-table-wrapper
                        :toggleOnClick="() => (showServices = !showServices)"
                        :toggleVal="showServices"
                        title="services"
                        :titleInfo="serviceStateTableRow.length"
                        :onAddClick="() => onAdd('services')"
                        addBtnText="addService"
                    >
                        <template v-slot:table>
                            <data-table
                                :headers="servicesTableHeader"
                                :data="serviceStateTableRow"
                                :sortDesc="false"
                                :noDataText="$t('noService')"
                                sortBy="id"
                                :loading="loading"
                                :showActionsOnHover="true"
                            >
                                <template v-slot:id="{ data: { item: { id } } }">
                                    <router-link
                                        :key="id"
                                        :to="`/dashboard/services/${id}`"
                                        class="no-underline"
                                    >
                                        {{ id }}
                                    </router-link>
                                </template>
                                <template v-slot:state="{ data: { item: { state } } }">
                                    <icon-sprite-sheet
                                        size="13"
                                        class="status-icon"
                                        :frame="$help.serviceStateIcon(state)"
                                    >
                                        status
                                    </icon-sprite-sheet>
                                </template>
                                <template v-slot:actions="{ data: { item } }">
                                    <v-btn icon @click="onDelete('services', item)">
                                        <v-icon size="20" color="error">
                                            $vuetify.icons.unlink
                                        </v-icon>
                                    </v-btn>
                                </template>
                            </data-table>
                        </template>
                    </details-table-wrapper>
                </v-col>
            </v-row>
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
            :multiple="true"
            :entityName="targetSelectItemType"
            :onClose="() => (showSelectDialog = false)"
            :onCancel="() => (showSelectDialog = false)"
            :handleSave="confirmAdd"
            :itemsList="itemsList"
            :getAllEntities="getAllEntities"
            :returnSelectedEntities="selectedItems => (targetItem = selectedItems)"
        />

        <sessions-table :currentServer="currentServer" :loading="loading" />
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
    name: 'statistics-session-tab',
    components: {
        SessionsTable,
    },
    props: {
        currentServer: { type: Object, required: true },
        serviceStateTableRow: { type: Array, required: true },
        updateServerRelationship: { type: Function, required: true },
        onEditSucceeded: { type: Function, required: true },
        loading: { type: Boolean, required: true },
        fetchServiceState: { type: Function, required: true },
    },
    data() {
        return {
            //statistics
            variableValueTableHeaders: [
                { text: 'Variable', value: 'id', width: '65%' },
                { text: 'Value', value: 'value', width: '35%' },
            ],
            showStatistics: true,
            // services
            showServices: true,
            servicesTableHeader: [
                { text: 'Service', value: 'id' },
                { text: 'Status', value: 'state', align: 'center' },
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
            targetSelectItemType: 'services',
            itemsList: [],
        }
    },

    computed: {
        statisticsTableRow: function() {
            let currentServer = this.$help.cloneDeep(this.currentServer)

            if (!this.$help.isEmpty(currentServer)) {
                // Set fallback null value if properties doesnt exist
                const { attributes: { statistics = null } = {} } = currentServer
                return this.$help.objToArrOfObj(statistics)
            }
            return []
        },
    },
    methods: {
        //--------------------------------------------------------- COMMON ---------------------------------------------
        // actions to vuex
        async performAsyncLoadingAction(type, data) {
            let self = this
            switch (type) {
                case 'services':
                    await self.updateServerRelationship({
                        id: self.currentServer.id,
                        type: 'services',
                        services: data,
                        callback: self.onEditSucceeded,
                    })
                    break
            }
        },

        // -------------- Delete handle
        onDelete(type, item) {
            this.targetItem = item
            switch (type) {
                case 'services':
                    this.deleteDialogType = 'unlink'
                    this.dialogTitle = `${this.$t('unlink')} ${this.$t('service')}`
                    break
            }

            this.showDeleteDialog = true
        },

        async confirmDelete() {
            let self = this
            switch (self.targetItem.type) {
                case 'services':
                    {
                        let ori = self.serviceStateTableRow
                        let servicesRelationship = []
                        for (let i = 0; i < ori.length; ++i) {
                            if (ori[i].id !== self.targetItem.id) {
                                let cloneO = self.$help.cloneDeep(ori[i])
                                delete cloneO.state
                                servicesRelationship.push(cloneO)
                            }
                        }

                        await self.performAsyncLoadingAction('services', servicesRelationship)
                    }
                    break
            }
        },

        // -------------- Add handle
        async getAllEntities() {
            switch (this.targetSelectItemType) {
                case 'services':
                    {
                        let res = await this.fetchServiceState()
                        let all = res.map(service => ({
                            id: service.id,
                            type: service.type,
                            state: service.attributes.state,
                        }))

                        let self = this
                        let availableEntities = self.$help.xorWith(
                            all,
                            self.serviceStateTableRow,
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
                entityName: self.$t(type),
            })}`

            switch (type) {
                case 'services':
                    self.targetSelectItemType = 'services'
                    break
            }

            this.showSelectDialog = true
        },

        async confirmAdd() {
            let self = this

            switch (self.targetSelectItemType) {
                case 'services':
                    {
                        let ori = self.serviceStateTableRow
                        let merge = [...ori, ...self.targetItem]
                        let servicesRelationship = []
                        for (let i = 0; i < merge.length; ++i) {
                            let cloneO = self.$help.cloneDeep(merge[i])
                            delete cloneO.state
                            servicesRelationship.push(cloneO)
                        }
                        await self.performAsyncLoadingAction('services', servicesRelationship)
                    }
                    break
            }
        },
    },
}
</script>