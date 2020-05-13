<template>
    <v-data-table
        v-sortable-table
        :headers="visibleHeaders"
        :items="!loading ? dataProcess : []"
        :hide-default-header="true"
        :hide-default-footer="showAll ? true : dataProcess.length <= 10"
        :items-per-page="showAll ? dataProcess.length : itemsPerPage"
        :class="['data-table-full', tableClass]"
        :loading="loading"
        :options.sync="pagination"
        :page="page"
        :sort-by="sortBy"
        :sort-desc="sortDesc"
        :search="search"
        item-key="id"
        :dense="dense"
        :no-data-text="noDataText"
        @drag-reorder="dragReorder"
    >
        <!----------------------------------------------------TABLE HEAD--------------------------------------------->
        <template v-slot:header="{ props: { headers } }">
            <thead class="v-data-table-header">
                <tr>
                    <!-- Only render this extra th if data length >0 and has props hasOrderNumber enabled 
                    By doing this, it won't break the no-data view when data length = 0
                    -->
                    <th v-if="data.length && hasOrderNumber && !loading" width="1px" class="pa-0" />
                    <th
                        v-for="(header, i) in headers"
                        :key="header.value"
                        :width="header.width"
                        :class="[
                            header.align && `text-${header.align}`,
                            header.sortable !== false && 'pointer sortable',
                            pagination.sortDesc[0] ? 'desc' : 'asc',
                            (header.value === pagination.sortBy[0]) & 'active',
                            header.text === 'Action' && 'px-0',
                        ]"
                        style="position:relative"
                        @click="header.sortable !== false ? changeSort(header.value) : null"
                    >
                        <div class="d-inline-flex justify-center align-center">
                            <span v-if="header.text !== 'Action'">{{ header.text }}</span>
                            <slot :name="`append-${header.value}`"> </slot>
                            <v-icon
                                v-if="header.sortable !== false"
                                size="14"
                                class="ml-3 v-data-table-header__icon"
                                >$vuetify.icons.arrowDown</v-icon
                            >
                        </div>
                        <!--column toggle icon-->
                        <fragment v-if="hasColumnToggle && i === headers.length - 1">
                            <v-icon size="18" class="toggle-icon" @click.stop="columnToggle">
                                visibility
                            </v-icon>
                        </fragment>
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
                            v-for="(header, i) in headers.filter(
                                header => header.value !== 'action'
                            )"
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
                ref="tableRow"
                :class="{
                    pointer: onRowClick,
                    'last-row': rowIndex === data.length - 1,
                    'v-data-table__editable-cell-mode': editableCell,
                    'draggable-row': draggable,
                }"
                @click="rowClick(item, headers, visibleHeaders)"
                @mouseover="e => (draggable || showActionsOnHover ? onRowHover(e, rowIndex) : null)"
                @mouseleave="
                    e => (draggable || showActionsOnHover ? onRowHover(e, rowIndex) : null)
                "
            >
                <!-- Only render this extra th if data length >0 and has props hasOrderNumber enabled 
                    By doing this, it won't break the no-data view when data length = 0
                    -->
                <td
                    v-if="data.length && hasOrderNumber && !loading"
                    class="overline px-2 color border-right-table-border  text-field-text"
                >
                    {{ rowIndex }}
                </td>
                <td
                    v-for="(header, i) in visibleHeaders"
                    :key="i"
                    :class="[
                        header.value,
                        header.align && `text-${header.align}`,
                        header.tdClass || header.class,
                        tdBorderLeft && 'color border-left-table-border',
                        editableCell && header.editableCol && 'v-data-table__editable-cell',
                        header.value === 'action' && 'pr-3',
                        header.cellTruncated && 'text-truncate cell-truncate',
                    ]"
                    style="position:relative;"
                    @click="cellClick(item, headers, visibleHeaders)"
                    @mouseenter="e => (header.cellTruncated ? handleShowTruncatedText(e) : null)"
                >
                    <v-icon
                        v-show="
                            showDragEntity &&
                                showEntityAt === rowIndex &&
                                i === visibleHeaders.length - 1
                        "
                        :class="{ 'drag-handle move': draggable }"
                        class="color text-field-text"
                        size="16"
                    >
                        drag_handle
                    </v-icon>
                    <div
                        :style="cellAlignHandle(header)"
                        style="position:relative"
                        :class="[
                            header.cellTruncated && 'text-truncate',
                            displayTruncatedText && 'pointer',
                        ]"
                    >
                        <slot :name="header.value" :data="{ item, header, i }">
                            <!-- no content for the corresponding header, usually this is an error -->
                            <span v-if="$help.isUndefined(item[header.value])"></span>
                            <v-menu
                                v-else
                                :key="i"
                                offset-x
                                transition="slide-x-transition"
                                :close-on-content-click="false"
                                open-on-hover
                                :nudge-left="truncatedMenuPos.x"
                                :nudge-top="truncatedMenuPos.y"
                                content-class="shadow-drop"
                            >
                                <template v-slot:activator="{ on }">
                                    <!-- regular cell -->
                                    <span v-on="on">{{ getValue(item, header) }}</span>
                                </template>

                                <v-sheet
                                    v-if="displayTruncatedText"
                                    style="border-radius: 10px;"
                                    class="pa-4"
                                >
                                    <span class="body-2"> {{ getValue(item, header) }}</span>
                                </v-sheet>
                            </v-menu>
                        </slot>

                        <!-- Actions slot includes expandIndicator slot -->
                        <div
                            v-if="
                                showActionsEntity &&
                                    showEntityAt === rowIndex &&
                                    i === visibleHeaders.length - 1
                            "
                            class="action-slot-wrapper"
                        >
                            <slot :data="{ item }" name="actions" />

                            <!-- expandle activator -->
                            <!-- <v-tooltip top>
                                <template v-slot:activator="{ on }">
                                    <v-btn
                                        v-show="$scopedSlots['expandable']"
                                        icon
                                        color="primary"
                                        v-on="on"
                                        @click="toggleRow(item.id)"
                                    >
                                        <slot
                                            :expanded="expandedRows.includes(item.id)"
                                            name="expandIndicator"
                                        >
                                            <v-icon
                                                v-if="!expandedRows.includes(item.id)"
                                                size="24"
                                            >
                                                keyboard_arrow_down
                                            </v-icon>
                                            <v-icon v-else size="24">keyboard_arrow_up</v-icon>
                                        </slot>
                                    </v-btn>
                                </template>
                                <span>Show detailed information</span>
                            </v-tooltip> -->
                        </div>
                    </div>
                </td>
            </tr>
            <!-- optional expandable row -->
            <tr v-if="expandedRows.includes(item.id)" class="expanded-row">
                <td colspan="100%" style="padding: 0;">
                    <slot :data="{ item }" name="expandable" />
                </td>
                <!-- Only render this extra th if data length >0 and has props hasOrderNumber enabled 
                    By doing this, it won't break the no-data view when data length = 0
                    -->
                <td v-if="data.length && hasOrderNumber && !loading" />
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
        tableClass: { type: String },
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
        // For table wants to keep primitive value, eg: null/undefined won't be displayed
        keepPrimitiveValue: { type: Boolean, default: false },
        // For draggable feature
        draggable: { type: Boolean, default: false },
        dragReorder: { type: Function, default: () => null },
        hasOrderNumber: { type: Boolean, default: false },

        showActionsOnHover: { type: Boolean, default: false },
    },
    data() {
        return {
            expandedRows: [],
            pagination: {},
            visible: [],
            isColumnToggleVisible: false,
            //draggable
            showDragEntity: false,
            showActionsEntity: false,
            showEntityAt: null,
            displayTruncatedText: false,
            truncatedMenuPos: { x: 0, y: 16.5 },
        }
    },
    computed: {
        visibleHeaders() {
            return this.headers.filter(header => this.visible.includes(header))
        },
        dataProcess: function() {
            let self = this
            let oriData = self.$help.cloneDeep(self.data)
            if (!self.keepPrimitiveValue)
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
        loading: function(newVal) {
            if (newVal) {
                // when table is reload, dont show the entity
                this.draggable && (this.showDragEntity = false)
                this.showActionsOnHover && (this.showActionsEntity = false)
                this.showEntityAt = null
            }
        },
    },

    created() {
        this.visible = this.headers.filter(h => !h.hidden)
    },

    methods: {
        handleShowTruncatedText(e) {
            const { offsetWidth: wrapperOffsetwidth, children } = e.target
            let truncatedEleWidth = 0

            for (let i = 0; i < children.length; ++i) {
                truncatedEleWidth = children[i].childNodes[0].offsetWidth
            }

            if (wrapperOffsetwidth < truncatedEleWidth) {
                this.displayTruncatedText = true
                let offset = 25 / 2
                this.truncatedMenuPos.x = truncatedEleWidth - wrapperOffsetwidth + offset
            } else this.displayTruncatedText = false
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
            return this.$help.isFunction(header.format) ? header.format(value) : `${value}`
        },
        columnToggle() {
            this.isColumnToggleVisible = !this.isColumnToggleVisible
        },
        cellAlignHandle(header) {
            // make centering cell more accurate that ommit the width of the sort arrow from the header
            let marginRight = header.align && header.sortable !== false ? 26 : ''
            if (this.hasColumnToggle && header.sortable !== false) {
                marginRight += 34
            }
            return {
                marginRight: `${marginRight}px`,
            }
        },
        onRowHover(e, index) {
            const { type } = e
            let self = this
            switch (type) {
                case 'mouseover':
                    {
                        // positioning the drag handle to the center of the table row
                        if (self.draggable) {
                            let tableRowWidth = self.$refs.tableRow.clientWidth

                            let dragHandle = document.getElementsByClassName('drag-handle')
                            let center = `calc(100% - ${tableRowWidth / 2}px)`
                            if (dragHandle.length && dragHandle[0].style.left !== center) {
                                for (let i = 0; i < dragHandle.length; ++i) {
                                    dragHandle[i].style.left = center
                                }
                            }
                            self.showDragEntity = true
                        }

                        self.showActionsOnHover && (self.showActionsEntity = true)
                        self.showEntityAt = index
                    }
                    break
                case 'mouseleave':
                    self.draggable && (self.showDragEntity = false)
                    self.showActionsOnHover && (self.showActionsEntity = false)
                    self.showEntityAt = null
                    break
            }
        },
    },
}
</script>
<style lang="scss" scoped>
.toggle-icon {
    color: inherit;
    position: absolute;
    right: 21px;
}
.draggable-row:hover {
    background: transparent !important;
}

.drag-handle {
    position: absolute;

    top: 10px;
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
.action-slot-wrapper {
    position: absolute;
    right: 0px;
    top: 50%;
    transform: translate(0%, -50%);
}
.cell-truncate {
    max-width: 1px;
}
</style>
