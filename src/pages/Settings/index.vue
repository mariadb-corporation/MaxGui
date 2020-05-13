<template>
    <page-wrapper>
        <v-sheet class="mt-2">
            <page-header />
            <v-tabs v-model="currentActiveTab" class="tab-navigation-wrapper">
                <v-tab v-for="tab in tabs" :key="tab.name">
                    {{ tab.name }}
                </v-tab>

                <v-tabs-items v-model="currentActiveTab">
                    <v-tab-item class="pt-5">
                        <v-col cols="6">
                            <details-parameters-collapse
                                v-if="maxScaleParameters"
                                :searchKeyWord="searchKeyWord"
                                resourceId="maxscale"
                                :parameters="maxScaleParameters"
                                :moduleParameters="moduleParameters"
                                :updateResourceParameters="updateMaxScaleParameters"
                                :onEditSucceeded="fetchMaxScaleParameters"
                                :loading="
                                    loadingModuleParams
                                        ? true
                                        : overlay === OVERLAY_TRANSPARENT_LOADING
                                "
                            />
                        </v-col>
                    </v-tab-item>

                    <v-tab-item class="pt-5">
                        Empty
                    </v-tab-item>
                </v-tabs-items>
            </v-tabs>
        </v-sheet>
    </page-wrapper>
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

export default {
    name: 'settings',
    components: {
        PageHeader,
    },
    data() {
        return {
            OVERLAY_TRANSPARENT_LOADING: OVERLAY_TRANSPARENT_LOADING,
            currentActiveTab: null,
            tabs: [{ name: 'MaxScale Parameters' }, { name: 'Users & Permissions' }],
            moduleParameters: [],
            loadingModuleParams: true,
        }
    },
    computed: {
        ...mapGetters({
            overlay: 'overlay',
            searchKeyWord: 'searchKeyWord',
            maxScaleParameters: 'maxscale/maxScaleParameters',
        }),
    },
    async created() {
        const self = this
        await self.fetchMaxScaleParameters()
        let res = await self.axios.get(`/maxscale/modules/core?fields[module]=parameters`)
        const { attributes: { parameters = [] } = {} } = res.data.data

        self.moduleParameters = parameters.filter(param => param.modifiable)
        self.loadingModuleParams = true
        await self.$help.delay(150).then(() => (self.loadingModuleParams = false))
    },
    methods: {
        ...mapActions('maxscale', ['updateMaxScaleParameters', 'fetchMaxScaleParameters']),
    },
}
</script>
