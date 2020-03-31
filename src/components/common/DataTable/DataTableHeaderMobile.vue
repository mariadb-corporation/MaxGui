<template>
    <th>
        <v-select id="header" v-model="selectItem" :items="headers" name="header" label="SORT BY">
            <template v-slot:selection="{ item }">
                <v-chip
                    :class="[item.sortable !== false ? 'sortable' : '']"
                    class="text-capitalize"
                    small
                >
                    <span>{{ item.text }}</span>
                    <v-icon size="7" class="ml-2">$vuetify.icons.arrowDown</v-icon>
                </v-chip>
            </template>
        </v-select>
    </th>
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
export default {
    name: 'data-table-header-mobile',
    props: {
        items: Array,
    },

    data() {
        return {
            pagination: {},
            selectItem: {},
        }
    },
    computed: {
        headers() {
            return this.items.filter(
                item => item.sortable !== false && { text: item.text, value: item.value }
            )
        },
    },
    watch: {
        selectItem: function(newVal) {
            this.$emit('sort', newVal)
        },
    },
}
</script>

<style lang="scss" scoped></style>
