<template>
    <v-sheet v-if="!$help.isEmpty(currentService)" class="px-6">
        <page-header :currentService="currentService" />
        <overview-header :currentService="currentService" />
        <v-tabs v-model="currentActiveTab" class="tab-navigation-wrapper">
            <v-tab v-for="tab in tabs" :key="tab.name">
                {{ tab.name }}
            </v-tab>

            <v-tabs-items v-model="currentActiveTab">
                <!-- Servers & Sessions tab -->
                <v-tab-item class="pt-5">
                    <v-row>
                        <v-col cols="3">
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
                                                class="table-fluid"
                                                :search="searchKeyWord"
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
                                                <template
                                                    v-slot:state="{ data: { item: { state } } }"
                                                >
                                                    <icon-sprite-sheet
                                                        size="13"
                                                        class="status-icon"
                                                        :frame="$help.serverStateIcon(state)"
                                                    >
                                                        status
                                                    </icon-sprite-sheet>
                                                </template>
                                            </data-table>
                                        </template>
                                    </details-table-wrapper>
                                </v-col>
                                <!-- Filter TABLE -->
                                <v-col cols="12" class="pa-0 ma-0">
                                    <details-table-wrapper
                                        :toggleOnClick="() => (showFilter = !showFilter)"
                                        :toggleVal="showFilter"
                                        title="filters"
                                        :titleInfo="filterLinked.length"
                                        :onAddClick="() => (addFilterDialog = true)"
                                        addBtnText="addFilter"
                                    >
                                        <template v-slot:table>
                                            <data-table
                                                :headers="filterTableHeader"
                                                :data="filterLinked"
                                                :sortDesc="false"
                                                :noDataText="$t('noFilter')"
                                                sortBy="id"
                                                class="table-fluid"
                                                :search="searchKeyWord"
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
                                            </data-table>
                                        </template>
                                    </details-table-wrapper>
                                </v-col>
                            </v-row>
                        </v-col>
                        <v-col cols="9"> </v-col>
                    </v-row>
                </v-tab-item>
                <!-- Parameters & Diagnostics tab -->
                <v-tab-item>
                    <v-row>
                        <!-- PARAMETERS TABLE -->
                        <v-col cols="6">
                            <details-table-wrapper
                                :toggleOnClick="() => (showParameters = !showParameters)"
                                :toggleVal="showParameters"
                                title="parameters"
                                :onEdit="() => (paramsEditable = true)"
                                :editing="paramsEditable"
                                :doneEdit="handleDoneEdit"
                            >
                                <template v-slot:table>
                                    <data-table
                                        class="table-fluid"
                                        :headers="variableValueTableHeaders"
                                        :data="tableRowProcessed('parameters')"
                                        :tdBorderLeft="true"
                                        :search="searchKeyWord"
                                    >
                                        <template
                                            v-if="paramsEditable"
                                            v-slot:value="{ data: { item: { value } } }"
                                        >
                                            <v-text-field
                                                :value="value"
                                                label="Edit"
                                                single-line
                                            ></v-text-field>
                                        </template>
                                    </data-table>
                                </template>
                            </details-table-wrapper>
                            <base-dialog
                                v-model="showConfirmDialog"
                                :onCancel="handleCancel"
                                :onSave="handleSave"
                                :title="`${$t('implementChanges')}`"
                                saveText="thatsRight"
                            >
                            </base-dialog>
                        </v-col>
                        <v-col cols="6">
                            <details-table-wrapper
                                :toggleOnClick="
                                    () => (showRouterDiagnostics = !showRouterDiagnostics)
                                "
                                :toggleVal="showRouterDiagnostics"
                                title="routerDiagnostics"
                            >
                                <template v-slot:table>
                                    <!-- <data-table
                                        class="table-fluid"
                                        :headers="variableValueTableHeaders"
                                        :data="tableRowProcessed('routerDiagnostics')"
                                        :tdBorderLeft="true"
                                        :search="searchKeyWord"
                                    /> -->
                                    <tree-data
                                        :headers="variableValueTableHeaders"
                                        :data="tableRowProcessed('routerDiagnostics')"
                                        :search="searchKeyWord"
                                    />
                                </template>
                            </details-table-wrapper>
                        </v-col>
                    </v-row>
                </v-tab-item>
            </v-tabs-items>
        </v-tabs>
    </v-sheet>
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
import OverviewHeader from './OverviewHeader'
import PageHeader from './PageHeader'
export default {
    name: 'service-detail',
    components: {
        PageHeader,
        OverviewHeader,
    },
    data() {
        return {
            filterLinked: [],
            filterTableHeader: [{ text: 'Filter', value: 'id' }],
            serversLinked: [],
            serversTableHeader: [
                { text: 'Server', value: 'id' },
                { text: 'Status', value: 'state' },
            ],
            addServerDialog: false,
            addFilterDialog: false,
            variableValueTableHeaders: [
                { text: 'Variable', value: 'id', width: '65%' },
                { text: 'Value', value: 'value', width: '35%' },
            ],

            showRouterDiagnostics: true,
            showFilter: true,
            showServers: true,
            showParameters: true,
            currentActiveTab: null,
            tabs: [{ name: 'Servers & Sessions' }, { name: 'Parameters & Diagnostics' }],
            paramsEditable: false,
            showConfirmDialog: false,
        }
    },
    computed: {
        ...mapGetters({
            searchKeyWord: 'searchKeyWord',
            currentService: 'service/currentService',
        }),
        tableRowProcessed() {
            return type => {
                let currentService = this.$help.cloneDeep(this.currentService)
                if (!this.$help.isEmpty(currentService)) {
                    switch (type) {
                        case 'parameters': {
                            const { attributes: { parameters = {} } = {} } = currentService
                            return this.$help.objToArrOfObj(parameters)
                        }
                        case 'routerDiagnostics': {
                            const { attributes: { router_diagnostics = {} } = {} } = currentService
                            let arrData
                            let arr = this.$help.objToArrOfObj(router_diagnostics)
                            if (arr.length) {
                                arrData = arr.map(obj => {
                                    return {
                                        id: obj.id,
                                        value: obj.value,
                                        isLink: false,
                                        children: this.$help.processTreeData(obj.value, 0),
                                        level: 0,
                                        colNameWidth: `calc(65% - 11px -  ${0 * 8}px)`,
                                        colValueWidth: 'calc(35% - 11px)',
                                    }
                                })
                            }
                            return arrData

                            // return this.$help.objToArrOfObj(router_diagnostics)
                        }
                    }
                }
                return []
            }
        },
    },
    watch: {
        currentService: function(newVal) {
            if (!this.$help.isEmpty(newVal.relationships)) {
                let servers = newVal.relationships.servers.data
                let serversIdArr = servers ? servers.map(item => `${item.id}`) : []
                // Get array of obj linked servers based on linkedServers array of IDs
                this.fetchServerFieldsets(serversIdArr)

                const {
                    filters: { data: filterLinkedData = [] } = {},
                } = this.currentService.relationships
                if (this.filterLinked !== filterLinkedData) {
                    this.filterLinked = filterLinkedData
                        ? filterLinkedData.map(item => ({ id: item.id }))
                        : []
                }
            }
        },
    },
    async created() {
        await this.fetchServiceById(this.$route.params.id)
    },
    methods: {
        ...mapActions('service', ['fetchServiceById']),
        processServersLinked(arr) {
            this.serversLinked = arr
        },
        async fetchServerFieldsets(idArray) {
            try {
                let arr = []
                for (let i = 0; i < idArray.length; ++i) {
                    let res = await this.axios.get(`/servers/${idArray[i]}?fields[servers]=state`)
                    if (res.status === 200) {
                        const {
                            id,
                            attributes: { state },
                        } = res.data.data
                        arr.push({ id: id, state: state })
                    }
                }
                return this.processServersLinked(arr)
            } catch (e) {
                return e
            }
        },

        handleDoneEdit() {
            this.showConfirmDialog = true
            // this.paramsEditable = false
        },
        handleSave() {
            this.paramsEditable = false
        },
        handleCancel() {
            this.paramsEditable = false
        },
    },
}
</script>
