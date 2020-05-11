<template>
    <fragment>
        <data-table
            :headers="tableHeaders"
            :data="generateTableRows"
            :sortDesc="false"
            :loading="isLoading"
            :singleExpand="false"
            :showExpand="false"
            sortBy="id"
            :onRowClick="onRowClick"
        >
            <!-- <template v-slot:actions="{ data: { item } }">
              <v-tooltip top>
                    <template v-slot:activator="{ on }">
                        <v-btn icon color="primary" v-on="on" @click.stop="handleOpenModal(item)">
                            <v-icon size="16">$vuetify.icons.edit</v-icon>
                        </v-btn>
                    </template>
                    <span>{{ `${$t('monitor')} ${$t('update')}` }}</span>
                </v-tooltip> 
                <confirm-dialog
                    :item="item"
                    type="destroy"
                    :onSave="() => monitorManipulate({ id: item.id, mode: 'destroy' })"
                    :title="`${$t('destroy')} ${$t('monitor')}`"
                    :smallInfo="$t('info.monitorDelete')"
                />
            </template> -->
        </data-table>
        <monitor-create-or-update
            v-model="serverDialog"
            :close-modal="() => (serverDialog = false)"
            mode="patch"
            :item="chosenItem"
        />
    </fragment>
</template>

<script>
/*
 * Copyright (c) 2020 MariaDB Corporation Ab
 *
 * Use of this software is governed by the Business Source License included
 * in the LICENSE.TXT file and at www.mariadb.com/bsl11.
 *
 * Change Date: 2024-07-01
 *
 * On the date above, in accordance with the Business Source License, use
 * of this software will be governed by version 2 or later of the General
 * Public License.
 */
import { mapActions } from 'vuex'

import MonitorCreateOrUpdate from '../MonitorCreateOrUpdate'

export default {
    name: 'monitors-table',
    components: {
        MonitorCreateOrUpdate,
    },
    props: {
        allMonitors: Array,
    },
    data() {
        return {
            //State
            tableHeaders: [
                { text: 'Monitor', value: 'id' },
                { text: 'State', value: 'state' },
                { text: 'Servers', value: 'server_info' },
                { text: 'Actions', align: 'center', sortable: false },
            ],
            serverDialog: false,
            chosenItem: null,
        }
    },
    computed: {
        isLoading: function() {
            // loading while populating the data schema
            if (this.allMonitors.length && !this.generateTableRows.length) {
                return true
            }
            return false
        },
        /**
         * @return {Array} An array of objects
         */
        generateTableRows: function() {
            if (this.allMonitors.length) {
                let itemsArr = []
                for (let n = this.allMonitors.length - 1; n >= 0; --n) {
                    /**
                     * @typedef {Object} row
                     * @property {String} id - Id of the monitor
                     * @property {String} state - state
                     * @property {Number} server_info - List of servers is monitored
                     */
                    const {
                        id,
                        attributes: {
                            state,
                            monitor_diagnostics: { server_info },
                        },
                    } = this.allMonitors[n]
                    let serversList = server_info ? server_info.map(item => ` ${item.name}`) : []
                    let row = {
                        id: id,
                        state: state,
                        server_info: serversList.toString(),
                    }
                    itemsArr.push(row)
                }
                return itemsArr
            }
            return []
        },
    },
    methods: {
        ...mapActions('monitor', ['monitorManipulate']),
        handleOpenModal: function(item) {
            this.serverDialog = true
            this.chosenItem = item
        },
        onRowClick(item) {
            this.$router.push('/dashboard/monitor/' + item.id)
        },
    },
}
</script>

<style lang="scss" scoped></style>
