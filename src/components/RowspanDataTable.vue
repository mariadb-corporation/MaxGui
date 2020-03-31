<template>
    <!--:hide-default-footer="data.length <= 10"
     :footer-props="{ 'items-per-page-options': [1, 2, 4, 8, 16] }" -->
    <v-data-table
        :headers="headers"
        :items="data"
        :hide-default-header="true"
        :hide-default-footer="data.length <= 10"
        :class="['rowspan-table', tableClass]"
        :loading="loading"
        :options.sync="pagination"
        :page="page"
        :sort-by="sortBy"
        :sort-desc="sortDesc"
        :search="search"
        item-key="name"
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
            <tr
                :class="{
                    'last-row': index === currentPageItems.length - 1,
                }"
            >
                <td
                    v-for="(header, i) in headers"
                    :key="i"
                    :ref="i < numOfColsHasRowSpan ? 'rowGroup' : 'cell'"
                    :rowspan="i < numOfColsHasRowSpan ? item.alterableRowspan : null"
                    :class="[
                        item.hidden && i < numOfColsHasRowSpan && 'hide',
                        i < numOfColsHasRowSpan ? `${item.id}-alterableRowspan` : `${item.id}-cell`,
                        header.value,
                        header.tdClass || header.class,
                        i === numOfColsHasRowSpan && 'border-left-thin',
                    ]"
                    :style="
                        `${
                            i < numOfColsHasRowSpan &&
                            index === currentPageItems.length - 1 - numOfColsHasRowSpan
                                ? 'border-bottom: thin solid #e7eef1'
                                : ''
                        }
                    `
                    "
                    @click="cellClick(item, headers)"
                    @mouseover="
                        e =>
                            mouse(
                                e,
                                'mouseOver',
                                i < numOfColsHasRowSpan ? 'rowgroup' : 'cell',
                                item.id
                            )
                    "
                    @mouseleave="
                        e =>
                            mouse(
                                e,
                                'mouseLeave',
                                i < numOfColsHasRowSpan ? 'rowgroup' : 'cell',
                                item.id
                            )
                    "
                >
                    <div>
                        <slot :name="header.value" :data="{ item, header }">
                            <!-- no content for the corresponding header, usually this is an error  -->
                            <span v-if="$_.isUndefined(item[header.value])"></span>
                            <!-- regular cell  -->
                            <span v-else>{{ getValue(item, header) }} </span>
                        </slot>
                    </div>
                </td>
            </tr>
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
    name: 'rowspan-data-table',
    /* SLOTS available for data-table */
    // :name="header.value" // slot aka item
    // name="actions" :data="{ item }"
    // name="expandable"   :data="{ item }"
    // name="expandIndicator" :expanded Boolean
    props: {
        headers: { type: Array },
        data: { type: Array },
        /* 
        To enable rowspan table structure, each object in data array needs to have the following properties     
            originalRowSpan: Number,  // This won't be alterd in any cases
            alterableRowspan: Number, // This will be alterd when filtering or changing pagnination values
            originalHidden: Boolean, // This won't be alterd in any cases
            hidden: Boolean // This will be alterd when filtering or changing pagnination values
        */
        numOfColsHasRowSpan: { type: Number, default: 0 }, // rowspan feature
        sortBy: { type: String },
        search: { type: String, default: '' },
        sortDesc: { type: Boolean },
        loading: { type: Boolean, default: false },
        tableClass: { type: String, default: 'data-table-full' },
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
        }
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
    },

    methods: {
        updatePagination(page) {
            if (this.currentPage !== page) {
                this.isPaginationChanged = true
                this.currentPage = page
            }
        },
        groupBy(OurArray, property) {
            return OurArray.reduce(function(accumulator, object) {
                // get the value of our object(age in our case) to use for group the array as the array key
                const key = object[property]
                /*  if the current value is similar to the key(age) don't accumulate
                the transformed array and leave it empty */
                if (!accumulator[key]) {
                    accumulator[key] = []
                }
                // add the value to the array
                accumulator[key].push(object)
                // return the transformed array
                return accumulator
                // Also we also set the initial value of reduce() to an empty object
            }, {})
        },
        currentItems(items) {
            let uniqueSet = new Set(items.map(item => item.id))
            let groupedId = this.groupBy(items, 'id')
            let itemsId = [...uniqueSet]

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
        getValue(item, header) {
            const value =
                item[header.value] || item[header.value] === 0
                    ? item[header.value].text || item[header.value]
                    : 'n/a'
            return this.$_.isFunction(header.format) ? header.format(value) : value
        },

        mouse: function(e, mouseType, target, rowspanId) {
            // Make associated td elements to have the same hover effect
            if (target === 'cell') {
                let elements = this.$refs.rowGroup.filter((ele, i) =>
                    ele.attributes.class.value.includes(`${rowspanId}-alterableRowspan`)
                )

                elements.forEach(
                    ele => (ele.style.backgroundColor = mouseType === 'mouseOver' ? '#eeeeee' : '')
                )
            } else if (target === 'rowgroup') {
                let elements = this.$refs.cell.filter((ele, i) =>
                    ele.attributes.class.value.includes(`${rowspanId}-cell`)
                )
                elements.forEach(
                    ele => (ele.style.backgroundColor = mouseType === 'mouseOver' ? '#eeeeee' : '')
                )
            }
        },
    },
}
</script>
<style lang="scss" scoped>
.rowspan-table {
    .last-row td {
        border-bottom: thin solid $table-border !important;
    }
    .border-left-thin {
        border-left: thin solid $table-border !important;
    }
}
</style>
