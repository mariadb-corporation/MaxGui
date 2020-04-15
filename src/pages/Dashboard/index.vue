<template>
    <div>
        <portal to="page-title">
            <h4
                style="margin-bottom: 0px; line-height: normal;"
                class="color text-navigation text-navigation display-1 text-capitalize page-title"
            >
                {{ pageTitle }}
            </h4>

            <span
                style="position:relative;top:-15px"
                class="field-text-info color text-field-text "
            >
                Uptime {{ duration }}
            </span>

            <v-menu
                transition="slide-y-transition"
                :close-on-content-click="false"
                open-on-hover
                offset-y
                nudge-left="20"
                content-class="v-menu--with-arrow shadow-drop"
            >
                <template v-slot:activator="{ on }">
                    <v-icon
                        class="material-icons-outlined pointer"
                        style="position:relative;top:-15px"
                        size="16"
                        color="#9DB4BB"
                        v-on="on"
                    >
                        info
                    </v-icon>
                </template>

                <v-sheet style="border-radius: 10px;" class="px-6 py-4" max-width="320px">
                    <span class="d-block mb-1"> About MaxScale</span>
                    <div
                        v-for="(value, name) in $help.pick(maxscaleDetails, [
                            'commit',
                            'started_at',
                            'activated_at',
                        ])"
                        :key="name"
                    >
                        <span class="d-flex body-2">
                            <span class="text-capitalize" style="width:35%">
                                {{ name.split('_').join(' ') }}
                            </span>
                            <v-tooltip v-if="name === 'commit'" :key="copyState" top>
                                <template v-slot:activator="{ on }">
                                    <div
                                        style="width:65%;"
                                        class="pointer d-inline-block text-truncate"
                                        @dblclick="copyToClipboard(value)"
                                        v-on="on"
                                    >
                                        {{ value }}
                                    </div>
                                </template>
                                <span>
                                    {{ copyState }}
                                </span>
                            </v-tooltip>
                            <div v-else style="width:65%;" class="d-inline-block ">
                                {{ formatValue(value, name) }}
                            </div>
                        </span>
                    </div>
                </v-sheet>
            </v-menu>
        </portal>

        <div style="width:100%" class="d-flex mb-5">
            <outline-small-card cardWrapper="slide-nav-item" cardClass="slide-nav-item__card-graph">
                <template v-slot:title>
                    {{ $t('sessions') }}
                </template>
                <template v-slot:card-body>
                    <sessions-chart />
                </template>
            </outline-small-card>
            <outline-small-card cardWrapper="slide-nav-item" cardClass="slide-nav-item__card-graph">
                <template v-slot:title>
                    {{ $t('connections') }}
                </template>
                <template v-slot:card-body>
                    <users-chart />
                </template>
            </outline-small-card>
            <outline-small-card cardWrapper="slide-nav-item" cardClass="slide-nav-item__card-graph">
                <template v-slot:title>
                    {{ $t('load') }}
                </template>
                <template v-slot:card-body>
                    <threads-chart :isMiniChart="true" />
                </template>
            </outline-small-card>
        </div>
        <tab-nav :tabRoutes="tabRoutes" />
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
            tabRoutes: tabRoutes,
            isCopied: false,
            uptime: null,
            duration: null,
            containerWidth: 130,
            copyState: 'Double click to copy to clipboard',
        }
    },

    computed: {
        ...mapGetters('maxscale', ['maxscaleDetails']),
        pageTitle: function() {
            let version =
                this.maxscaleDetails.version !== undefined ? this.maxscaleDetails.version : ''
            return `MariaDB ${this.$t('productName')} ${version}`
        },
    },

    watch: {
        isCopied: function(newVal) {
            if (newVal) {
                let self = this
                self.copyState = 'Copied'
                setTimeout(
                    () => (
                        (self.isCopied = false),
                        (self.copyState = 'Double click to copy to clipboard')
                    ),
                    2000
                )
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
        await Promise.all([
            this['maxscale/fetchMaxScaleDetails'](),
            this['server/fetchAllServers'](),
            this['monitor/fetchAllMonitors'](),
            this['session/fetchAllSessions'](),
            this['service/fetchAllServices'](),
        ])
    },

    methods: {
        ...mapActions([
            'maxscale/fetchMaxScaleDetails',
            'server/fetchAllServers',
            'monitor/fetchAllMonitors',
            'session/fetchAllSessions',
            'service/fetchAllServices',
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
            this.isCopied = true
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
    margin: 0px 8px;
    width: 33.33%;
    &:first-of-type {
        margin-left: 0px;
    }
    ::v-deep &__card-graph {
        padding-top: 6px;
    }
}
</style>
