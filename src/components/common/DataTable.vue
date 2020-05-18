<template>
    <v-data-table
        v-sortable-table
        :headers="visibleHeaders"
        :items="!loading ? treeData : []"
        :hide-default-header="true"
        :hide-default-footer="showAll ? true : getDataLength <= 10"
        :items-per-page="showAll ? getDataLength : itemsPerPage"
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
        :custom-sort="customSort"
        @drag-reorder="dragReorder"
    >
        <!--  -->
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
                        :style="setTableHeadPadding()"
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
                :key="item.nodeId || item.id"
                ref="tableRow"
                :class="tableRowClass(rowIndex)"
                @click="rowClick(item, headers, visibleHeaders)"
                @mouseover="e => onRowHover(e, rowIndex)"
                @mouseleave="e => onRowHover(e, rowIndex)"
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
                    v-for="(header, cellIndex) in visibleHeaders"
                    :key="cellIndex"
                    :class="cellClass(header, item)"
                    style="position:relative;"
                    :style="setCellPadding(item, cellIndex)"
                    @click="cellClick(item, headers, visibleHeaders)"
                    @mouseenter="e => handleShowTruncatedText(e, item, header, cellIndex)"
                >
                    <v-icon
                        v-show="
                            showDragEntity &&
                                showEntityAt === rowIndex &&
                                cellIndex === visibleHeaders.length - 1
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
                            item.level > 0 || header.cellTruncated ? 'text-truncate' : '',
                            (item.level > 0 || header.cellTruncated) &&
                                showTruncatedTextAt === cellIndex &&
                                'pointer',
                        ]"
                    >
                        <!-- Display toggle button at the first column-->
                        <v-btn
                            v-if="cellIndex === 0"
                            width="32"
                            height="32"
                            class="arrow-toggle mr-1"
                            icon
                            :class="[hasChild(item) ? '' : 'hide']"
                            @click="toggleChild(item, rowIndex)"
                        >
                            <v-icon
                                type="button"
                                :class="[item.expanded === true ? 'arrow-down' : 'arrow-up']"
                                size="24"
                            >
                                $expand
                            </v-icon>
                        </v-btn>
                        <slot :name="header.value" :data="{ item, header, cellIndex, rowIndex }">
                            <!-- no content for the corresponding header, usually this is an error -->
                            <span v-if="$help.isUndefined(item[header.value])"></span>
                            <v-menu
                                v-else
                                :key="cellIndex"
                                offset-x
                                transition="slide-x-transition"
                                :close-on-content-click="false"
                                open-on-hover
                                :nudge-left="truncatedMenuPos.x"
                                :nudge-top="truncatedMenuPos.y"
                                content-class="shadow-drop color text-navigation"
                            >
                                <template v-slot:activator="{ on }">
                                    <!-- regular cell -->
                                    <span class="text-truncate__value" v-on="on">
                                        {{ getValue(item, header) }}
                                    </span>
                                </template>

                                <v-sheet
                                    v-if="
                                        (item.level > 0 || header.cellTruncated) &&
                                            showTruncatedTextAt === cellIndex
                                    "
                                    style="border-radius: 10px;"
                                    class="pa-4"
                                >
                                    <span class="body-2"> {{ getValue(item, header) }}</span>
                                </v-sheet>
                            </v-menu>
                        </slot>

                        <!-- Actions slot -->
                        <div
                            v-if="
                                showActionsEntity &&
                                    showEntityAt === rowIndex &&
                                    cellIndex === visibleHeaders.length - 1
                            "
                            class="action-slot-wrapper"
                        >
                            <slot :data="{ item }" name="actions" />
                        </div>
                    </div>
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
            pagination: {},
            visible: [],
            isColumnToggleVisible: false,
            //draggable
            showDragEntity: false,
            showActionsEntity: false,
            showEntityAt: null,
            //For displaying truncated text in a v-menu
            showTruncatedTextAt: null,
            truncatedMenuPos: { x: 0, y: 16.5 },
            //For nested data, auto display dropdown table row
            isExpanded: true,
            nodeActiveIds: [],
            dataHasNestedChild: false,
        }
    },
    computed: {
        visibleHeaders() {
            return this.headers.filter(header => this.visible.includes(header))
        },
        processingData: function() {
            let self = this
            let oriData = self.$help.cloneDeep(self.data)
            if (!self.keepPrimitiveValue)
                for (let i = 0; i < oriData.length; ++i) {
                    let obj = oriData[i]
                    Object.keys(obj).forEach(key => (obj[key] = self.$help.handleValue(obj[key])))
                }
            return oriData
        },
        treeData: function() {
            const self = this
            let newArr = []
            self.levelRecursive(self.processingData, newArr, self.nodeActiveIds, self.isExpanded)
            return newArr
        },
        getDataLength: function() {
            const self = this
            const flattenedNode = self.$help.flattenNodes(self.$help.cloneDeep(self.treeData))
            return flattenedNode.length
        },
    },

    watch: {
        pagination: {
            handler(val) {
                this.$emit('pagination', val)
            },
            deep: true,
        },

        loading: function(newVal) {
            if (newVal) {
                // when table is reload, dont show the entity
                this.draggable && (this.showDragEntity = false)
                this.showActionsOnHover && (this.showActionsEntity = false)
                this.showEntityAt = null
            }
        },
        editableCell: function(val) {
            if (val) {
                this.toggleAllNodeChildren()
            }
        },
    },

    created() {
        this.visible = this.headers.filter(h => !h.hidden)
    },

    methods: {
        tableRowClass(rowIndex) {
            return {
                pointer: this.onRowClick,
                'last-row': rowIndex === this.getDataLength - 1,
                'v-data-table__editable-cell-mode': this.editableCell,
                'draggable-row': this.draggable,
            }
        },

        cellClass(header, item) {
            return [
                header.value,
                header.align && `text-${header.align}`,
                header.tdClass || header.class,
                this.tdBorderLeft && 'color border-left-table-border',
                this.editableCell && header.editableCol && 'v-data-table__editable-cell',
                header.value === 'action' && 'pr-3',
                item.level > 0 || header.cellTruncated ? 'text-truncate cell-truncate' : '',
                item.expanded && 'font-weight-bold',
            ]
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
        customSort(items, sortBy, isDesc) {
            items.sort((a, b) => {
                if (!isDesc[0]) {
                    return a[sortBy] < b[sortBy] ? -1 : 1
                } else {
                    return b[sortBy] < a[sortBy] ? -1 : 1
                }
            })

            return items
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
            this.onRowClick && this.onRowClick(item, headers)
        },
        cellClick(item, header) {
            this.onCellClick && this.onCellClick(item, header)
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

        //------------------------------------------------------------ For displaying actions btn/icon on table row
        onRowHover(e, index) {
            if (this.draggable || this.showActionsOnHover) {
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
            }
        },
        //------------------------------------------------------------ For displaying truncated text in a v-menu
        handleShowTruncatedText(e, item, header, cellIndex) {
            if (item.level > 0 || header.cellTruncated) {
                const { children } = e.target
                let truncatedEleWidth = 0
                let wrapperOffsetwidth = 0
                for (let i = 0; i < children.length; ++i) {
                    if (children[i].className.includes('text-truncate')) {
                        wrapperOffsetwidth = children[i].offsetWidth
                        let childNodes = children[i].childNodes
                        for (let n = 0; n < childNodes.length; ++n) {
                            let childNodesClass = childNodes[n].className
                            if (
                                childNodesClass &&
                                childNodesClass.includes('text-truncate__value')
                            ) {
                                truncatedEleWidth = childNodes[n].offsetWidth
                                break
                            }
                        }
                        break
                    }
                }
                if (wrapperOffsetwidth < truncatedEleWidth) {
                    this.showTruncatedTextAt = cellIndex

                    this.truncatedMenuPos.x = truncatedEleWidth - wrapperOffsetwidth
                } else this.showTruncatedTextAt = null
            }
        },
        //------------------------------------------------------------ For nested data, auto display dropdown table row

        levelRecursive(arr, newArr, nodeActiveIds, isExpanded) {
            let self = this

            arr.forEach(function(o) {
                if (o.children && o.children.length !== 0) {
                    !self.dataHasNestedChild && (self.dataHasNestedChild = true)

                    newArr.push(o)
                    for (let i = 0; i < nodeActiveIds.length; ++i) {
                        if (o.nodeId === nodeActiveIds[i]) {
                            o.expanded = isExpanded
                        }
                    }
                    if (o.expanded === true) {
                        self.levelRecursive(o.children, newArr, nodeActiveIds, isExpanded)
                    }
                } else {
                    newArr.push(o)
                    return false
                }
            })
        },
        toggleChild(node) {
            const self = this

            // show node's children
            if (node.leaf === false && node.expanded === false && node.children.length > 0) {
                self.nodeActiveIds.push(node.nodeId)
                self.levelRecursive(node.children, [], self.nodeActiveIds, true)
            } else {
                // collapse node's children
                this.collapseNodeChildren(node)
            }
        },

        toggleAllNodeChildren() {
            for (let i = 0; i < this.treeData.length; ++i) {
                let node = this.treeData[i]
                this.toggleNodeChildren(node)
            }
        },

        toggleNodeChildren(node) {
            const self = this
            if (node.expanded === false && node.children.length > 0) {
                self.$set(node, 'expanded', true)
                node.children.forEach(o => {
                    self.toggleNodeChildren(o)
                })
                self.nodeActiveIds.push(node.nodeId)
            }
        },

        collapseNodeChildren(node) {
            const self = this
            if (node.expanded === true && node.children.length > 0) {
                self.$set(node, 'expanded', false)
                node.children.forEach(o => {
                    self.collapseNodeChildren(o)
                })
                self.nodeActiveIds.splice(self.nodeActiveIds.indexOf(node.nodeId), 1)
            }
        },

        hasChild(item) {
            return item.children && item.children.length
        },

        setTableHeadPadding() {
            return this.dataHasNestedChild ? 'padding: 0 48px;' : 'padding: 0 24px;'
        },
        setCellPadding(item, cellIndex) {
            if (this.dataHasNestedChild) {
                if (cellIndex === 0) {
                    let offset = 36 * item.level
                    if (item.level === 0 && !item.leaf) {
                        // already have btn 32px plus mr=4px
                        offset += 8
                    } else if (item.level === 0 && item.leaf) {
                        offset += 48
                    }
                    // For level above 0, when there is no button rendered, plus offsetwidth of btn
                    if (item.level > 0 && item.leaf) {
                        offset += 36
                    }

                    let padding = `padding: 0px 48px 0px ${offset}px;`

                    return padding
                } else return `padding: 0px 48px 0px 48px;`
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
