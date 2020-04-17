<template>
    <v-sheet v-if="!$help.isEmpty(currentService)" class="px-6">
        <page-header :currentService="currentService" />
        <overview-header :currentService="currentService" />
        <v-tabs v-model="currentActiveTab" class="tab-navigation-wrapper">
            <v-tab v-for="tab in tabs" :key="tab.name">
                {{ tab.name }}
            </v-tab>

            <v-tabs-items v-model="currentActiveTab">
                <v-tab-item class="pt-5">
                    <ServerSessionTab
                        :currentService="currentService"
                        :searchKeyWord="searchKeyWord"
                    />
                </v-tab-item>
                <!-- Parameters & Diagnostics tab -->
                <v-tab-item class="pt-5">
                    <parameter-diagnostics-tab
                        :currentService="currentService"
                        :searchKeyWord="searchKeyWord"
                        :createOrUpdateService="createOrUpdateService"
                        :onEditSucceeded="fetch"
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
        }),
    },

    async created() {
        await this.fetch()
    },
    methods: {
        ...mapActions('service', ['fetchServiceById', 'createOrUpdateService']),
        fetch() {
            this.fetchServiceById(this.$route.params.id)
        },
    },
}
</script>
