<template>
    <v-sheet v-if="!$help.isEmpty(currentService)" class="px-6">
        <page-header :currentService="currentService" />

        <overview-header
            :currentService="currentService"
            :totalConnectionsChartData="totalConnectionsChartData"
            :fetchSessions="fetchSessions"
            :fetchNewConnectionsInfo="fetchNewConnectionsInfo"
            :connectionInfo="connectionInfo"
        />
        <v-tabs v-model="currentActiveTab" class="tab-navigation-wrapper">
            <v-tab v-for="tab in tabs" :key="tab.name">
                {{ tab.name }}
            </v-tab>

            <v-tabs-items v-model="currentActiveTab">
                <v-tab-item class="pt-5">
                    <ServerSessionTab
                        :currentService="currentService"
                        :serviceRelationshipServerTableData="serviceRelationshipServerTableData"
                        :searchKeyWord="searchKeyWord"
                        :updateServiceRelationship="updateServiceRelationship"
                        :onEditSucceeded="fetchService"
                        :loading="overlay === OVERLAY_TRANSPARENT_LOADING"
                        :sessionsByService="sessionsByService"
                    />
                </v-tab-item>
                <!-- Parameters & Diagnostics tab -->
                <v-tab-item class="pt-5">
                    <parameter-diagnostics-tab
                        :currentService="currentService"
                        :searchKeyWord="searchKeyWord"
                        :createOrUpdateService="createOrUpdateService"
                        :onEditSucceeded="fetchService"
                        :loading="overlay === OVERLAY_TRANSPARENT_LOADING"
                /></v-tab-item>
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
import { OVERLAY_TRANSPARENT_LOADING } from 'store/overlayTypes'
import { mapGetters, mapActions } from 'vuex'
import OverviewHeader from './OverviewHeader'
import PageHeader from './PageHeader'
import ServerSessionTab from './ServerSessionTab'
import ParameterDiagnosticsTab from './ParameterDiagnosticsTab'

export default {
    name: 'service-detail',
    components: {
        PageHeader,
        OverviewHeader,
        ServerSessionTab,
        ParameterDiagnosticsTab,
    },
    data() {
        return {
            OVERLAY_TRANSPARENT_LOADING: OVERLAY_TRANSPARENT_LOADING,
            currentActiveTab: null,
            tabs: [{ name: 'Servers & Sessions' }, { name: 'Parameters & Diagnostics' }],
        }
    },
    computed: {
        ...mapGetters({
            overlay: 'overlay',
            searchKeyWord: 'searchKeyWord',
            currentService: 'service/currentService',
            serviceRelationshipServerTableData: 'service/serviceRelationshipServerTableData',
            connectionInfo: 'service/connectionInfo',
            totalConnectionsChartData: 'service/totalConnectionsChartData',
            sessionsByService: 'session/sessionsByService',
        }),
    },

    async created() {
        let self = this
        // Initial fetch, wait for service id
        await self.fetchService()
        await self.fetchSessions()
    },
    methods: {
        ...mapActions({
            fetchServiceById: 'service/fetchServiceById',
            fetchServerLinkedToCurrentService: 'service/fetchServerLinkedToCurrentService',
            updateServiceRelationship: 'service/updateServiceRelationship',
            createOrUpdateService: 'service/createOrUpdateService',
            fetchServiceConnections: 'service/fetchServiceConnections',
            fetchSessionsFilterByServiceId: 'session/fetchSessionsFilterByServiceId',
        }),
        // reuse functions for fetch loop or after finish editing
        async fetchService() {
            await this.fetchServiceById(this.$route.params.id)
            if (!this.$help.isEmpty(this.currentService.relationships.servers)) {
                let servers = this.currentService.relationships.servers.data
                let serversIdArr = servers ? servers.map(item => `${item.id}`) : []
                this.fetchServerLinkedToCurrentService(serversIdArr)
            }
        },
        async fetchNewConnectionsInfo() {
            await this.fetchServiceConnections(this.$route.params.id)
        },
        async fetchSessions() {
            await this.fetchSessionsFilterByServiceId(this.$route.params.id)
        },
    },
}
</script>
