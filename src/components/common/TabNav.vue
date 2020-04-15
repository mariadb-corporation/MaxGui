<template>
    <v-tabs v-model="currentActiveTab" class="tab-navigation-wrapper">
        <fragment v-if="isRoute">
            <v-tab v-for="tab in tabs" :key="tab.path" :to="tab.path">
                {{ tab.name === 'sessions' ? 'Current Sessions' : tab.name }}
                <span class="field-text-info color text-field-text">
                    ({{ getTotal(tab.name) }})
                </span>
            </v-tab>
        </fragment>

        <v-tabs-items v-model="currentActiveTab">
            <fragment v-if="isRoute">
                <v-tab-item v-for="tab in tabs" :id="tab.path" :key="tab.name" class="pt-5">
                    <router-view v-if="currentActiveTab === tab.path" />
                </v-tab-item>
            </fragment>
            <fragment else>
                <v-tab-item v-for="tab in tabs" :id="tab.id" :key="tab.id" class="pt-5">
                    {{ tab.component }}
                </v-tab-item>
            </fragment>
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
        tabs: Array,
        isRoute: { type: Boolean, required: true },
        value: { type: String, required: true },
    },
    data() {
        return {
            activeTab: '',
        }
    },

    computed: {
        ...mapGetters({
            allServers: 'server/allServers',
            allSessions: 'session/allSessions',
            allServices: 'service/allServices',
        }),
        currentActiveTab: {
            // get value from props
            get() {
                return this.value
            },
            // set the value to show property in data
            set(value) {
                this.activeTab = value
            },
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
                    total = this.allServices.length
                    break
                case 'sessions':
                    total = this.allSessions.length || 2 // testing add 2 sessions
            }
            return total
        },
    },
}
</script>
