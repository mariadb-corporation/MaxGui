<template>
    <v-data-table
        v-sortable-table
        :headers="visibleHeaders"
        :items="!loading ? dataProcess : []"
        :hide-default-header="true"
        :hide-default-footer="showAll ? true : dataProcess.length <= 10"
        :items-per-page="itemsPerPage"
        :class="['data-table-full', tableClass]"
        :loading="loading"
        :options.sync="pagination"
        :page="page"
        :sort-by="sortBy"
        :sort-desc="sortDesc"
        :search="search"
        item-key="name"
        :dense="dense"
        :no-data-text="noDataText"
        @drag-reorder="dragReorder"
    >
        <!----------------------------------------------------TABLE HEAD--------------------------------------------->
        <template v-slot:header="{ props: { headers } }">
            <thead class="v-data-table-header">
                <tr>
                    <th
                        v-for="(header, i) in headers"
                        :key="header.value"
                        :width="header.width"
                        :class="[
                            header.align && `text-${header.align}`,
                            header.sortable !== false && !editableCell
                                ? 'pointer sortable'
                                : 'no-pointerEvent',
                            pagination.sortDesc[0] ? 'desc' : 'asc',
                            header.value === pagination.sortBy[0] ? 'active' : '',
                        ]"
                        @click="!editableCell ? changeSort(header.value) : null"
                    >
                        <div class="d-inline-flex justify-center align-center">
                            <span>{{ header.text }}</span>
                            <slot :name="`append-${header.value}`"> </slot>
                            <v-icon
                                v-if="header.sortable !== false && !editableCell"
                                size="14"
                                class="ml-3 v-data-table-header__icon"
                                >$vuetify.icons.arrowDown</v-icon
                            >
                            <fragment v-if="hasColumnToggle && i === headers.length - 1">
                                <v-spacer></v-spacer>
                                <!--column toggle icon-->
                                <v-icon
                                    size="18"
                                    class="pl-4 pr-0 toggle-icon"
                                    @click.stop="columnToggle"
                                >
                                    visibility
                                </v-icon>
                            </fragment>
                        </div>
                    </th>
                </tr>
            </thead>
        </template>

        <!-- Checkbox PREPEND to TABLE BODY to toggle columns, 
        dislayed when hasColumnToggle and isColumnToggleVisible  -->
        <template v-if="hasColumnToggle && isColumnToggleVisible" v-slot:body.prepend>
            <tr>
                <td :colspan="visibleHeaders.length" class="pl-4" style="height: 100%">
                    <div class="d-flex" style="height: 40px">
                        <v-checkbox
                            v-for="(header, i) in headers"
                            :key="`check-${i}`"
                            v-model="visible"
                            :label="header.text || header.value"
                            :value="header"
                            color="#0e9bc0"
                            class="small ma-0 py-2 pa-0 pr-2"
                        />
                    </div>
                </td>
            </tr>
        </template>

        <!----------------------------------------------------TABLE ROW--------------------------------------------->
        <template v-slot:item="{ item, index: rowIndex }">
            <tr
                :key="item.id"
                :class="{
                    pointer: onRowClick,
                    'last-row': rowIndex === data.length - 1,
                    'v-data-table__editable-cell-mode': editableCell,
                    'draggable-row': draggable,
                }"
                @click="rowClick(item, headers, visibleHeaders)"
                @mouseover="() => draggable && onRowHover(item, rowIndex, 'mouseover')"
                @mouseleave="() => draggable && onRowHover(item, rowIndex, 'mouseleave')"
            >
                <td
                    v-for="(header, i) in visibleHeaders"
                    :key="i"
                    :class="[
                        header.value,
                        header.align && `text-${header.align}`,
                        header.tdClass || header.class,
                        tdBorderLeft && 'border-left-thin',
                        editableCell && header.editableCol && 'v-data-table__editable-cell',
                    ]"
                    @click="cellClick(item, headers, visibleHeaders)"
                >
                    <div :style="cellAlignHandle(header)" style="position:relative">
                        <v-icon
                            v-if="handleShowDragIcon(rowIndex)"
                            :class="{ 'drag-handle move': draggable }"
                            class="color text-field-text"
                            size="16"
                        >
                            drag_handle
                        </v-icon>
                        <span>
                            <slot :name="header.value" :data="{ item, header, i }">
                                <!-- no content for the corresponding header, usually this is an error -->
                                <span v-if="$help.isUndefined(item[header.value])"></span>
                                <!-- regular cell -->
                                <span v-else>{{ getValue(item, header) }}</span>
                            </slot>
                            <!-- Actions slot includes expandIndicator slot -->
                            <div
                                v-if="$scopedSlots['actions']"
                                class="d-flex"
                                :class="[`justify-${header.align}` && header.align]"
                                style="position:absolute"
                            >
                                <slot :data="{ item }" name="actions" />

                                <!-- expandle activator -->
                                <v-tooltip top>
                                    <template v-slot:activator="{ on }">
                                        <v-btn
                                            v-show="$scopedSlots['expandable']"
                                            icon
                                            color="primary"
                                            v-on="on"
                                            @click="toggleRow(item.id)"
                                        >
                                            <!-- optional expand indicator icon -->
                                            <slot
                                                :expanded="expandedRows.includes(item.id)"
                                                name="expandIndicator"
                                            >
                                                <v-icon
                                                    v-if="!expandedRows.includes(item.id)"
                                                    size="24"
                                                    >keyboard_arrow_down</v-icon
                                                >
                                                <v-icon v-else size="24">keyboard_arrow_up</v-icon>
                                            </slot>
                                        </v-btn>
                                    </template>
                                    <span>Show detailed information</span>
                                </v-tooltip>
                            </div>
                        </span>
                    </div>
                </td>
            </tr>
            <!-- optional expandable row -->
            <tr v-if="expandedRows.includes(item.id)" class="expanded-row">
                <td colspan="100%" style="padding: 0;">
                    <slot :data="{ item }" name="expandable" />
                </td>
            </tr>
        </template>
    </v-data-table>
