<template>
    <v-row class="mt-5">
        <portal to="page-title">
            <h4
                style="margin-bottom: 0px; line-height: 10px;"
                class="color text-navigation text-navigation display-1 text-capitalize page-title"
            >
                {{ $route.name }}
            </h4>
        </portal>
        <v-col class="pt-0" cols="10">
            <data-table
                :headers="tableHeaders"
                :data="getData"
                :sortDesc="false"
                :singleExpand="false"
                :showExpand="false"
                :onRowClick="onRowClick"
                :search="searchKeyWord"
            >
            </data-table>
        </v-col>
    </v-row>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
    name: 'settings',

    data() {
        return {
            //State
            tableHeaders: [
                { text: 'Monitor', value: 'monitorId' },
                { text: 'State', sortable: false, value: 'monitorState' },
            ],
            tableHeaderTwo: [
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
                let monitorIndex = this.isRowSpanAsc ? 0 : this.allMonitors.length - 1

                for (
                    monitorIndex;
                    this.isRowSpanAsc ? monitorIndex < this.allMonitors.length : monitorIndex >= 0;
                    this.isRowSpanAsc ? ++monitorIndex : --monitorIndex
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
                        let linkedServerIndex = this.isRowSpanAsc ? 0 : linkedServers.length - 1
                        for (
                            linkedServerIndex;
                            this.isRowSpanAsc
                                ? linkedServerIndex < linkedServers.length
                                : linkedServerIndex >= 0;
                            this.isRowSpanAsc ? ++linkedServerIndex : --linkedServerIndex
                        ) {
                            serversArr.push(
                                this.serversDataMap.get(linkedServers[linkedServerIndex].id)
                            )
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
                        let serverIndex = this.isRowSpanAsc ? 0 : lastIndex
                        for (
                            serverIndex;
                            this.isRowSpanAsc ? serverIndex < serversArr.length : serverIndex >= 0;
                            this.isRowSpanAsc ? ++serverIndex : --serverIndex
                        ) {
                            const {
                                id: serverId,
                                attributes: { state: serverState, parameters, statistics },
                            } = serversArr[serverIndex]

                            let row
                            /*   only add these two attribute to index 0 for asc mode, last index if desc mode
                             since it has rowspan > 1 */

                            row = {
                                monitorId: monitorId,
                                monitorState: monitorState,
                                serverId: serverId,
                                rowspan: serversArr.length,
                                serverAddress: parameters.address,
                                serverPort: parameters.port,
                                serverConnections: statistics.connections,
                                serverState: serverState,
                            }
                            switch (this.isRowSpanAsc) {
                                case true:
                                    if (serverIndex !== 0) {
                                        row.hidden = true
                                    }
                                    break
                                case false:
                                    if (serverIndex !== lastIndex) {
                                        row.hidden = true
                                    }
                            }
                            // switch (this.isRowSpanAsc) {
                            //     case true:
                            //         if (serverIndex === 0) {
                            //             row.monitorId = monitorId
                            //             row.monitorState = monitorState
                            //         }
                            //         break
                            //     case false:
                            //         if (serverIndex === lastIndex) {
                            //             row.monitorId = monitorId
                            //             row.monitorState = monitorState
                            //         }
                            // }

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
            this.isRowSpanAsc = !this.isRowSpanAsc
        },
    },
}
</script>
