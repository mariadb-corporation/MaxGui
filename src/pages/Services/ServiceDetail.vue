<template>
    <v-sheet v-if="!$help.isEmpty(currentService)" class="px-6">
        <details-page-title />
        <icon-sprite-sheet
            size="13"
            class="status-icon mr-1"
            :frame="$help.serviceStateIcon(currentService.attributes.state)"
        >
            status
        </icon-sprite-sheet>
        <span class="color text-navigation body-2">
            {{ currentService.attributes.state === 'Started' ? 'Healthy' : 'Unhealthy' }}
        </span>

        <div class="d-flex mb-2">
            <div class="d-flex" style="width:40%">
                <outline-small-card
                    cardWrapper="detail-overview-with-graph mt-5"
                    cardClass="detail-overview-with-graph__card "
                >
                    <template v-slot:title>
                        {{ $t('overview') }}
                    </template>
                    <template v-slot:card-body>
                        <span class="caption text-uppercase font-weight-bold color text-deep-ocean">
                            ROUTER
                        </span>
                        <span class="text-no-wrap body-2">
                            {{ currentService.attributes.router }}
                        </span>
                    </template>
                </outline-small-card>
                <outline-small-card
                    cardWrapper="detail-overview-with-graph mt-5"
                    cardClass="detail-overview-with-graph__card "
                >
                    <template v-slot:card-body>
                        <span class="caption text-uppercase font-weight-bold color text-deep-ocean">
                            STARTED AT
                        </span>
                        <span class="text-no-wrap body-2">
                            {{ $help.formatValue(currentService.attributes.started) }}
                        </span>
                    </template>
                </outline-small-card>
            </div>
            <div style="width:60%">
                <outline-small-card
                    cardWrapper="detail-overview-with-graph ml-2 mt-5"
                    cardClass="detail-overview-with-graph__card-graph"
                >
                    <template v-slot:title>
                        {{ $t('currentConnections') }}
                        <span class="text-lowercase font-weight-medium">
                            ({{ currentConnections }}/{{ totalConnections }})</span
                        >
                    </template>
                    <template v-slot:card-body>
                        <v-col>
                            <current-connections-chart :updatingChart="updatingChart" />
                        </v-col>
                    </template>
                </outline-small-card>
            </div>
        </div>
        <!-- PARAMETERS TABLE -->
        <v-row>
            <v-col cols="6">
                <details-table-wrapper
                    :toggleOnClick="() => (showParameters = !showParameters)"
                    :toggleVal="showParameters"
                    title="parameters"
                >
                    <template v-slot:table>
                        <data-table
                            class="table-fluid"
                            :headers="variableValueTableHeaders"
                            :data="tableRowProcessed('parameters')"
                            :tdBorderLeft="true"
                            :search="searchKeyWord"
                        />
                    </template>
                </details-table-wrapper>
            </v-col>
            <!-- SERVER TABLE -->
            <v-col cols="3">
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
                            <template v-slot:state="{ data: { item: { state } } }">
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
            <!-- FILTER TABLE -->
            <v-col cols="3">
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
        <v-row>
            <v-col cols="6">
                <details-table-wrapper
                    :toggleOnClick="() => (showRouterDiagnostics = !showRouterDiagnostics)"
                    :toggleVal="showRouterDiagnostics"
                    title="routerDiagnostics"
                >
                    <template v-slot:table>
                        <data-table
                            class="table-fluid"
                            :headers="variableValueTableHeaders"
                            :data="tableRowProcessed('routerDiagnostics')"
                            :tdBorderLeft="true"
                            :search="searchKeyWord"
                        />
                    </template>
                </details-table-wrapper>
            </v-col>
        </v-row>
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
import CurrentConnectionsChart from 'pages/Services/CurrentConnectionsChart'

export default {
    name: 'service-detail',
    components: {
        CurrentConnectionsChart,
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
            totalConnections: 100,
            currentConnections: 0,
            showRouterDiagnostics: true,
            showFilter: true,
            showServers: true,
            showParameters: true,
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
                            return this.$help.objToArrOfObj(router_diagnostics)
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
        this.currentConnections = 10 //this.currentService.attributes.connections
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
        async updatingChart(chart) {
            let self = this
            // Use sparse fieldsets to fetch only necessary data
            let res = await this.axios.get(
                `/services/${self.$route.params.id}?fields[services]=connections,total_connections`
            )
            if (res.status === 200) {
                let { attributes: { connections, total_connections } = {} } = res.data.data

                let testCurrent = Math.round(Math.random() * 100)

                this.totalConnections = 100 //total_connections
                this.currentConnections = testCurrent //connections

                chart.data.datasets.forEach(function(dataset) {
                    dataset.data.push({
                        x: Date.now(),
                        //connections
                        y: testCurrent,
                    })
                })
                chart.update({
                    preservation: true,
                })
            }
        },
    },
}
</script>

<style lang="scss" scoped>
.detail-overview-with-graph {
    width: 100%;
    ::v-deep &__card {
        border-radius: 0px !important;
    }
    ::v-deep &__card,
    ::v-deep &__card-graph {
        display: flex;
        align-items: center;
        flex-direction: column;
        justify-content: center;
    }
    ::v-deep &__card-graph {
        padding-top: 6px;
    }
    &:not(:first-of-type) {
        ::v-deep .detail-overview-with-graph__card {
            border-left: none !important;
        }
    }
}
</style>
