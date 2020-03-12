<template>
    <v-card :outlined="darkTheme" :dark="darkTheme" class="v-card-custom">
        <data-table
            :headers="tableHeaders"
            :data="tableRows"
            :sortDesc="false"
            :loading="!tableRows.length"
            :singleExpand="false"
            :showExpand="true"
            sortBy="id"
        >
            <template v-slot:actions="{ data: { item } }">
                <service-update :item="item" />
                <delete-modal
                    :item="item"
                    :dispatchDelete="() => deleteServiceById(item.id)"
                    title="Delete Service"
                    smallInfo="A service can only be destroyed if the service uses no servers or filters and all the listeners
                        pointing to the service have been destroyed."
                />
            </template>
            <template v-slot:expandable="{ data: { item } }">
                <service-read :id="item.id" />
            </template>
        </data-table>
    </v-card>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import ServiceUpdate from './ServiceUpdate';
import ServiceRead from './ServiceRead';
import DeleteModal from 'components/DeleteModal';

export default {
    name: 'ServicesTable',
    components: {
        ServiceRead,
        ServiceUpdate,
        DeleteModal,
    },
    props: {
        servicesData: Array,
    },
    data() {
        return {
            //State
            search: '',
            expanded: [],
            tableHeaders: [
                { text: 'Service', value: 'id' },
                { text: 'Router', value: 'router' },
                { text: 'Connections', value: 'connections' },
                { text: 'Total Connections', value: 'total_connections' },
                { text: 'Servers', value: 'servers' },
                { text: 'Actions', align: 'center', value: '', sortable: false },
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
                        servers: serversList.toString(),
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
