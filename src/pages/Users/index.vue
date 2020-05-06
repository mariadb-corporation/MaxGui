<template>
    <data-table
        :headers="tableHeaders"
        :data="generateTableRows"
        :sortDesc="false"
        :loading="!generateTableRows.length"
        sortBy="id"
    >
        <template v-slot:id="{ data }">
            <span :class="boldCurrentUser(data)">
                {{ data.item.id }}
            </span>
        </template>
        <template v-slot:type="{ data }">
            <span :class="boldCurrentUser(data)">
                {{ data.item.type }}
            </span>
        </template>
        <template v-slot:role="{ data }">
            <span :class="boldCurrentUser(data)">
                {{ data.item.role }}
            </span>
        </template>
    </data-table>
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
import { mapActions, mapGetters } from 'vuex'

export default {
    data() {
        return {
            tableHeaders: [
                { text: 'ID', value: 'id' },
                { text: 'Type', value: 'type' },
                { text: 'Role', value: 'role' },
            ],
        }
    },
    computed: {
        ...mapGetters('user', ['currentNetworkUser', 'allUsers']),
        /**
         * @return {Array} An array of objects
         */
        generateTableRows: function() {
            if (this.allUsers) {
                let itemsArr = []
                for (let n = this.allUsers.length - 1; n >= 0; --n) {
                    /**
                     * @typedef {Object} row
                     * @property {String} id - Id of the user
                     * @property {String} type - Type of user
                     * @property {String} role - User role
                     */
                    const {
                        id,
                        type,
                        attributes: { account },
                    } = this.allUsers[n]

                    let row = {
                        id: id,
                        type: type,
                        role: account,
                    }
                    itemsArr.push(row)
                }
                return itemsArr
            }
            return []
        },
    },
    created() {
        this.fetchCurrentNetworkUser()
    },

    methods: {
        ...mapActions('user', ['fetchCurrentNetworkUser']),
        boldCurrentUser(data) {
            return {
                'font-weight-bold':
                    data.item.id === this.currentNetworkUser.id &&
                    data.item.type === this.currentNetworkUser.type,
            }
        },
    },
}
</script>

<style lang="scss" scoped></style>
