<template>
    <v-sheet v-if="!$help.isEmpty(currentServer)" class="px-6">
        <page-header :currentServer="currentServer" />
        <overview-header :currentServer="currentServer" />

        <v-tabs v-model="currentActiveTab" class="tab-navigation-wrapper">
            <v-tab v-for="tab in tabs" :key="tab.name">
                {{ tab.name }}
            </v-tab>

            <v-tabs-items v-model="currentActiveTab">
                <v-tab-item class="pt-5">
                    <statistics-session-tab
                        :currentServer="currentServer"
                        :serviceStateTableRow="serviceStateTableRow"
                        :updateServerRelationship="updateServerRelationship"
                        :onEditSucceeded="fetchServer"
                        :loading="overlay === OVERLAY_TRANSPARENT_LOADING"
                        :fetchServiceState="fetchServiceState"
                    />
                </v-tab-item>
                <!-- Parameters & Diagnostics tab -->
                <v-tab-item class="pt-5">
                    <parameter-diagnostics-tab
                        :currentServer="currentServer"
                        :createOrUpdateServerParameters="createOrUpdateServerParameters"
                        :onEditSucceeded="fetchServer"
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
import PageHeader from './PageHeader'
import OverviewHeader from './OverviewHeader'
import ParameterDiagnosticsTab from './ParameterDiagnosticsTab'
import StatisticsSessionTab from './StatisticsSessionTab'
export default {
    name: 'server-detail',
    components: {
        PageHeader,
        OverviewHeader,
        StatisticsSessionTab,
        ParameterDiagnosticsTab,
    },
    props: {
        id: String,
    },

    data() {
        return {
            OVERLAY_TRANSPARENT_LOADING: OVERLAY_TRANSPARENT_LOADING,
            currentActiveTab: null,
            tabs: [{ name: 'Statistics & Sessions' }, { name: 'Parameters & Diagnostics' }],
            serviceStateTableRow: [],
        }
    },
    computed: {
        ...mapGetters({
            overlay: 'overlay',
            searchKeyWord: 'searchKeyWord',
            currentServer: 'server/currentServer',
            allServicesMap: 'service/allServicesMap',
        }),
    },

    async created() {
        let self = this
        // Initial fetch, wait for service id
        await self.fetchServer()
    },
    methods: {
        ...mapActions({
            fetchServerById: 'server/fetchServerById',
            updateServerRelationship: 'server/updateServerRelationship',
            createOrUpdateServerParameters: 'server/createOrUpdateServerParameters',
        }),
        // reuse functions for fetch loop or after finish editing
        async fetchServer() {
            await this.fetchServerById(this.$route.params.id)
            await this.fetchServiceStateLoop()
        },
        async fetchServiceStateLoop() {
            if (!this.$help.isEmpty(this.currentServer.relationships.services)) {
                let services = this.currentServer.relationships.services.data
                let servicesIdArr = services ? services.map(item => `${item.id}`) : []

                let arr = []
                for (let i = 0; i < servicesIdArr.length; ++i) {
                    let res = await this.fetchServiceState(servicesIdArr[i])
                    const {
                        id,
                        type,
                        attributes: { state },
                    } = res
                    arr.push({ id: id, state: state, type: type })
                }
                this.serviceStateTableRow = arr
            } else {
                this.serviceStateTableRow = []
            }
        },

        // fetch service state for all services or one service
        async fetchServiceState(serviceId) {
            let res
            if (serviceId) {
                res = await this.axios.get(`/services/${serviceId}?fields[services]=state`)
            } else {
                res = await this.axios.get(`/services?fields[services]=state`)
            }

            return res.data.data
        },
    },
}
</script>
