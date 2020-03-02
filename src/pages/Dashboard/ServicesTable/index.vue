<template>
    <v-card :outlined="darkTheme" :dark="darkTheme">
        <v-card-title>
            <h3>Services</h3>
            <v-spacer />
            <v-text-field v-model="search" :append-icon="mdiMagnify" label="Search" single-line hide-details />
            <service-create />
        </v-card-title>
        <v-data-table
            :search="search"
            loading-text="Loading... Please wait"
            :headers="tableHeaders"
            :items="tableRows"
            :loading="!tableRows.length"
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
                    <service-update :item="item" />
                    <delete-modal
                        title="Delete Service"
                        :item="item"
                        :dispatchDelete="() => deleteServiceById(item.id)"
                        smallInfo="A service can only be destroyed if the service uses no servers or filters and all the listeners
                        pointing to the service have been destroyed."
                    />
                    <!-- Sub component Activator -->
                    <v-tooltip top>
                        <template v-slot:activator="{ on }">
                            <v-btn v-on="on" v-if="!isExpanded" @click="expand(!isExpanded)" icon color="primary">
                                <v-icon medium>{{ mdiChevronDown }}</v-icon>
                            </v-btn>
                            <v-btn v-else v-on="on" @click="expand(!isExpanded)" icon color="primary">
                                <v-icon medium>{{ mdiChevronUp }}</v-icon>
                            </v-btn>
                        </template>
                        <span>Show detailed information</span>
                    </v-tooltip>
                </div>
            </template>

            <!--Sub component -->
            <template v-slot:expanded-item="{ headers, item }">
                <!-- :colspan="headers.length" set width to full -->
                <td :colspan="headers.length">
                    <service-read :id="item.id" />
                </td>
            </template>
        </v-data-table>
    </v-card>
</template>

<script>
import { mdiChevronUp, mdiChevronDown, mdiMagnify } from '@mdi/js';
import { mapGetters, mapActions } from 'vuex';
import ServiceCreate from './ServiceCreate';
import ServiceUpdate from './ServiceUpdate';
import ServiceRead from './ServiceRead';
import DeleteModal from 'components/DeleteModal';

export default {
    name: 'services-table',
    components: {
        ServiceCreate,
        ServiceRead,
        ServiceUpdate,
        DeleteModal,
    },
    props: {
        servicesData: Array,
    },
    data() {
        return {
            //Icons
            mdiMagnify: mdiMagnify,
            mdiChevronUp: mdiChevronUp,
            mdiChevronDown: mdiChevronDown,
            //State
            search: '',
            expanded: [],
            tableHeaders: [
                { text: 'Service', value: 'id' },
                { text: 'Router', value: 'router' },
                { text: 'Connections', value: 'connections' },
                { text: 'Total Connections', value: 'total_connections' },
                { text: 'Servers', value: 'servers' },
                { text: 'Actions', align: 'center', value: 'data-table-expand', sortable: false },
            ],
            tableRows: [],
        };
    },

    computed: {
        ...mapGetters(['darkTheme']),
    },
    watch: {
        servicesData: function(newVal, oldVal) {
            this.generateTableRows(newVal);
        },
    },
    methods: {
        ...mapActions(['deleteServiceById']),
        /**
         * @return {Array} An array of objects
         */
        generateTableRows: function(servicesData) {
            /**
             * @param {Array} itemsArr
             *  Elements are {Object} row
             */
            if (servicesData) {
                let itemsArr = [];
                for (let n = 0; n < servicesData.length; n++) {
                    /**
                     * @typedef {Object} row
                     * @property {String} row.id - Service's name
                     * @property {String} row.router - Server's address
                     * @property {Number} row.total_connections - Server's address
                     * @property {Number} row.connections - Number of connections to the server
                     * @property {Array} row,servers - Server's state
                     */
                    const {
                        id,
                        attributes: { router, connections, total_connections },
                        relationships: { servers: { data: serversData = [] } = {} },
                    } = servicesData[n] || {};

                    let serversList = serversData ? serversData.map(item => ` ${item.id}`) : [];
                    let row = {
                        id: id,
                        router: router,
                        connections: connections,
                        total_connections: total_connections,
                        servers: serversList,
                    };
                    itemsArr.push(row);
                }
                return (this.tableRows = itemsArr);
            }
            return [];
        },
    },
};
</script>

<style lang="scss" scoped></style>
