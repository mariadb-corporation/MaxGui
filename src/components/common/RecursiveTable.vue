<template>
    <v-data-table
        :headers="headers"
        :items="dataProcess"
        :class="['data-table-full', 'data-table-nested', tableClass]"
        item-key="name"
        :hide-default-header="true"
        :hide-default-footer="dataProcess.length <= 10"
        :loading="loading"
        :options.sync="pagination"
        :page="page"
        :sort-by="sortBy"
        :sort-desc="sortDesc"
        :search="search"
        :dense="dense"
        :items-per-page="itemsPerPage"
        @current-items="currentItems"
        @update:page="updatePagination"
    >
        <!----------------------------------------------------TABLE HEAD--------------------------------------------->
        <template v-slot:header="{ props: { headers } }">
            <thead class="v-data-table-header">
                <tr>
                    <th
                        v-for="header in headers"
                        :key="header.value"
                        :width="header.width"
                        :class="[
                            header.align && `text-${header.align}`,
                            header.sortable !== false ? 'pointer sortable' : 'no-pointerEvent',
                            pagination.sortDesc[0] ? 'desc' : 'asc',
                            header.value === pagination.sortBy[0] ? 'active' : '',
                        ]"
                        @click="changeSort(header.value)"
                    >
                        <div class="d-inline-flex justify-center align-center">
                            <span>{{ header.text }}</span>
                            <slot :name="`append-${header.value}`"> </slot>
                            <v-icon
                                v-if="header.sortable !== false"
                                size="7"
                                class="ml-1 v-data-table-header__icon"
                                >$vuetify.icons.arrowDown</v-icon
                            >
                        </div>
                    </th>
                </tr>
            </thead>
        </template>
        <!----------------------------------------------------TABLE ROW--------------------------------------------->

        <template v-slot:item="{ item, index }">
            <fragment>
                <tr
                    :class="{
                        'last-row': index === currentPageItems.length - 1,
                        'collapse-row': $help.isObject(item.value),
                    }"
                >
                    <td
                        v-for="(header, i) in headers"
                        :key="i"
                        :class="[header.value, header.tdClass || header.class]"
                        @click="cellClick(item, headers)"
                    >
                        <div>
                            <slot :name="header.value" :data="{ item, header }">
                                <!-- no content for the corresponding header, usually this is an error  -->
                                <span v-if="$help.isUndefined(item[header.value])"></span>
                                <!-- regular cell, check if value is object; 
                                this lodash function also see array as object  -->
                                <span v-else-if="!$help.isObject(item[header.value])">
                                    {{ getValue(item, header) }}
                                </span>
                            </slot>
                        </div>
                    </td>
                </tr>
            </fragment>

            <fragment v-if="$help.isObject(item.value)">
                <tr v-for="(nestedItem, n) in handleNestedValue(item.value)" :key="n">
                    <td
                        v-for="(header, i) in headers"
                        :key="i"
                        class="nested-row"
                        :class="[header.value, header.tdClass || header.class]"
                        @click="cellClick(nestedItem, headers)"
                    >
                        <span v-if="$help.isUndefined(nestedItem[header.value])"></span>
                        <span v-else-if="!$help.isObject(nestedItem[header.value])">
                            {{ getValue(nestedItem, header) }}
                        </span>
                    </td>
                </tr>
            </fragment>
        </template>
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
        sortBy: { type: String },
        search: { type: String, default: '' },
        sortDesc: { type: Boolean },
        loading: { type: Boolean, default: false },
        onCellClick: { type: Function },
        itemsPerPage: { type: Number, defalut: 10 },
        page: { type: Number, default: 1 },
        dense: { type: Boolean, default: false },
    },
    data() {
        return {
            pagination: {},
            isSearching: false,
            isPaginationChanged: false,
            currentPage: 1,
            currentPageItems: null,
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
            let processedData = self.$help.cloneDeep(self.data)
            for (let i = 0; i < processedData.length; ++i) {
                let obj = processedData[i]
                Object.keys(obj).forEach(key => (obj[key] = self.$help.handleValue(obj[key])))
            }
            return processedData
        },
    },

    watch: {
        search: function(val) {
            if (val !== '') this.isSearching = true
            else this.isSearching = false
        },

        pagination: {
            handler(val) {
                this.$emit('pagination', val)
            },
            deep: true,
        },
        data: {
            handler(list) {
                list.forEach(item => {
                    if (item.expanded) this.expandedRows.push(item.id)
                })
            },
        },
    },

    methods: {
        updatePagination(page) {
            if (this.currentPage !== page) {
                this.isPaginationChanged = true
                this.currentPage = page
            }
        },

        currentItems(items) {
            let uniqueSet = new Set(items.map(item => item.id))
            let itemsId = [...uniqueSet]
            let groupedId = this.$help.groupBy(items, 'id')

            for (let i = 0; i < itemsId.length; ++i) {
                let group = groupedId[`${itemsId[i]}`]
                for (let n = 0; n < group.length; ++n) {
                    group[n].hidden = group[n].originalHidden
                    group[n].alterableRowspan = group[n].originalRowSpan
                }
                // when searching or pagination, use current items to mutate
                //Add this.isSearching || still breaks the rowspan view in some cases
                if (this.isSearching || this.isPaginationChanged) {
                    // mutate object
                    /* if group length is one ------> alterableRowspan property needs to be 1 */
                    if (group.length === 1) {
                        group[0].alterableRowspan = 1
                    }
                    group[0].hidden && (group[0].hidden = false)
                }
            }
            this.currentPageItems = items
        },
        changeSort(column) {
            // TODO: support multiple column sorting
            if (this.pagination.sortBy[0] === column) {
                this.pagination.sortDesc = [!this.pagination.sortDesc[0]]
            } else {
                this.pagination.sortBy = [column]
                this.pagination.sortDesc = [false]
            }
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
            return this.$help.isFunction(header.format) ? header.format(value) : value
        },
        handleNestedValue(item) {
            return this.$help.objToArrOfObj(item)
        },
        // levelRecursive(arr, newwArr, level) {
        //     let self = this

        //     arr.forEach(function(o) {
        //         if (o.children && o.children.length > 0) {
        //             o.level = level

        //             newwArr.push(o)
        //             self.levelRecursive(o.children, newwArr, o.level + 1)
        //         } else {
        //             o.level = level
        //             newwArr.push(o)
        //             return false
        //         }
        //     })
        // },
        // processTreeData(obj) {
        //     if (typeof obj === 'object') {
        //         let data = []
        //         let self = this
        //         let targetObj = self.$help.cloneDeep(obj)

        //         if (!self.$help.isEmpty(targetObj)) {
        //             Object.keys(targetObj).map(key => {
        //                 const value = self.$help.handleValue(targetObj[key])
        //                 let newValue = self.$help.cloneDeep(value)
        //                 let chilren = self.processTreeData(self.$help.handleValue(targetObj[key]))
        //                 let typeOfValue = typeof value
        //                 if (typeOfValue === 'object') {
        //                     newValue = null
        //                 } else if (Array.isArray(value)) {
        //                     newValue = { ...newValue } // convert to object
        //                 }

        //                 data.push({
        //                     id: key,
        //                     name: key,
        //                     value: newValue,
        //                     children: chilren,
        //                     colNameWidth: '65%',
        //                     colValueWidth: '35%',
        //                 })
        //             })
        //             return data
        //         }
        //     }
        //     return []
        // },
    },
}
</script>
