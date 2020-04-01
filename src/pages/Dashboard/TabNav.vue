<template>
    <v-tabs v-model="activeTab">
        <v-tab
            v-for="route in tabRoutes"
            :key="route.path"
            :to="route.path"
            class="color border-bottom-table-header "
        >
            {{ route.name }}

            <span class="field-text-info color text-field-text">
                ({{ getTotal(route.name) }})
            </span>
        </v-tab>
        <v-tabs-items v-model="activeTab">
            <v-tab-item v-for="route in tabRoutes" :id="route.path" :key="route.name" class="pt-5">
                <router-view v-if="activeTab === route.path" />
            </v-tab-item>
        </v-tabs-items>
    </v-tabs>
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
import { mapGetters } from 'vuex'

export default {
    name: 'tab-nav',
    props: {
        tabRoutes: Array,
    },
    data() {
        return {
            activeTab: '/dashboard/servers',
            total: null,
        }
    },
    computed: {
        ...mapGetters(['searchKeyWord', 'allServers', 'servicesData']),

        // tabRoutesFilter() {
        //     let self = this
        //     // let filteredData = this.tabRoutes.filter(obj => obj.name.includes(self.searchKeyWord))
        //     let filteredData = this.tabRoutes.filter(obj => !obj.name === 'dashboardHome')

        //     return filteredData
        // },
    },
    watch: {
        $route: function(to, from) {
            this.activeTab = to
        },
    },
    methods: {
        getTotal(name) {
            let total = null
            switch (name) {
                case 'servers':
                    total = this.allServers.length
                    break
                case 'services':
                    total = this.servicesData.length
            }
            return total
        },
    },
}
</script>
