<template>
    <v-data-table
        v-sortable-table
        :headers="visibleHeaders"
        :items="!loading ? tableRows : []"
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
        @current-items="getCurrentItems"
        @drag-reorder="dragReorder"
    >
        <!----------------------------------------------------TABLE HEAD--------------------------------------------->
        <template v-slot:header="{ props: { headers } }">
            <thead class="v-data-table-header">
                <tr>
                    <!-- Only render this extra th if data length > 0 and has props hasOrderNumber enabled 
                    By doing this, it won't break the no-data view when data length = 0
                    -->
                    <th v-if="data.length && hasOrderNumber && !loading" width="1px" class="pa-0" />
                    <th
                        v-for="(header, i) in headers"
                        :key="i"
                        :width="header.width"
                        :class="thClasses(header)"
                        @click="header.sortable !== false ? changeSort(header.value) : null"
                    >
                        <div class="d-inline-flex justify-center align-center">
                            <span v-if="header.text !== 'Action'">{{ header.text }}</span>
                            <slot :name="`append-${header.value}`"> </slot>
                            <v-icon
                                v-if="header.sortable !== false"
                                size="14"
                                class="ml-3 v-data-table-header__icon"
                            >
                                $vuetify.icons.arrowDown
                            </v-icon>
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
            <!-- A key need to be set when table row is draggable -->
            <tr
                :key="item.nodeId || item.id"
                ref="tableRow"
                :class="trClasses(rowIndex)"
                @click="rowClick(item, headers, visibleHeaders)"
                @mouseover="e => onRowHover(e, rowIndex)"
                @mouseleave="e => onRowHover(e, rowIndex)"
            >
                <!-- Only render this extra th if data length >0 and has props hasOrderNumber enabled 
                    By doing this, it won't break the no-data view when data length = 0
                    -->
                <td
                    v-if="data.length && hasOrderNumber && !loading"
                    class="overline px-2 color border-right-table-border text-field-text"
                >
                    {{ rowIndex }}
                </td>
                <td
                    v-for="(header, cellIndex) in visibleHeaders"
                    :key="cellIndex"
                    :ref="cellIndex < colsHasRowSpan ? 'rowGroup' : 'cell'"
                    :rowspan="cellIndex < colsHasRowSpan ? item.rowspan : null"
                    :class="tdClasses(header, item, cellIndex)"
                    :style="isTree && setCellPadding(item, cellIndex)"
                    @click="cellClick(item, headers, visibleHeaders)"
                    @mouseover="e => cellHover(e, item, cellIndex)"
                    @mouseout="e => cellHover(e, item, cellIndex)"
                    @mouseenter="e => handleShowTruncatedText(e, item, header, cellIndex)"
                >
                    <v-icon
                        v-show="showDragIcon(rowIndex, cellIndex)"
                        :class="{ 'drag-handle move': draggable }"
                        class="color text-field-text"
                        size="16"
                    >
                        drag_handle
                    </v-icon>
                    <div
                        :style="itemWrapperAlign(header)"
                        :class="itemWrapperClasses(header, item, cellIndex)"
                    >
                        <!-- Display toggle button at the first column-->
                        <v-btn
                            v-if="cellIndex === 0"
                            width="32"
                            height="32"
                            class="arrow-toggle mr-1"
                            icon
                            :class="[item.children && item.children.length ? '' : 'hide']"
                            @click="toggleChild(item, rowIndex)"
                        >
                            <v-icon
                                :class="[item.expanded === true ? 'arrow-down' : 'arrow-up']"
                                size="24"
                                color="#013646"
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
                                            indexOfTruncatedHoveredRow === cellIndex
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
                            v-if="renderActionsSlot(rowIndex, cellIndex)"
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

