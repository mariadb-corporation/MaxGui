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

                for (let i = 0; i < this.allMonitors.length; i++) {
                    const {
                        id: monitorId,
                        attributes: { state: monitorState },
                        relationships: {
                            servers: { data },
                        },
                    } = this.allMonitors[i]
                    let serversArr = []
                    if (data.length) {
                        for (let l = 0; l < data.length; l++) {
                            serversArr.push(this.serversDataMap.get(data[l].id))
                        }
                    }
                    if (serversArr.length) {
                        for (let n = 0; n < serversArr.length; n++) {
                            const {
                                id: serverId,
                                attributes: { state: serverState, parameters, statistics },
                            } = serversArr[n]

                            let row
                            // only add these two attribute to row once, since it has rowspan > 1
                            //   monitorId: monitorId,
                            //                                     monitorState: monitorState,
                            row = {
                                serverId: serverId,
                                rowspan: serversArr.length,
                                serverAddress: parameters.address,
                                serverPort: parameters.port,
                                serverConnections: statistics.connections,
                                serverState: serverState,
                            }
                            if (n === 0) {
                                row.monitorId = monitorId
                                row.monitorState = monitorState
                            }

                            console.log('row', row)
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
    },
}
</script>
