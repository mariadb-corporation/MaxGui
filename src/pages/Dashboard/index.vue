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

        <v-slide-group v-model="model" width="100%" class="mb-5" center-active>
            <v-slide-item>
                <div style="width:25%" class="slide-nav-item d-flex flex-column">
                    <p class="body-2 mb-3 text-uppercase color font-weight-bold text-navigation">
                        {{ $t('users') }}
                    </p>
                    <v-card outlined class="fill-height pt-2"> </v-card>
                </div>
            </v-slide-item>
            <v-slide-item>
                <div style="width:25%" class="slide-nav-item d-flex flex-column">
                    <p class="body-2 mb-3 text-uppercase color font-weight-bold text-navigation">
                        {{ $t('sessions') }}
                    </p>

                    <v-card outlined class="fill-height pt-2"> </v-card>
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
                        <mini-threads-chart-container v-if="chartdata.datasets.length" />
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
import { mapGetters, mapMutations, mapActions } from 'vuex'
import tabRoutes from 'router/tabRoutes'
import TabNav from './TabNav'
import MiniThreadsChartContainer from 'pages/Statistics/MiniThreadsChartContainer'

export default {
    name: 'dashboard',
    components: {
        TabNav,
        MiniThreadsChartContainer,
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
        ...mapGetters(['maxscaleDetails', 'chartdata']),
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
        await this.resetDestroyState()
        await this.fetchThreads()
        await this.fetchServers()
        await this.fetchAllMonitors()
        await this.fetchServices()
    },
    methods: {
        ...mapActions([
            'fetchMaxScaleDetails',
            'fetchThreads',
            'fetchServers',
            'fetchAllMonitors',
            'fetchServices',
        ]),
        ...mapMutations(['resetDestroyState']),

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
