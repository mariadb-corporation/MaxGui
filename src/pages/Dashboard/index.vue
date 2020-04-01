<template>
    <div>
        <portal to="page-title">
            <h4
                style="margin-bottom: 0px; line-height: 10px;"
                class="color text-navigation text-navigation display-1 text-capitalize page-title"
            >
                {{ pageTitle }}
            </h4>
            <span class="field-text-info color text-field-text"> Uptime {{ duration }} </span>
        </portal>

        <v-slide-group v-model="model" width="100%" class="mt-5 mb-5" center-active>
            <v-slide-item>
                <div style="width:25%" class="slide-nav-item d-flex flex-column">
                    <p class="body-2 mb-3 text-uppercase color font-weight-bold text-navigation">
                        {{ $t('users') }}
                    </p>
                    <v-card outlined class="fill-height pt-2">
                        <users-chart />
                    </v-card>
                </div>
            </v-slide-item>
            <v-slide-item>
                <div style="width:25%" class="slide-nav-item d-flex flex-column">
                    <p class="body-2 mb-3 text-uppercase color font-weight-bold text-navigation">
                        {{ $t('sessions') }}
                    </p>
                    <v-card outlined class="fill-height pt-2"> <sessions-chart /></v-card>
                </div>
            </v-slide-item>
            <v-slide-item>
                <div style="width:25%" class="slide-nav-item d-flex flex-column">
                    <p class="body-2 mb-3 text-uppercase color font-weight-bold text-navigation">
                        {{ $t('dcb') }}
                    </p>
                    <v-card outlined class="fill-height pt-2"> </v-card>
                </div>
            </v-slide-item>
            <v-slide-item>
                <div style="width:25%;" class="slide-nav-item d-flex flex-column">
                    <p class="body-2 mb-3 text-uppercase color font-weight-bold text-navigation">
                        {{ $t('threadUsage') }}
                    </p>
                    <v-card outlined class="fill-height pt-2">
                        <threads-chart :isMiniChart="true" />
                    </v-card>
                </div>
            </v-slide-item>
        </v-slide-group>

        <tab-nav :tabRoutes="tabRoutes" />
        <!-- 
        <v-sheet style="margin-top:35px">
            <p class="font-weight-bold title text-uppercase color text-navigation">
                {{ $t('productName') }} {{ $t('details') }}
            </p>
            <v-card class="v-card-custom px-6 py-3" outlined height="180" maxWidth="380">
                <div v-for="(value, name) in maxscaleDetails" :key="name" class="">
                    <span v-if="name !== 'parameters'" class="d-flex ">
                        <b class="text-capitalize" style="width:45%">
                            {{ name.split('_').join(' ') }}</b
                        >
                        <v-tooltip v-if="name === 'commit'" v-model="showTooltip" top>
                            <template v-slot:activator="{ on: { dblclick } }">
                                <div
                                    style="width:55%;max-width:180px"
                                    class="d-inline-block text-truncate"
                                    @dblclick="dblclick, copyToClipboard(value)"
                                >
                                    {{ value }}
                                </div>
                            </template>
                            <span>Copied to clipboard</span>
                        </v-tooltip>
                        <div
                            v-else-if="name === 'uptime'"
                            style="width:55%;max-width:180px"
                            class="d-inline-block text-truncate"
                        >
                            {{ duration }}
                        </div>
                        <div
                            v-else
                            style="width:55%;max-width:180px"
                            class="d-inline-block text-truncate"
                        >
                            {{ formatValue(value, name) }}
                        </div>
                    </span>
                </div>

                <router-link
                    :to="{ name: 'maxscale', params: { parameters: maxscaleDetails.parameters } }"
                    class="no-underline"
                >
                    <span class="text-capitalize" style="width:45%"> Parameters</span>
                </router-link>
            </v-card>
        </v-sheet> -->
    </div>
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
import tabRoutes from 'router/tabRoutes'
import TabNav from './TabNav'
import ThreadsChart from 'pages/Statistics/ThreadsChart'
import UsersChart from 'pages/Users/UsersChart'
import SessionsChart from 'pages/Sessions/SessionsChart'

export default {
    name: 'dashboard',
    components: {
        TabNav,
        ThreadsChart,
        UsersChart,
        SessionsChart,
    },
    data() {
        return {
            model: null,
            tabRoutes: tabRoutes,
            showTooltip: false,
            uptime: null,
            duration: null,
        }
    },
    computed: {
        ...mapGetters(['maxscaleDetails']),
        pageTitle: function() {
            let version =
                this.maxscaleDetails.version !== undefined ? this.maxscaleDetails.version : ''
            return `MariaDB ${this.$t('productName')} ${version}`
        },
    },

    watch: {
        showTooltip: function(newVal) {
            if (newVal) {
                let self = this
                setTimeout(() => (self.showTooltip = false), 1500)
            }
        },
        maxscaleDetails: function(newVal) {
            this.uptime = newVal.uptime
            this.duration = this.$moment.duration(newVal.uptime, 'seconds').format()
            setInterval(() => {
                this.updateUpTime()
            }, 1000)
        },
    },
    async created() {
        await this.fetchMaxScaleDetails()
        await this.fetchAllServers()
        await this.fetchAllMonitors()
        await this.fetchAllSessions()
        await this.fetchAllServices()
    },
    methods: {
        ...mapActions([
            'fetchMaxScaleDetails',
            'fetchAllServers',
            'fetchAllMonitors',
            'fetchAllSessions',
            'fetchAllServices',
        ]),

        navigate(path) {
            this.$router.push(path)
        },
        formatValue(value, name) {
            if (name === 'started_at' || name === 'activated_at') {
                return this.$moment(value).format('HH:mm:ss MM/DD/YYYY')
            }
            return value
        },
        copyToClipboard(value) {
            document.execCommand('copy')
            this.showTooltip = true
        },
        updateUpTime() {
            this.uptime = this.uptime + 1
            this.duration = this.$moment.duration(this.uptime, 'seconds').format()
        },
    },
}
</script>

<style scoped lang="scss">
.slide-nav-item {
    margin: 0px 7px;
    &:first-of-type {
        margin-left: 0px;
    }
}
</style>