/* 
This component accepts
_headers props as array of objects, each object must has text:String, value:Any and 
may has sortable:Boolean, editableCol:Boolean, align: String, cellTruncated: Boolean

_data props as array of objects, each object must has either item.nodeId:Number || item.id:Any or both

SLOTS available for this component:
_slot :name="header.value" // slot aka item
_slot  name="actions" :data="{ item }"
_slot :name="`append-${header.value}`"  
*/
export default {
    name: 'data-table',
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
        headers: { type: Array, required: true },
        data: { type: Array, required: true },
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
        // For table wants to keep primitive value, eg:if it is false, null/undefined won't be displayed
        keepPrimitiveValue: { type: Boolean, default: false },
        // For draggable feature
        draggable: { type: Boolean, default: false },
        dragReorder: { type: Function, default: () => null },
        hasOrderNumber: { type: Boolean, default: false },
        showActionsOnHover: { type: Boolean, default: false },
        // rowspan feature, data array must contains objects having groupId property.
        colsHasRowSpan: { type: Number },
    },
    data() {
        return {
            //style
            tableHeadPadding: 'py-0 px-6',
            //common
            pagination: {},
            visible: [],
            isColumnToggleVisible: false,
            // use when draggable or showActionsOnHover is enabled
            indexOfHoveredRow: null,
            //draggable
            showDragEntity: false,
            //For displaying truncated text in a v-menu
            indexOfTruncatedHoveredRow: null,
            truncatedMenuPos: { x: 0, y: 16.5 },
            //For nested data, auto display dropdown table row
            nodeActiveIds: [],
            isTree: false,
            //rowspan feature
            currentPageItems: null,
        }
    },
    computed: {
        visibleHeaders() {
            return this.headers.filter(header => this.visible.includes(header))
        },

        // first processing data from data props
        processingData: function() {
            const self = this
            let result = self.data
            if (!self.keepPrimitiveValue) {
                result = self.$help.cloneDeep(self.data)
                for (let i = 0; i < result.length; ++i) {
                    let obj = result[i]
                    Object.keys(obj).forEach(key => (obj[key] = self.$help.handleValue(obj[key])))
                }
            }
            return result
        },

        tableRows: function() {
            const self = this
            let newArr = []
            self.levelRecursive(self.processingData, newArr, self.nodeActiveIds)
            return newArr
        },

        getDataLength: function() {
            const self = this
            const flattenedNodes = self.$help.flattenNodes(
                self.$help.cloneDeep(self.processingData)
            )
            return flattenedNodes.length
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
                // when table is loading , dont show drag icon or actions slot
                this.draggable && (this.showDragEntity = false)
                this.indexOfHoveredRow = null
            }
        },

        editableCell: function(val) {
            if (val) {
                this.toggleAllNodesChildren()
            }
        },
        isTree: function(val) {
            if (val) this.tableHeadPadding = 'py-0 px-12'
            else this.tableHeadPadding = 'py-0 px-6'
        },
    },

    created() {
        this.visible = this.headers.filter(h => !h.hidden)
    },

    methods: {
        //---------------------------------Internal styles and class bindings-------------------------------------------
        thClasses(header) {
            return [
                header.align && `text-${header.align}`,
                header.sortable !== false && 'pointer sortable',
                this.pagination.sortDesc[0] ? 'desc' : 'asc',
                (header.value === this.pagination.sortBy[0]) & 'active',
                header.text === 'Action' && 'px-0',
                this.tableHeadPadding,
            ]
        },

        trClasses(rowIndex) {
            return {
                // for styling and common class
                pointer: this.onRowClick,
                'last-row': rowIndex === this.currentPageItems.length - 1,
                // for editable feature
                'v-data-table__editable-cell-mode': this.editableCell,
                // for row draggble feature
                'draggable-row': this.draggable,
            }
        },

        tdClasses(header, item, cellIndex) {
            return [
                // for rowspan feature
                item.hidden && cellIndex < this.colsHasRowSpan && 'hide',
                this.colsHasRowSpan &&
                    (cellIndex < this.colsHasRowSpan
                        ? `${item.groupId}-rowspan`
                        : `${item.groupId}-cell`),
                // for editable feature
                this.editableCell && header.editableCol && 'v-data-table__editable-cell',
                // for action slots
                header.value === 'action' && 'pr-3',
                // for tree view feature
                item.expanded && 'font-weight-bold',
                // for styling and common class
                header.value,
                header.align && `text-${header.align}`,
                this.tdBorderLeft || cellIndex === this.colsHasRowSpan
                    ? 'color border-left-table-border'
                    : '',
                item.level > 0 || header.cellTruncated ? 'text-truncate cell-truncate' : '',
                this.draggable && 'relative',
            ]
        },

        itemWrapperClasses(header, item, cellIndex) {
            return [
                item.level > 0 || header.cellTruncated ? 'text-truncate' : '',
                (item.level > 0 || header.cellTruncated) &&
                    this.indexOfTruncatedHoveredRow === cellIndex &&
                    'pointer',
                'relative',
            ]
        },

        itemWrapperAlign(header) {
            // make centering cell more accurate that ommit the width of the sort arrow from the header
            let marginRight = header.align && header.sortable !== false ? 26 : ''
            if (this.hasColumnToggle && header.sortable !== false) {
                marginRight += 34
            }
            return {
                marginRight: `${marginRight}px`,
            }
        },

        //---------------------------------Table helper functions and features------------------------------------------
        getValue(item, header) {
            // data type shouldn't be handled here as it will break the filter result
            // use helper function to handle value before passing the data to table
            let value = item[header.value]
            return this.$help.isFunction(header.format) ? header.format(value) : `${value}`
        },

        columnToggle() {
            this.isColumnToggleVisible = !this.isColumnToggleVisible
        },

        //---------------------------------Table sorting ---------------------------------------------------------------
        // Currently support sorting one column at a time
        customSort(items, sortBy, isDesc) {
            let result = items
            let hashArr = {} // O(n log n)
            const self = this
            for (let i = 0; i < items.length; ++i) {
                if (hashArr[items[i].parentId] == undefined) hashArr[items[i].parentId] = []
                hashArr[items[i].parentId].push(items[i])
            }

            if (sortBy.length) {
                result = this.hierarchySort(hashArr, 0, sortBy, isDesc, [])
                if (!result.length)
                    result = items.sort((a, b) => self.sortOrder(a, b, isDesc, sortBy))
            }

            if (this.colsHasRowSpan) {
                const newArr = this.processingRowspanTable(result)
                result = newArr
            }

            return result
        },

        hierarchySort(hashArr, key, sortBy, isDesc, result) {
            if (hashArr[key] === undefined) return result
            const self = this
            let arr = hashArr[key].sort((a, b) => self.sortOrder(a, b, isDesc, sortBy))
            for (let i = 0; i < arr.length; ++i) {
                result.push(arr[i])
                const key = arr[i].nodeId || arr[i].id
                self.hierarchySort(hashArr, key, sortBy, isDesc, result)
            }
            return result
        },

        sortOrder(a, b, isDesc, sortBy) {
            if (isDesc[0]) {
                return b[sortBy] < a[sortBy] ? -1 : 1
            } else {
                return a[sortBy] < b[sortBy] ? -1 : 1
            }
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

        //---------------------------------methods for Rowspan feature--------------------------------------------------
        getCurrentItems(items) {
            this.colsHasRowSpan && this.processingRowspanTable(items, 'mutate')
            this.currentPageItems = items
        },

        /**
         * @param {Array} data Array of objects
         * @param {String} mode mutate or undefined
         * @return {Array} Return new array if mode!=='mutate'
         * if mode ==='mutate', changes will be mutated, otherwise it returns a new array
         */
        processingRowspanTable(data, mode) {
            if (mode === 'mutate') this.handleDisplayRowspan(data)
            else return this.handleDisplayRowspan(this.$help.cloneDeep(data))
        },

        /**
         * @param {Array} target Array of objects
         * @return {Array} Always return new array
         * This function group all items have same groupdID and assign correct value for hidden and rowspan properties.
         */
        handleDisplayRowspan(target) {
            let uniqueSet = new Set(target.map(item => item.groupId))
            let itemsId = [...uniqueSet]
            let groupedId = this.$help.groupBy(target, 'groupId')
            let result = []
            for (let i = 0; i < itemsId.length; ++i) {
                let group = groupedId[`${itemsId[i]}`]

                for (let n = 0; n < group.length; ++n) {
                    group[n].rowspan = group.length
                    if (n === 0) group[n].hidden = false
                    else group[n].hidden = true
                    result.push(group[n])
                }
            }
            return result
        },

        /**
         * @param {Object} e event object
         * @param {Object} item object
         * This function group all items have same groupdID and assign correct value for hidden and rowspan properties.
         */
        cellHover(e, item, cellIndex) {
            // rowspan feature
            if (this.colsHasRowSpan) {
                const target = cellIndex < this.colsHasRowSpan ? 'rowgroup' : 'cell'
                const { groupId } = item
                // Make associated td elements to have the same hover effect
                let bg = e.type === 'mouseover' ? '#fafcfc' : ''
                if (target === 'cell') {
                    let elements = this.$refs.rowGroup.filter(ele =>
                        ele.attributes.class.value.includes(`${groupId}-rowspan`)
                    )

                    elements.forEach(ele => (ele.style.backgroundColor = bg))
                } else if (target === 'rowgroup') {
                    let elements = this.$refs.cell.filter(ele =>
                        ele.attributes.class.value.includes(`${groupId}-cell`)
                    )

                    elements.forEach(ele => (ele.style.backgroundColor = bg))
                }
            }
        },

        //---------------------------------callback function Props------------------------------------------------------
        rowClick(item, headers) {
            this.onRowClick && this.onRowClick(item, headers)
        },

        cellClick(item, header) {
            this.onCellClick && this.onCellClick(item, header)
        },

        //---------------------------------For displaying actions btn/icon on table row---------------------------------
        /**
         * @param {Number} index index of current hovered row
         * This function helps to display either drag icon or actions slot at index of hovered row.
         */
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
                            self.indexOfHoveredRow = index
                        }
                        break
                    case 'mouseleave':
                        self.draggable && (self.showDragEntity = false)
                        self.indexOfHoveredRow = null
                        break
                }
            }
        },

        // render actions slot at indexOfHoveredRow
        renderActionsSlot(rowIndex, cellIndex) {
            return (
                this.indexOfHoveredRow === rowIndex &&
                // show at last columns
                cellIndex === this.visibleHeaders.length - 1
            )
        },

        // show drag handle icon at indexOfHoveredRow
        showDragIcon(rowIndex, cellIndex) {
            return (
                this.showDragEntity &&
                this.indexOfHoveredRow === rowIndex &&
                cellIndex === this.visibleHeaders.length - 1
            )
        },

        //---------------------------------For displaying truncated text in a v-menu------------------------------------
        /**
         * This function helps to show cell value as a menu when text is truncated
         */
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
                    this.indexOfTruncatedHoveredRow = cellIndex

                    this.truncatedMenuPos.x = truncatedEleWidth - wrapperOffsetwidth
                } else this.indexOfTruncatedHoveredRow = null
            }
        },

        //---------------------------------For nested data, displaying dropdown table row-------------------------------
        /**
         * @param {Array} arr root array
         * @param {Array} newArr result array
         * @param {Array} nodeActiveIds array of active node ( node has been opened)
         * @return {Array} newArr new array that has element of root array and its children
         */
        levelRecursive(arr, newArr, nodeActiveIds) {
            let self = this
            arr.forEach(function(o) {
                if (o.children && o.children.length !== 0) {
                    !self.isTree && (self.isTree = true)

                    newArr.push(o)
                    for (let i = 0; i < nodeActiveIds.length; ++i) {
                        if (o.nodeId === nodeActiveIds[i]) {
                            o.expanded = true
                        }
                    }
                    if (o.expanded === true) {
                        self.levelRecursive(o.children, newArr, nodeActiveIds)
                    }
                } else {
                    newArr.push(o)
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

        toggleAllNodesChildren(nodes) {
            let treeNodes = nodes || this.tableRows
            for (let i = 0; i < treeNodes.length; ++i) {
                let node = treeNodes[i]
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

        collapseAllNodesChildren() {
            for (let i = 0; i < this.tableRows.length; ++i) {
                let node = this.tableRows[i]
                this.collapseNodeChildren(node)
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

        setCellPadding(item, cellIndex) {
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
