<template>
    <div>
        <portal to="page-title">
            <h4
                style="margin-bottom: 0px; line-height: normal;"
                class="color text-navigation text-navigation display-1 text-capitalize page-title"
            >
                {{ pageTitle }}
            </h4>
            <span style="position:relative;top:-15px" class="field-text-info color text-field-text">
                Uptime {{ duration }}
            </span>
        </portal>

        <v-slide-group width="100%" class="mb-5" center-active>
            <v-slide-item>
                <outline-small-card
                    cardWrapper="slide-nav-item"
                    cardClass="slide-nav-item__card-graph"
                >
                    <template v-slot:title>
                        {{ $t('users') }}
                    </template>
                    <template v-slot:card-body>
                        <users-chart />
                    </template>
                </outline-small-card>
            </v-slide-item>
            <v-slide-item>
                <outline-small-card
                    cardWrapper="slide-nav-item"
                    cardClass="slide-nav-item__card-graph"
                >
                    <template v-slot:title>
                        {{ $t('sessions') }}
                    </template>
                    <template v-slot:card-body>
                        <sessions-chart />
                    </template>
                </outline-small-card>
            </v-slide-item>
            <!-- <v-slide-item>
                <outline-small-card
                    cardWrapper="slide-nav-item"
                    cardClass="slide-nav-item__card-graph"
                >
                    <template v-slot:title>
                        {{ $t('sessions') }}
                    </template>
                    <template v-slot:card-body>
                        TODO: A graph here
                    </template>
                </outline-small-card>
            </v-slide-item> -->

            <v-slide-item>
                <outline-small-card
                    cardWrapper="slide-nav-item"
                    cardClass="slide-nav-item__card-graph"
                >
                    <template v-slot:title>
                        {{ $t('threadUsage') }}
                    </template>
                    <template v-slot:card-body>
                        <threads-chart :isMiniChart="true" />
                    </template>
                </outline-small-card>
            </v-slide-item>
        </v-slide-group>

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
            model: null,
            tabRoutes: tabRoutes,
            showTooltip: false,
            uptime: null,
            duration: null,
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
    margin: 0px 8px;
    width: 25%;
    &:first-of-type {
        margin-left: 0px;
    }
    ::v-deep &__card-graph {
        padding-top: 6px;
    }
}
</style>
