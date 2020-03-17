<template>
    <fragment>
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
                <v-tooltip top>
                    <template v-slot:activator="{ on }">
                        <v-btn icon color="primary" v-on="on" @click="handleOpenModal(item)">
                            <v-icon size="16">$vuetify.icons.edit</v-icon>
                        </v-btn>
                    </template>
                    <span>{{ `${$t('service')} ${$t('update')}` }}</span>
                </v-tooltip>

                <delete-modal
                    :item="item"
                    :dispatchDelete="() => destroyService(item.id)"
                    :title="`${$t('delete')} ${$t('service')}`"
                    :smallInfo="$t('info.serviceDeleteModal')"
                />
            </template>
            <template v-slot:expandable="{ data: { item } }">
                <service-read :id="item.id" />
            </template>
        </data-table>

        <service-create-or-update
            v-model="serviceDialog"
            :close-modal="() => (serviceDialog = false)"
            mode="patch"
            :item="chosenItem"
        />
    </fragment>
</template>

<script>
import { mapActions } from 'vuex'
import ServiceCreateOrUpdate from '../ServiceCreateOrUpdate'
import ServiceRead from './ServiceRead'
import DeleteModal from 'components/DeleteModal'

export default {
    name: 'services-table',
    components: {
        ServiceRead,
        ServiceCreateOrUpdate,
        DeleteModal,
    },
    props: {
        servicesData: Array,
    },
    data() {
        return {
            //State
            tableHeaders: [
                { text: 'Service', value: 'id' },
                { text: 'Router', value: 'router' },
                { text: 'Connections', value: 'connections' },
                { text: 'Total Connections', value: 'total_connections' },
                { text: 'Servers', value: 'servers' },
                { text: 'Actions', align: 'center', value: '', sortable: false },
            ],
            tableRows: [],
            serviceDialog: false,
            chosenItem: null,
        }
    },

    watch: {
        servicesData: function(newVal, oldVal) {
            this.generateTableRows(newVal)
        },
    },
    methods: {
        ...mapActions(['destroyService']),
        handleOpenModal: function(item) {
            this.serviceDialog = true
            this.chosenItem = item
        },
        /**
         * @return {Array} An array of objects
         */
        generateTableRows: function(servicesData) {
            /**
             * @param {Array} itemsArr
             *  Elements are {Object} row
             */
            if (servicesData) {
                let itemsArr = []
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
                    } = servicesData[n] || {}

                    let serversList = serversData ? serversData.map(item => ` ${item.id}`) : []
                    let row = {
                        id: id,
                        router: router,
                        connections: connections,
                        total_connections: total_connections,
                        servers: serversList.toString(),
                    }
                    itemsArr.push(row)
                }
                return (this.tableRows = itemsArr)
            }
            return []
        },
    },
}
</script>

<style lang="scss" scoped></style>