</template>

<script>
import Sortable from 'sortablejs'
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
    name: 'data-table',
    /* SLOTS available for data-table */
    // :name="header.value" // slot aka item
    // name="actions" :data="{ item }"
    // name="expandable"   :data="{ item }"
    // name="expandIndicator" :expanded Boolean
    directives: {
        sortableTable: {
            bind(el, binding, vnode) {
                const options = {
                    handle: '.drag-handle',
                    draggable: '.draggable-row',
                    animation: 200,
                    onEnd: function(event) {
                        vnode.child.$emit('drag-reorder', event)
                    },
                }
                Sortable.create(el.getElementsByTagName('tbody')[0], options)
            },
        },
    },
    props: {
        headers: { type: Array },
        data: { type: Array },
        sortBy: { type: String },
        search: { type: String, default: '' },
        sortDesc: { type: Boolean },
        loading: { type: Boolean, default: false },
        singleExpand: { type: Boolean, default: false },
        showExpand: { type: Boolean, default: false },
        tableClass: { type: String, default: 'data-table-full' },
        hasColumnToggle: { type: Boolean, default: false },
        onRowClick: { type: Function },
        onCellClick: { type: Function },
        itemsPerPage: { type: Number, default: 10 },
        showAll: { type: Boolean, default: false },
        page: { type: Number, default: 1 },
        dense: { type: Boolean, default: false },
        noDataText: { type: String },
        // add border left to td
        tdBorderLeft: { type: Boolean, default: false },
        // For editable feature
        editableCell: { type: Boolean, default: false },
        // For draggable feature
        draggable: { type: Boolean, default: false },
        dragReorder: { type: Function, default: () => null },
    },
    data() {
        return {
            expandedRows: [],
            pagination: {},
            visible: [],
            isColumnToggleVisible: false,
            //draggable
            showDragIcon: false,
            showDragIconAtRow: null,
        }
    },
    computed: {
        visibleHeaders() {
            return this.headers.filter(header => this.visible.includes(header))
        },
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

    created() {
        this.visible = this.headers.filter(h => !h.hidden)
    },

    methods: {
        changeSort(column) {
            // TODO: support multiple column sorting
            if (this.pagination.sortBy[0] === column) {
                this.pagination.sortDesc = [!this.pagination.sortDesc[0]]
            } else {
                this.pagination.sortBy = [column]
                this.pagination.sortDesc = [false]
            }
        },
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
            return this.$help.isFunction(header.format) ? header.format(value) : value
        },
        columnToggle() {
            this.isColumnToggleVisible = !this.isColumnToggleVisible
        },
        cellAlignHandle(header) {
            // make centering cell more accurate that ommit the width of the sort arrow from the header
            let marginRight = header.align && header.sortable !== false ? 26 : ''
            if (this.hasColumnToggle) {
                marginRight += 34
            }
            return {
                marginRight: `${marginRight}px`,
            }
        },
        onRowHover(item, index, type) {
            switch (type) {
                case 'mouseover':
                    this.showDragIcon = true
                    this.showDragIconAtRow = index
                    break
                case 'mouseleave':
                    this.showDragIcon = false
                    this.showDragIconAtRow = null
                    break
            }
        },

        handleShowDragIcon(index) {
            if (
                this.showDragIcon &&
                !this.$help.isNull(this.showDragIconAtRow) &&
                this.showDragIconAtRow === index
            )
                return true
            return false
        },
    },
}
</script>
<style lang="scss" scoped>
.draggable-row:hover {
    background: transparent !important;
}

.drag-handle {
    position: absolute;
    left: 50%;
    top: 0;
    transform: translate(-50%, -50%);
}
.sortable-chosen:hover {
    background: #f2fcff !important;
    .drag-handle {
        display: inline;
    }
}
.sortable-ghost {
    background: #f2fcff !important;
    opacity: 0.6;
}
</style>
