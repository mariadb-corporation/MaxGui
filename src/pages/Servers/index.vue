<template>
    <v-row class="mt-0">
        <v-col class="pt-0" cols="12">
            <data-table-rowspan
                :headers="tableHeaders"
                :data="getData"
                :sortDesc="false"
                :singleExpand="false"
                :showExpand="false"
                :numOfColsHasRowSpan="2"
                :search="searchKeyWord"
                sortBy="monitorId"
            >
                <template v-slot:monitorId="{ data: { item: { monitorId } } }">
                    <router-link :to="`/dashboard/monitor/${monitorId}`" class="no-underline">
                        <span>{{ monitorId }} </span>
                    </router-link>
                </template>
                <template v-slot:monitorState="{ data: { item: { monitorState } } }">
                    <icon-sprite-sheet
                        size="13"
                        class="status-icon"
                        :frame="monitorStateIcon(monitorState)"
                    >
                        status
                    </icon-sprite-sheet>
                    <span>{{ monitorState }} </span>
                </template>
                <template v-slot:serverId="{ data: { item: { serverId } } }">
                    <router-link :to="`/dashboard/server/${serverId}`" class="no-underline">
                        <span>{{ serverId }} </span>
                    </router-link>
                </template>
                <template v-slot:serverStatus="{ data: { item: { serverStatus } } }">
                    <icon-sprite-sheet
                        size="13"
                        class="status-icon"
                        :frame="serverStateIcon(serverStatus)"
                    >
                        status
                    </icon-sprite-sheet>
                </template>
                <template v-slot:servicesIdArr="{ data: { item: { servicesIdArr } } }">
                    <fragment v-if="servicesIdArr.length < 2">
                        <template v-for="serviceId in servicesIdArr">
                            <router-link
                                :key="serviceId"
                                :to="`/dashboard/service/${serviceId}`"
                                class="no-underline"
                            >
                                <span>{{ serviceId }} </span>
                            </router-link>
                        </template>
                    </fragment>
                    <template v-else>
                        <v-tooltip left transition="fade-transition">
                            <template v-slot:activator="{ on }">
                                <span class="pointer color text-links" v-on="on">
                                    {{ servicesIdArr.length }} {{ $t('services').toLowerCase() }}
                                </span>
                            </template>
                            <template v-for="serviceId in servicesIdArr">
                                <router-link
                                    :key="serviceId"
                                    :to="`/dashboard/service/${serviceId}`"
                                    class="no-underline"
                                >
                                    <span>{{ serviceId }} </span>
                                </router-link>
                            </template>
                        </v-tooltip>
                    </template>
                </template>
                <!-- <template v-slot:actions="{ data: { item } }">
                    <v-tooltip top>
                        <template v-slot:activator="{ on }">
                            <v-btn
                                icon
                                color="primary"
                                v-on="on"
                                @click.stop="handleOpenModal(item)"
                            >
                                <v-icon size="16">$vuetify.icons.edit</v-icon>
                            </v-btn>
                        </template>
                        <span>{{ `${$t('server')} ${$t('update')}` }}</span>
                    </v-tooltip>
                    <delete-modal
                        :item="item"
                        type="destroy"
                        :dispatchDelete="() => destroyServer(item.id)"
                        :title="`${$t('destroy')} ${$t('server')}`"
                        :smallInfo="$t('info.serverDeleteModal')"
                    />
                </template> -->
            </data-table-rowspan>
            <!-- <server-create-or-update
                v-model="serverDialog"
                :close-modal="() => (serverDialog = false)"
                mode="patch"
                :item="chosenItem"
            /> -->
        </v-col>
    </v-row>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
// import DeleteModal from 'components/DeleteModal'
// import ServerCreateOrUpdate from './ServerCreateOrUpdate'

export default {
    name: 'servers',
    // components: {
    //     DeleteModal,
    //     ServerCreateOrUpdate,
    // },
    data() {
        return {
            //State
            tableHeaders: [
                { text: 'Monitor', value: 'monitorId' },
                { text: 'State', value: 'monitorState' },

                { text: 'Servers', sortable: false, value: 'serverId' },
                { text: 'Status', sortable: false, value: 'serverStatus' },
                { text: 'Address', sortable: false, value: 'serverAddress' },
                { text: 'Port', sortable: false, value: 'serverPort' },
                { text: 'Connections', sortable: false, value: 'serverConnections' },
                { text: 'State', sortable: false, value: 'serverState' },
                { text: 'Services', sortable: false, value: 'servicesIdArr' },
            ],
            serverDialog: false,
            chosenItem: null,
            isRowSpanAsc: true,
        }
    },
    computed: {
        ...mapGetters(['serversDataMap', 'allMonitors', 'searchKeyWord']),

        getData: function() {
            if (this.allMonitors) {
                let monitorInfo = []
                /*  First loop through monitors to get associated(linked) servers ID
                    and monitor's id and monitor's state
                */
                for (let n = 0; n < this.allMonitors.length; ++n) {
                    const {
                        id: monitorId,
                        attributes: { state: monitorState },
                        relationships: {
                            servers: { data: linkedServers },
                        },
                    } = this.allMonitors[n]
                    // Get array of obj linked servers based on linkedServers array of IDs
                    let serversArr = []
                    if (linkedServers.length) {
                        for (let l = 0; l < linkedServers.length; ++l) {
                            serversArr.push(this.serversDataMap.get(linkedServers[l].id))
                        }
                    }
                    /*  Loop through serversArr of objects to add value to row*/
                    if (serversArr.length) {
                        let lastIndex = serversArr.length - 1

                        for (let index = 0; index < serversArr.length; ++index) {
                            const {
                                id: serverId,
                                attributes: { state: serverState, parameters, statistics },
                                relationships: { services: { data: servicesData = [] } = {} },
                            } = serversArr[index]
                            let servicesIdArr = servicesData
                                ? servicesData.map(item => `${item.id}`)
                                : []
                            let row = {
                                monitorId: monitorId,
                                monitorState: monitorState,
                                rowspan: serversArr.length,
                                serverId: serverId,
                                serverStatus: serverState,
                                serverAddress: parameters.address,
                                serverPort: parameters.port,
                                serverConnections: statistics.connections,
                                serverState: serverState,
                                servicesIdArr: servicesIdArr,
                            }
                            /*  only visible the td rowspan on the first index, others row needs to have the data
                            but don't neccessary to visible, this makes rowspan work and preserves searching function */
                            if (index !== 0) row.hidden = true
                            if (index === lastIndex) row.isLastRow = true

                            monitorInfo.push(row)
                        }
                    }
                }
                return monitorInfo
            }
            return []
        },
    },

    methods: {
        ...mapActions(['destroyServer']),
        handleOpenModal: function(item) {
            this.serverDialog = true
            this.chosenItem = item
        },
        monitorStateIcon(monitorState) {
            if (monitorState.includes('Running')) return 2
            if (monitorState.includes('Stopped')) return 1
            else return ''
        },
        serverStateIcon(serverStatus) {
            if (serverStatus.includes('Running')) return 2
            if (serverStatus.includes('Down')) return 0
            else return ''
        },
    },
}
</script>
