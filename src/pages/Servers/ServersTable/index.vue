<template>
    <fragment>
        <data-table
            :headers="tableHeaders"
            :data="generateTableRows"
            :sortDesc="false"
            :loading="!generateTableRows.length"
            :singleExpand="false"
            :showExpand="false"
            sortBy="id"
            :onRowClick="onRowClick"
        >
            <template v-slot:actions="{ data: { item } }">
                <v-tooltip top>
                    <template v-slot:activator="{ on }">
                        <v-btn icon color="primary" v-on="on" @click.stop="handleOpenModal(item)">
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
            <!-- <template v-slot:expandable="{ data: { item } }">
                <server-read :id="item.id" />
            </template> -->
        </data-table>
        <server-create-or-update
            v-model="serverDialog"
            :close-modal="() => (serverDialog = false)"
            mode="patch"
            :item="chosenItem"
        />
    </fragment>
</template>

<script>
import { mapActions } from 'vuex'
import DeleteModal from 'components/DeleteModal'
import ServerCreateOrUpdate from '../ServerCreateOrUpdate'
// import ServerRead from './ServerRead'

export default {
    name: 'servers-table',
    components: {
        DeleteModal,
        ServerCreateOrUpdate,
        // ServerRead,
    },
    props: {
        serversData: Array,
    },
    data() {
        return {
            //State
            tableHeaders: [
                { text: 'Server', value: 'id' },
                { text: 'Address', value: 'address' },
                { text: 'Port', value: 'port' },
                { text: 'Connections', value: 'connections' },
                { text: 'State', value: 'state' },
                { text: 'Actions', align: 'center', value: 'data-table-expand', sortable: false },
            ],
            serverDialog: false,
            chosenItem: null,
        }
    },
    computed: {
        /**
         * @return {Array} An array of objects
         */
        generateTableRows: function() {
            if (this.serversData) {
                let itemsArr = []
                for (let n = this.serversData.length - 1; n >= 0; --n) {
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
                    } = this.serversData[n]
                    let row = {
                        id: id,
                        address: parameters.address,
                        port: parameters.port,
                        connections: statistics.connections,
                        state: state,
                    }
                    itemsArr.push(row)
                }
                return itemsArr
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
        onRowClick(item, header) {
            this.$router.push('/dashboard/server/' + item.id)
        },
    },
}
</script>

<style lang="scss" scoped></style>
