<template>
    <v-card :outlined="darkTheme" :dark="darkTheme">
        <v-data-table
            :search="search"
            :loading="!generateTableRows.length"
            loading-text="Loading... Please wait"
            :headers="tableHeaders"
            :items="generateTableRows"
            class="data-table-full"
            sort-by="id"
            :single-expand="false"
            :expanded.sync="expanded"
            show-expand
            :dark="darkTheme"
        >
            <!-- Actions slot -->
            <template v-slot:item.data-table-expand="{ expand, isExpanded, item }">
                <div style="display:flex">
                    <server-update :item="item" />
                    <delete-modal
                        title="Delete Server"
                        :item="item"
                        :dispatchDelete="() => deleteServerById(item.id)"
                        smallInfo="Make sure it is not used by any services or monitors."
                    />
                    <!-- Sub component Activator -->
                    <v-tooltip top>
                        <template v-slot:activator="{ on }">
                            <v-btn v-on="on" @click="expand(!isExpanded)" icon color="primary">
                                <v-icon
                                    size="16"
                                    class="fa"
                                    :class="[isExpanded ? 'fa-chevron-down' : 'fa-chevron-up']"
                                    medium
                                />
                            </v-btn>
                        </template>
                        <span>Show detailed information</span>
                    </v-tooltip>
                </div>
            </template>
            <!-- Sub component -->
            <template v-slot:expanded-item="{ headers, item }">
                <!-- :colspan="headers.length" set width to full -->
                <td :colspan="headers.length">
                    <server-read :id="item.id" />
                </td>
            </template>
        </v-data-table>
    </v-card>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import DeleteModal from 'components/DeleteModal';
// import ServerCreate from './ServerCreate';
import ServerUpdate from './ServerUpdate';
import ServerRead from './ServerRead';

export default {
    name: 'servers-table',
    components: {
        DeleteModal,
        // ServerCreate,
        ServerUpdate,
        ServerRead,
    },
    props: {
        serversData: Array,
    },
    data() {
        return {
            //State
            serverStates: ['Master, Running', 'Slave, Running'],
            search: '',
            expanded: [],
            tableHeaders: [
                { text: 'Server', value: 'id' },
                { text: 'Address', value: 'address' },
                { text: 'Port', value: 'port' },
                { text: 'Connections', value: 'connections' },
                { text: 'State', value: 'state' },
                { text: 'Actions', align: 'center', value: 'data-table-expand', sortable: false },
            ],
        };
    },
    computed: {
        ...mapGetters(['darkTheme']),
        /**
         * @return {Array} An array of objects
         */
        generateTableRows: function() {
            /**
             * @param {Array} itemsArr
             *  Elements are {Object} row
             */
            if (this.serversData) {
                let itemsArr = [];
                for (let n = 0; n < this.serversData.length; n++) {
                    /**
                     * @typedef {Object} row
                     * @property {String} id - Id of the server
                     * @property {String} address - Server's address
                     * @property {Number} port - Server's port
                     * @property {Number} connections - Number of connections to the server
                     * @property {String} state - Server's state
                     */
                    const {
                        id,
                        attributes: { state, parameters, statistics },
                    } = this.serversData[n];
                    let row = {
                        id: id,
                        address: parameters.address,
                        port: parameters.port,
                        connections: statistics.connections,
                        state: state,
                    };
                    itemsArr.push(row);
                }
                return itemsArr;
            }
            return [];
        },
    },
    methods: {
        ...mapActions(['deleteServerById']),
    },
};
</script>

<style lang="scss" scoped></style>
