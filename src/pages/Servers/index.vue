<template>
    <v-row class="mt-0">
        <v-col class="pt-0" cols="10">
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
                { text: 'State', sortable: true, value: 'monitorState' },

                { text: 'Servers', sortable: false, value: 'serverId' },
                { text: 'Address', sortable: false, value: 'serverAddress' },
                { text: 'Port', sortable: false, value: 'serverPort' },
                { text: 'Connections', sortable: false, value: 'serverConnections' },
                { text: 'State', sortable: false, value: 'serverState' },
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
                            } = serversArr[index]

                            let row = {
                                monitorId: monitorId,
                                monitorState: monitorState,
                                rowspan: serversArr.length,
                                serverId: serverId,
                                serverAddress: parameters.address,
                                serverPort: parameters.port,
                                serverConnections: statistics.connections,
                                serverState: serverState,
                            }
                            /*  only visible the td rowspan on the first index, others row needs to have the data
                            but don't neccessary to visible, this makes rowspan work and preserves searching function */
                            if (index !== 0) {
                                row.hidden = true
                            }
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
    async created() {
        await this.fetchServers()
        await this.fetchAllMonitors()
    },

    methods: {
        ...mapActions(['fetchServers', 'destroyServer', 'fetchAllMonitors']),
        handleOpenModal: function(item) {
            this.serverDialog = true
            this.chosenItem = item
        },
    },
}
</script>
