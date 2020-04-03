<template>
    <v-data-table
        :headers="headers"
        :items="dataProcess"
        :class="['data-table-full', tableClass]"
        item-key="name"
    >
    </v-data-table>
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
    name: 'recursive-table',

    /* SLOTS available for data-table */
    // :name="header.value" // slot aka item
    // name="actions" :data="{ item }"
    // name="expandable"   :data="{ item }"
    // name="expandIndicator" :expanded Boolean
    props: {
        headers: { type: Array },
        data: { type: Array },
        tdBorderLeft: { type: Boolean, default: false },
        tableClass: { type: String, default: 'data-table-full' },
    },
    data() {
        return {
            windowSize: {
                x: 0,
                y: 0,
            },
            expandedRows: [],
        }
    },
    computed: {
        dataProcess: function() {
            let self = this
            let oriData = self.data
            for (let i = 0; i < oriData.length; ++i) {
                let obj = oriData[i]
                Object.keys(obj).forEach(key => (obj[key] = self.$help.handleValue(obj[key])))
            }
            return oriData
        },
    },

    watch: {
        data: {
            handler(list) {
                list.forEach(item => {
                    if (item.expanded) this.expandedRows.push(item.id)
                })
            },
        },
    },

    methods: {
        rowClick(item, headers) {
            // if (this.$scopedSlots['expandable']) this.toggleRow(item.id);
            this.onRowClick && this.onRowClick(item, headers)
        },
        cellClick(item, header) {
            this.onCellClick && this.onCellClick(item, header)
        },
        toggleRow(id) {
            if (!this.$scopedSlots['expandable']) return

            const isOpen = this.expandedRows.includes(id)

            if (isOpen) {
                this.expandedRows = this.expandedRows.filter(i => i !== id)
            } else {
                this.expandedRows.push(id)
            }
        },
        getValue(item, header) {
            // data type shouldn't be handled here as it will break the filter result
            // use helper function to handle value before passing the data to table
            let value = item[header.value]
            return this.$_.isFunction(header.format) ? header.format(value) : value
        },
    },
}
</script>
