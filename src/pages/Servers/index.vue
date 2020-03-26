<template>
    <v-row class="mt-0">
        <v-col class="pt-0" cols="10">
            <data-table
                :headers="tableHeaders"
                :data="getData"
                :sortDesc="false"
                :singleExpand="false"
                :showExpand="false"
                :onRowClick="onRowClick"
                :colsHasRowSpan="2"
                :rowSpanSortMethod="rowSpanSortHandle"
            >
                <template v-slot:actions="{ data: { item } }">
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
                </template>
            </data-table>
            <server-create-or-update
                v-model="serverDialog"
                :close-modal="() => (serverDialog = false)"
                mode="patch"
                :item="chosenItem"
            />
        </v-col>
    </v-row>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import DeleteModal from 'components/DeleteModal'
import ServerCreateOrUpdate from './ServerCreateOrUpdate'

export default {
    name: 'servers',
    components: {
        DeleteModal,
        ServerCreateOrUpdate,
    },
    data() {
        return {
            //State
            tableHeaders: [
                { text: 'Monitor', value: 'monitorId' },
                { text: 'State', sortable: false, value: 'monitorState' },

                { text: 'Servers', sortable: false, value: 'serverId' },
                { text: 'Address', sortable: false, value: 'serverAddress' },
                { text: 'Port', sortable: false, value: 'serverPort' },
                { text: 'Connections', sortable: false, value: 'serverConnections' },
                { text: 'State', sortable: false, value: 'serverState' },
            ],
            serverDialog: false,
            chosenItem: null,
            isAsc: true,
        }
    },
    computed: {
        ...mapGetters(['serversDataMap', 'allMonitors']),
        /**
         * @return {Array} An array of objects
         */
        // generateTableRows: function() {
        //     if (this.serversData) {
        //         let itemsArr = []
        //         for (let n = this.serversData.length - 1; n >= 0; --n) {
        //             /**
        //              * @typedef {Object} row
        //              * @property {String} id - Id of the server
        //              * @property {String} address - Server's address
        //              * @property {Number} port - Server's port
        //              * @property {Number} connections - Number of connections to the server
        //              * @property {String} state - Server's state
        //              */
        //             const {
        //                 id,
        //                 attributes: { state, parameters, statistics },
        //             } = this.serversData[n]
        //             let row = {
        //                 id: id,
        //                 address: parameters.address,
        //                 port: parameters.port,
        //                 connections: statistics.connections,
        //                 state: state,
        //             }
        //             itemsArr.push(row)
        //         }
        //         return itemsArr
        //     }
        //     return []
        // },
        getNumberOfRows: function() {
            let rowsNum = 0
            if (this.allMonitors) {
                for (let n = this.allMonitors.length - 1; n >= 0; --n) {
                    rowsNum += this.allMonitors.relationships.servers.data.length
                }
                return rowsNum
            }
            return rowsNum
        },
        getData: function() {
            if (this.allMonitors) {
                let monitorInfo = []
                /*  First loop through monitors to get associated(linked) servers ID
                    and monitor's id and monitor's state
                    This loop direction is affected by asc/desc mode
                */
                // for (let i = this.allMonitors.length - 1; i >= 0; --i) {
                let monitorIndex = this.isAsc ? 0 : this.allMonitors.length - 1

                for (
                    monitorIndex;
                    this.isAsc ? monitorIndex < this.allMonitors.length : monitorIndex >= 0;
                    this.isAsc ? ++monitorIndex : --monitorIndex
                ) {
                    const {
                        id: monitorId,
                        attributes: { state: monitorState },
                        relationships: {
                            servers: { data: linkedServers },
                        },
                    } = this.allMonitors[monitorIndex]
                    // Get array of obj linked servers based on linkedServers array of IDs
                    let serversArr = []
                    if (linkedServers.length) {
                        for (let l = linkedServers.length - 1; l >= 0; --l) {
                            serversArr.push(this.serversDataMap.get(linkedServers[l].id))
                        }
                    }
                    /*  Loop through serversArr of objects to add value to row
                        This loop direction is affected by asc/desc mode
                        Asc or desc mode is changes here, if it asc mode, the monitorID and monitorState
                        should be add to row object at the first index to have "rowspan" mode, otherwise
                        those attributes should be added at the last index
                   */
                    if (serversArr.length) {
                        let lastIndex = serversArr.length - 1
                        let serverIndex = this.isAsc ? 0 : lastIndex
                        for (
                            serverIndex;
                            this.isAsc ? serverIndex < serversArr.length : serverIndex >= 0;
                            this.isAsc ? ++serverIndex : --serverIndex
                        ) {
                            const {
                                id: serverId,
                                attributes: { state: serverState, parameters, statistics },
                            } = serversArr[serverIndex]

                            let row
                            /*   only add these two attribute to index 0 for asc mode, last index if desc mode
                             since it has rowspan > 1 */
                            //   monitorId: monitorId,
                            //  monitorState: monitorState,
                            row = {
                                serverId: serverId,
                                rowspan: serversArr.length,
                                serverAddress: parameters.address,
                                serverPort: parameters.port,
                                serverConnections: statistics.connections,
                                serverState: serverState,
                            }
                            switch (this.isAsc) {
                                case true:
                                    if (serverIndex === 0) {
                                        row.monitorId = monitorId
                                        row.monitorState = monitorState
                                    }
                                    break
                                case false:
                                    if (serverIndex === lastIndex) {
                                        row.monitorId = monitorId
                                        row.monitorState = monitorState
                                    }
                            }

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
        onRowClick(item, header) {
            // this.$router.push('/dashboard/server/' + item.id)
        },
        rowSpanSortHandle() {
            console.log('rowSpanSortHandle')
            this.isAsc = !this.isAsc
        },
    },
}
</script>
