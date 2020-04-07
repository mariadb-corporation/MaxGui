<template>
    <v-sheet v-if="!$help.isEmpty(currentServer)" class="px-6">
        <details-page-title />
        <icon-sprite-sheet
            size="13"
            class="status-icon mr-1"
            :frame="$help.serverStateIcon(currentServer.attributes.state)"
        >
            status
        </icon-sprite-sheet>
        <span class="color text-navigation body-2">
            {{ currentServer.attributes.state.includes('Running') ? 'Running' : 'Down' }}
        </span>
        <span class="color text-field-text body-2">
            {{ !$help.isEmpty(currentServer.attributes.version_string) ? '|' : '' }}
            <span>{{ currentServer.attributes.version_string }}</span>
        </span>
        <v-slide-group :show-arrows="false" class="mb-5" center-active>
            <v-slide-item>
                <fragment>
                    <template v-for="(value, name, index) in getTopOverviewInfo">
                        <outline-small-card
                            :key="name"
                            cardWrapper="detail-overview mt-6"
                            cardClass="detail-overview__card px-10"
                        >
                            <template v-if="index === 0" v-slot:title>
                                {{ $t('overview') }}
                            </template>
                            <template v-slot:card-body>
                                <span
                                    class="caption text-uppercase font-weight-bold color text-deep-ocean"
                                >
                                    {{ name.replace('_', ' ') }}
                                </span>
                                <router-link
                                    v-if="name === 'monitor' && value !== 'undefined'"
                                    :key="index"
                                    :to="`/dashboard/monitors/${value}`"
                                    class="body-2 no-underline"
                                >
                                    <span>{{ value }} </span>
                                </router-link>
                                <span v-else class="text-no-wrap body-2">
                                    <span v-if="value !== 'undefined'">
                                        {{
                                            name === 'triggered_at' && value !== 'undefined'
                                                ? $help.formatValue(value, 'DATE_RFC2822')
                                                : value
                                        }}
                                    </span>
                                </span>
                            </template>
                        </outline-small-card>
                    </template>
                </fragment>
            </v-slide-item>
        </v-slide-group>

        <v-row>
            <!-- STATISTICS TABLE -->
            <v-col cols="6">
                <div class="mb-1 d-flex align-center">
                    <v-btn
                        icon
                        class="arrow-toggle"
                        @click="() => (showStatistics = !showStatistics)"
                    >
                        <v-icon :class="[!showStatistics ? 'arrow-down' : 'arrow-up']" size="32">
                            $expand
                        </v-icon>
                    </v-btn>
                    <p class="mb-0 body-2 font-weight-bold color text-navigation text-uppercase">
                        {{ $t('statistics') }}
                    </p>
                </div>
                <v-expand-transition>
                    <div v-show="showStatistics">
                        <data-table
                            class="table-fluid"
                            :headers="variableValueTableHeaders"
                            :data="tableRowProcessed('statistics')"
                            :tdBorderLeft="true"
                        />
                    </div>
                </v-expand-transition>
            </v-col>
            <!-- SERVICE TABLE -->
            <v-col cols="3">
                <div class="mb-1 d-flex align-center">
                    <div class="d-flex align-center">
                        <v-btn
                            icon
                            class="arrow-toggle"
                            @click="() => (showServices = !showServices)"
                        >
                            <v-icon :class="[!showServices ? 'arrow-down' : 'arrow-up']" size="32">
                                $expand
                            </v-icon>
                        </v-btn>
                        <p
                            class="mb-0 body-2 font-weight-bold color text-navigation text-uppercase"
                        >
                            {{ $t('services') }}
                            <span class="ml-1 color text-field-text"
                                >({{ servicesLinked.length }})
                            </span>
                        </p>
                    </div>
                    <v-spacer />
                    <v-btn
                        color="primary"
                        text
                        x-small
                        class="text-capitalize"
                        @click="() => (addToServiceDialog = true)"
                    >
                        + {{ $t('addService') }}
                    </v-btn>
                </div>
                <v-expand-transition>
                    <div v-show="showServices">
                        <data-table
                            :headers="servicesTableHeader"
                            :data="servicesLinked"
                            :sortDesc="false"
                            sortBy="id"
                            class="table-fluid"
                            :noDataText="$t('noService')"
                        >
                            <template v-slot:state="{ data: { item: { state } } }">
                                <icon-sprite-sheet
                                    size="13"
                                    class="status-icon"
                                    :frame="$help.serviceStateIcon(state)"
                                >
                                    status
                                </icon-sprite-sheet>
                            </template>
                        </data-table>
                    </div>
                </v-expand-transition>
            </v-col>
            <!-- SLAVE SERVER IDS TABLE -->
            <v-col cols="3">
                <div class="mb-1 d-flex align-center">
                    <v-btn
                        icon
                        class="arrow-toggle"
                        @click="() => (showSlaveServerIds = !showSlaveServerIds)"
                    >
                        <v-icon
                            :class="[!showSlaveServerIds ? 'arrow-down' : 'arrow-up']"
                            size="32"
                        >
                            $expand
                        </v-icon>
                    </v-btn>
                    <p class="mb-0 body-2 font-weight-bold color text-navigation text-uppercase">
                        {{ $t('slaveServerIds') }}
                        <span class="ml-1 color text-field-text">
                            ({{ tableRowProcessed('slaveServers').length }})
                        </span>
                    </p>
                </div>
                <v-expand-transition>
                    <div v-show="showSlaveServerIds">
                        <data-table
                            class="table-fluid"
                            :headers="slaveServersTableHeaders"
                            :data="tableRowProcessed('slaveServers')"
                        />
                    </div>
                </v-expand-transition>
            </v-col>
        </v-row>
        <!-- PARAMETERS TABLE -->
        <v-row>
            <v-col cols="6">
                <div class="mb-1 d-flex align-center">
                    <v-btn
                        icon
                        class="arrow-toggle"
                        @click="() => (showParameters = !showParameters)"
                    >
                        <v-icon :class="[!showParameters ? 'arrow-down' : 'arrow-up']" size="32">
                            $expand
                        </v-icon>
                    </v-btn>
                    <p class="mb-0 body-2 font-weight-bold color text-navigation text-uppercase">
                        {{ $t('parameters') }}
                    </p>
                </div>
                <v-expand-transition>
                    <div v-show="showParameters">
                        <data-table
                            class="table-fluid"
                            :headers="variableValueTableHeaders"
                            :data="tableRowProcessed('parameters')"
                            :tdBorderLeft="true"
                        />
                    </div>
                </v-expand-transition>
            </v-col>
        </v-row>
    </v-sheet>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
    name: 'server-detail',
    props: {
        id: String,
    },
    data() {
        return {
            addToServiceDialog: false,
            servicesLinked: [],
            servicesTableHeader: [
                { text: 'Service', value: 'id' },
                { text: 'Status', value: 'state' },
            ],
            variableValueTableHeaders: [
                { text: 'Variable', value: 'id', width: '65%' },
                { text: 'Value', value: 'value', width: '35%' },
            ],
            slaveServersTableHeaders: [{ text: 'Slave Servers', value: 'id' }],
            showStatistics: true,
            showServices: true,
            showSlaveServerIds: true,
            showParameters: true,
        }
    },
    computed: {
        ...mapGetters({
            currentServer: 'server/currentServer',
            allServicesMap: 'service/allServicesMap',
        }),
        getTopOverviewInfo: function() {
            let self = this
            let currentServer = self.$help.cloneDeep(self.currentServer)
            let overviewInfo = {}
            if (!self.$help.isEmpty(currentServer)) {
                // Set fallback undefined value if properties doesnt exist
                const {
                    attributes: {
                        state,
                        last_event = undefined,
                        triggered_at = undefined,
                        node_id = undefined,
                        parameters: {
                            address = undefined,
                            socket = undefined,
                            port = undefined,
                        } = {},
                    } = {},
                    relationships: { monitors = undefined } = {},
                } = currentServer

                overviewInfo = {
                    address: address,
                    socket: socket,
                    port: port,
                    state: state,
                    last_event: last_event,
                    triggered_at: triggered_at,
                    monitor: monitors ? monitors.data[0].id : undefined,
                    node_id: node_id,
                }

                if (socket) {
                    delete overviewInfo.address
                    delete overviewInfo.port
                } else delete overviewInfo.socket
                Object.keys(overviewInfo).forEach(
                    key => (overviewInfo[key] = self.$help.handleValue(overviewInfo[key]))
                )
            }
            return overviewInfo
        },
        tableRowProcessed() {
            return type => {
                let currentServer = this.$help.cloneDeep(this.currentServer)
                if (!this.$help.isEmpty(currentServer)) {
                    switch (type) {
                        case 'parameters': {
                            const { attributes: { parameters = {} } = {} } = currentServer
                            return this.$help.objToArrOfObj(parameters)
                        }
                        case 'statistics': {
                            // Set fallback null value if properties doesnt exist
                            const { attributes: { statistics = null } = {} } = currentServer
                            return this.$help.objToArrOfObj(statistics)
                        }
                        case 'slaveServers': {
                            const { attributes: { slave_connections = [] } = {} } = currentServer
                            // let slave_connections_test = [1001, 1002, 1003]
                            let data = []
                            for (let i = 0; i < slave_connections.length; ++i) {
                                if (typeof slave_connections[i] === 'number') {
                                    data.push({ id: slave_connections[i] })
                                }
                            }

                            return data
                        }
                    }
                }
                return []
            }
        },
    },
    watch: {
        currentServer: function(newVal) {
            // If relationships.services is not empty then fetch data of linked services
            if (!this.$help.isEmpty(newVal.relationships.services)) {
                let services = newVal.relationships.services.data
                let servicesIdArr = services ? services.map(item => `${item.id}`) : []
                // Get array of obj linked servers based on linkedServers array of IDs
                this.fetchServiceFieldsets(servicesIdArr)
            }
        },
    },
    async created() {
        await this.fetchServerById(this.$route.params.id)
    },
    methods: {
        ...mapActions('server', ['fetchServerById']),
        processServicesLinked(arr) {
            this.servicesLinked = arr
        },
        async fetchServiceFieldsets(idArray) {
            try {
                let arr = []
                for (let i = 0; i < idArray.length; ++i) {
                    let res = await this.axios.get(`/services/${idArray[i]}?fields[services]=state`)
                    if (res.status === 200) {
                        const {
                            id,
                            attributes: { state },
                        } = res.data.data
                        arr.push({ id: id, state: state })
                    }
                }
                return this.processServicesLinked(arr)
            } catch (e) {
                return e
            }
        },
    },
}
</script>
