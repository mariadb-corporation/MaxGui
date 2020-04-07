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

        <v-slide-group :show-arrows="false" width="100%" class="mb-5" center-active>
            <v-slide-item style="width:40%">
                <div class="d-flex" style="width:100%">
                    <outline-small-card
                        cardWrapper="detail-overview-with-graph mt-6"
                        cardClass="detail-overview-with-graph__card "
                    >
                        <template v-slot:title>
                            {{ $t('overview') }}
                        </template>
                        <template v-slot:card-body>
                            <span
                                class="caption text-uppercase font-weight-bold color text-deep-ocean"
                            >
                                ROUTER
                            </span>
                            <span class="text-no-wrap body-2">
                                {{ currentService.attributes.router }}
                            </span>
                        </template>
                    </outline-small-card>
                    <outline-small-card
                        cardWrapper="detail-overview-with-graph mt-6"
                        cardClass="detail-overview-with-graph__card "
                    >
                        <template v-slot:card-body>
                            <span
                                class="caption text-uppercase font-weight-bold color text-deep-ocean"
                            >
                                STARTED AT
                            </span>
                            <span class="text-no-wrap body-2">
                                {{ $help.formatValue(currentService.attributes.started) }}
                            </span>
                        </template>
                    </outline-small-card>
                </div>
            </v-slide-item>
            <v-slide-item style="width:60%">
                <outline-small-card
                    cardWrapper="detail-overview-with-graph ml-2 mt-6"
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
            </v-slide-item>
        </v-slide-group>
        <!-- PARAMETERS TABLE -->
        <v-row>
            <v-col cols="6">
                <div class="mb-1 d-flex align-center">
                    <v-btn
                        icon
                        class="arrow-toggle"
                        @click="() => (showParameters = !showParameters)"
                    >
                        <v-icon :class="[!showParameters ? 'arrow-down' : 'arrow-up']" size="32">
                            $expand
                        </v-icon>
                    </v-btn>
                    <p class="mb-0 body-2 font-weight-bold color text-navigation text-uppercase">
                        {{ $t('parameters') }}
                    </p>
                </div>
                <v-expand-transition>
                    <div v-show="showParameters">
                        <data-table
                            class="table-fluid"
                            :headers="variableValueTableHeaders"
                            :data="tableRowProcessed('parameters')"
                            :tdBorderLeft="true"
                        />
                    </div>
                </v-expand-transition>
            </v-col>
            <!-- SERVER TABLE -->
            <v-col cols="3">
                <server-create-or-update
                    v-model="addServerDialog"
                    :close-modal="() => (addServerDialog = false)"
                    mode="post"
                />
                <div class="mb-1 d-flex align-center">
                    <div class="d-flex align-center">
                        <v-btn
                            icon
                            class="arrow-toggle"
                            @click="() => (showServers = !showServers)"
                        >
                            <v-icon :class="[!showServers ? 'arrow-down' : 'arrow-up']" size="32">
                                $expand
                            </v-icon>
                        </v-btn>
                        <p
                            class="mb-0 body-2 font-weight-bold color text-navigation text-uppercase"
                        >
                            {{ $t('servers') }}
                            <span class="ml-1 color text-field-text"
                                >({{ serversLinked.length }})
                            </span>
                        </p>
                    </div>
                    <v-spacer />
                    <v-btn
                        color="primary"
                        text
                        x-small
                        class="text-capitalize"
                        @click="() => (addServerDialog = true)"
                    >
                        + {{ $t('addServer') }}
                    </v-btn>
                </div>
                <v-expand-transition>
                    <div v-show="showServers">
                        <data-table
                            :headers="serversTableHeader"
                            :data="serversLinked"
                            :sortDesc="false"
                            :noDataText="$t('noServer')"
                            sortBy="id"
                            class="table-fluid"
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
                    </div>
                </v-expand-transition>
            </v-col>
            <!-- FILTER TABLE -->
            <v-col cols="3">
                <div class="mb-1 d-flex align-center">
                    <div class="d-flex align-center">
                        <v-btn icon class="arrow-toggle" @click="() => (showFilter = !showFilter)">
                            <v-icon :class="[!showFilter ? 'arrow-down' : 'arrow-up']" size="32">
                                $expand
                            </v-icon>
                        </v-btn>
                        <p
                            class="mb-0 body-2 font-weight-bold color text-navigation text-uppercase"
                        >
                            {{ $t('filters') }}
                            <span class="ml-1 color text-field-text"
                                >({{ filterLinked.length }})
                            </span>
                        </p>
                    </div>
                    <v-spacer />
                    <v-btn
                        color="primary"
                        text
                        x-small
                        class="text-capitalize"
                        @click="() => (addFilterDialog = true)"
                    >
                        + {{ $t('addFilter') }}
                    </v-btn>
                </div>
                <v-expand-transition>
                    <div v-show="showFilter">
                        <data-table
                            :headers="filterTableHeader"
                            :data="filterLinked"
                            :sortDesc="false"
                            :noDataText="$t('noFilter')"
                            sortBy="id"
                            class="table-fluid"
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
                    </div>
                </v-expand-transition>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="6">
                <div class="mb-1 d-flex align-center">
                    <v-btn
                        icon
                        class="arrow-toggle"
                        @click="() => (showRouterDiagnostics = !showRouterDiagnostics)"
                    >
                        <v-icon
                            :class="[!showRouterDiagnostics ? 'arrow-down' : 'arrow-up']"
                            size="32"
                        >
                            $expand
                        </v-icon>
                    </v-btn>
                    <p class="mb-0 body-2 font-weight-bold color text-navigation text-uppercase">
                        {{ $t('routerDiagnostics') }}
                    </p>
                </div>
                <v-expand-transition>
                    <div v-show="showRouterDiagnostics">
                        <data-table
                            class="table-fluid"
                            :headers="variableValueTableHeaders"
                            :data="tableRowProcessed('routerDiagnostics')"
                            :tdBorderLeft="true"
                        />
                    </div>
                </v-expand-transition>
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
import ServerCreateOrUpdate from 'pages/Servers/ServerCreateOrUpdate'

export default {
    name: 'service-detail',
    components: {
        CurrentConnectionsChart,
        ServerCreateOrUpdate,
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
        ...mapGetters('service', ['currentService']),
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
