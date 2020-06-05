<template>
    <fragment>
        <v-data-table
            v-sortable-table
            :headers="headers"
            :items="!loading ? tableRows : []"
            :hide-default-header="true"
            :hide-default-footer="showAll ? true : tableRows.length <= 10"
            :items-per-page="showAll ? -1 : itemsPerPage"
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
            <!----------------------------------------------------TABLE HEAD------------------------------------------>
            <template v-slot:header="{ props: { headers } }">
                <thead class="v-data-table-header">
                    <tr>
                        <th
                            v-for="(header, i) in headers"
                            :key="i"
                            :width="header.width"
                            :style="{ padding: header.padding }"
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
                        </th>
                    </tr>
                </thead>
            </template>

            <!----------------------------------------------------TABLE ROW------------------------------------------->
            <template v-slot:item="{ item, index: rowIndex }">
                <!-- A key need to be set when table row is draggable -->
                <tr
                    :key="item.nodeId || item.id"
                    ref="tableRow"
                    :class="trClasses(rowIndex)"
                    v-on="
                        draggable || showActionsOnHover
                            ? {
                                  mouseenter: e => onRowHover(e, rowIndex),
                                  mouseleave: e => onRowHover(e, rowIndex),
                              }
                            : null
                    "
                >
                    <td
                        v-for="(header, cellIndex) in headers"
                        :key="cellIndex"
                        :ref="cellIndex < colsHasRowSpan ? 'rowGroup' : 'cell'"
                        :rowspan="cellIndex < colsHasRowSpan ? item.rowspan : null"
                        :class="tdClasses(header, item, cellIndex)"
                        :style="isTree && hasValidChild && cellLevelPadding(item, cellIndex)"
                        @mouseleave="e => cellMouseEnter(e, item, rowIndex, cellIndex, header)"
                        @mouseenter="e => cellMouseEnter(e, item, rowIndex, cellIndex, header)"
                    >
                        <fragment v-if="draggable">
                            <v-icon
                                v-show="showDragIcon(rowIndex, cellIndex)"
                                :class="{ 'drag-handle move': draggable }"
                                class="color text-field-text"
                                size="16"
                            >
                                drag_handle
                            </v-icon>
                        </fragment>

                        <div
                            :ref="`itemWrapperAtRow${rowIndex}Cell${cellIndex}`"
                            :style="itemWrapperAlign(header)"
                            :class="itemWrapperClasses(header, item, cellIndex)"
                        >
                            <!-- Display toggle button at the first column-->
                            <v-btn
                                v-if="cellIndex === 0 && item.children && item.children.length"
                                width="32"
                                height="32"
                                class="arrow-toggle mr-1"
                                icon
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

                            <!-- no content for the corresponding header, usually this is an error -->
                            <span v-if="$help.isUndefined(item[header.value])"></span>
                            <span
                                v-else
                                :id="
                                    `truncatedText_atRow${rowIndex}_atCell${cellIndex}_${componentId}`
                                "
                                :ref="`truncatedTextAtRow${rowIndex}Cell${cellIndex}`"
                            >
                                <slot
                                    :name="header.value"
                                    :data="{ item, header, cellIndex, rowIndex }"
                                >
                                    {{ getValue(item, header) }}
                                </slot>
                            </span>

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
        <v-menu
            offset-x
            transition="slide-x-transition"
            :close-on-content-click="false"
            open-on-hover
            :nudge-left="truncatedMenu.x"
            :nudge-top="truncatedMenu.y"
            content-class="shadow-drop color text-navigation"
            :activator="
                `#truncatedText_atRow${truncatedMenu.rowIndex}_atCell${truncatedMenu.cellIndex}_${componentId}`
            "
        >
            <v-sheet
                v-if="truncatedMenu.item && truncatedMenu.index === truncatedMenu.cellIndex"
                style="border-radius: 10px;overflow:auto"
                class="pa-4"
            >
                <span class="body-2">
                    {{ getValue(truncatedMenu.item, truncatedMenu.header) }}
                </span>
            </v-sheet>
        </v-menu>
    </fragment>
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
may has sortable:Boolean, editableCol:Boolean, align: String, cellTruncated: Boolean, width: String, padding; String

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
        /*
        enable hasOrderNumber to display item index column, however,
        item needs to have its own index property because using table row index will not work properly
        when table items is being searched
         */
        hasOrderNumber: { type: Boolean, default: false },
        showActionsOnHover: { type: Boolean, default: false },
        // rowspan feature, data array must contains objects having groupId property.
        colsHasRowSpan: { type: Number },
        // if data has child object or array, enable this props
        isTree: { type: Boolean, default: false },
    },
    data() {
        return {
            //common
            pagination: {},
            // use when draggable or showActionsOnHover is enabled
            indexOfHoveredRow: null,
            //draggable
            showDragEntity: false,
            //For truncated cell
            truncatedMenu: { index: null, x: 0, y: 16.5 },
            //For nested data, display dropdown table row
            hasValidChild: false,
            nodeActiveIds: [],
            //rowspan feature
            currentPageItems: null,
            // this is needed when using custom activator in v-menu.
            componentId: this.$help.uniqueId('component_v-menu_'),
        }
    },
    computed: {
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
            if (self.isTree) {
                let newArr = []
                self.levelRecursive(self.processingData, newArr, self.nodeActiveIds)
                return newArr
            } else return self.processingData
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
                // // when table is loading , dont show drag icon or actions slot
                this.draggable && (this.showDragEntity = false)
                this.indexOfHoveredRow = null
            }
        },
        editableCell: function(val) {
            if (val && this.isTree && this.hasValidChild) {
                this.toggleAllNodesChildren()
            }
        },
    },

    methods: {
        //---------------------------------Internal styles and class bindings-------------------------------------------
        thClasses(header) {
            return [
                header.align && `text-${header.align}`,
                header.sortable !== false && 'pointer sortable',
                this.pagination.sortDesc[0] ? 'desc' : 'asc',
                header.value === this.pagination.sortBy[0] && 'active',
                header.text === 'Action' && 'px-0',
                this.isTree && this.hasValidChild ? 'py-0 px-12' : 'py-0 px-6',
            ]
        },

        trClasses(rowIndex) {
            return {
                // for styling and common class
                'last-row': rowIndex === this.currentPageItems.length - 1,
                // for editable feature
                'v-data-table__editable-cell-mode': this.editableCell,
                // for row draggble feature
                'draggable-row': this.draggable,
            }
        },

        tdClasses(header, item, cellIndex) {
            return [
                // for showing index number columns from item
                this.hasOrderNumber &&
                    cellIndex === 0 &&
                    'overline px-2 color border-right-table-border text-field-text',
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
                'relative',
                (item.level > 0 || header.cellTruncated) &&
                    this.truncatedMenu.index === cellIndex &&
                    'pointer',
            ]
        },

        itemWrapperAlign(header) {
            // make centering cell more accurate that ommit the width of the sort arrow from the header
            let marginRight = header.align && header.sortable !== false ? 26 : ''
            return {
                marginRight: `${marginRight}px`,
            }
        },
        //---------------------------------Table events----------------------------------------------------------------
        cellMouseEnter(e, item, rowIndex, cellIndex, header) {
            this.$emit('cell-mouseenter', {
                e,
                item,
                rowIndex,
                cellIndex,
                header,
            })
            if (item.level > 0 || header.cellTruncated) {
                this.showTruncatedMenu(item, rowIndex, cellIndex, header)
            }
            if (this.colsHasRowSpan) {
                this.setRowspanBg(e, item, rowIndex, cellIndex)
            }
        },

        //---------------------------------Table helper functions and features------------------------------------------
        getValue(item, header) {
            // data type shouldn't be handled here as it will break the filter result
            // use helper function to handle value before passing the data to table
            let value = item[header.value]
            return this.$help.isFunction(header.format) ? header.format(value) : `${value}`
        },

        //---------------------------------Table sorting ---------------------------------------------------------------
        // Currently support sorting one column at a time
        customSort(items, sortBy, isDesc) {
            let result = items
            const self = this

            // if isTree, create a hash arrray for hierarchySort
            if (sortBy.length && this.isTree) {
                let hashArr = {} // O(n log n)

                for (let i = 0; i < items.length; ++i) {
                    if (hashArr[items[i].parentId] == undefined) hashArr[items[i].parentId] = []
                    hashArr[items[i].parentId].push(items[i])
                }

                result = this.hierarchySort(hashArr, 0, sortBy, isDesc, [])
            } else if (sortBy.length && !this.isTree) {
                result = items.sort((a, b) => self.sortOrder(a, b, isDesc, sortBy))
            }

            // if rowspan feature is enabled, processing sorted arr
            if (this.colsHasRowSpan && result.length) {
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
            this.colsHasRowSpan && items.length && this.processingRowspanTable(items, 'mutate')
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
         * This function group all items have same groupdID and assign
         * correct value for hidden and rowspan properties.
         * If truncated text is activated, this function shows truncated text in v-menu
         */
        setRowspanBg(e, item, rowIndex, cellIndex) {
            const target = cellIndex < this.colsHasRowSpan ? 'rowgroup' : 'cell'
            const { groupId } = item
            // Make associated td elements to have the same hover effect
            let bg = e.type === 'mouseenter' ? '#fafcfc' : ''
            switch (target) {
                case 'cell':
                    {
                        let elements = this.$refs.rowGroup.filter(ele =>
                            ele.attributes.class.value.includes(`${groupId}-rowspan`)
                        )
                        elements.forEach(ele => (ele.style.backgroundColor = bg))
                    }
                    break
                case 'rowgroup':
                    {
                        let elements = this.$refs.cell.filter(ele =>
                            ele.attributes.class.value.includes(`${groupId}-cell`)
                        )
                        elements.forEach(ele => (ele.style.backgroundColor = bg))
                    }
                    break
            }
        },

        /**
         * @param {Object} item object
         * This function shows truncated text in v-menu
         */
        showTruncatedMenu(item, rowIndex, cellIndex, header) {
            // auto truncated text feature
            const wrapper = this.$refs[`itemWrapperAtRow${rowIndex}Cell${cellIndex}`][0]
            const text = this.$refs[`truncatedTextAtRow${rowIndex}Cell${cellIndex}`][0]

            if (wrapper && text && wrapper.offsetWidth < text.offsetWidth) {
                // const wrapperClientRect = wrapper.getBoundingClientRect()
                this.truncatedMenu.index = cellIndex
                this.truncatedMenu.x = text.offsetWidth - wrapper.offsetWidth
                this.truncatedMenu.rowIndex = rowIndex
                this.truncatedMenu.cellIndex = cellIndex
                this.truncatedMenu.item = item
                this.truncatedMenu.header = header
            } else {
                this.truncatedMenu.index = null
            }
        },
        //---------------------------------For displaying actions btn/icon on table row---------------------------------
        /**
         * @param {Number} index index of current hovered row
         * This function helps to display either drag icon or actions slot at index of hovered row.
         */
        onRowHover(e, index) {
            const { type } = e
            let self = this
            switch (type) {
                case 'mouseenter':
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
        },

        // render actions slot at indexOfHoveredRow
        renderActionsSlot(rowIndex, cellIndex) {
            return (
                this.indexOfHoveredRow === rowIndex &&
                // show at last columns
                cellIndex === this.headers.length - 1
            )
        },

        // show drag handle icon at indexOfHoveredRow and show at last columns
        showDragIcon(rowIndex, cellIndex) {
            return (
                this.showDragEntity &&
                this.indexOfHoveredRow === rowIndex &&
                cellIndex === this.headers.length - 1
            )
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
                if (o.children && o.children.length > 0) {
                    self.hasValidChild = true
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

        cellLevelPadding(item, cellIndex) {
            const basePl = 8
            let levelPl = 30 * item.level
            !item.leaf ? (levelPl += 0) : (levelPl += 40)
            return `padding: 0px 48px 0px ${cellIndex === 0 ? basePl + levelPl : '48'}px`
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
