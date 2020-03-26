<template>
    <v-data-table
        v-resize="onResize"
        :headers="visibleHeaders"
        :items="data"
        :hide-default-footer="data.length <= 10"
        :hide-default-header="true"
        :footer-props="{ 'items-per-page-options': [] }"
        :class="['data-table-full', tableClass]"
        :loading="loading"
        :options.sync="pagination"
        :items-per-page="itemsPerPage"
        :page="page"
        :sort-by="sortBy"
        :sort-desc="sortDesc"
        :search="search"
        item-key="name"
        :dense="dense"
    >
        <!----------------------------------------------------TABLE HEAD--------------------------------------------->
        <template v-slot:header="{ props: { headers } }">
            <thead
                :class="[windowSize.x < 600 && 'v-data-table-header-mobile']"
                class="v-data-table-header"
            >
                <tr v-if="windowSize.x >= 600">
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
                            <v-icon
                                v-if="header.sortable !== false"
                                size="7"
                                class="ml-1 v-data-table-header__icon"
                                >$vuetify.icons.arrowDown</v-icon
                            >
                        </div>
                    </th>
                    <!-- Add an extra table heading to remain text align ability in heading
                        display searchbox and toggle icon as the last th item
                        Only display in large tablet to laptop md
                     -->
                    <th
                        v-if="windowSize.x > 960 && hasColumnToggle"
                        style="padding-left:12px; padding-right:12px"
                    >
                        <div
                            v-if="hasColumnToggle"
                            style="width:100%;"
                            class="d-flex align-center "
                        >
                            <!--column toggle icon-->

                            <v-icon
                                v-if="hasColumnToggle"
                                size="18"
                                class="pl-4 pr-0 toggle-icon"
                                @click.stop="columnToggle"
                            >
                                visibility
                            </v-icon>
                        </div>
                    </th>
                </tr>
                <tr v-else>
                    <data-table-header-mobile :items="headers" @sort="changeSort" />
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
                <!-- Add extra table data -->
                <td v-if="isColumnToggleVisible" />
            </tr>
        </template>

        <!----------------------------------------------------TABLE ROW--------------------------------------------->
        <template v-slot:item="{ item, index }">
            <tr
                :class="{
                    pointer: onRowClick,
                    'last-row': index === data.length - 1,
                    'v-data-table__mobile-table-row': windowSize.x < 600,
                }"
                @click="rowClick(item, headers, visibleHeaders)"
            >
                <!--
                     v-if="!$_.isUndefined(item[header.value]) || header.text === 'Actions'"
                    -->

                <td
                    v-for="(header, i) in visibleHeaders"
                    :key="i"
                    :rowspan="i < numOfColsHasRowSpan ? item.rowspan : 1"
                    :class="[
                        header.value,
                        header.tdClass || header.class,
                        windowSize.x < 600 && 'v-data-table__mobile-row',
                    ]"
                    :style="
                        `${i === numOfColsHasRowSpan ? 'border-left: 1px solid #e7eef1;' : ''}
                    ${item.hidden && i < numOfColsHasRowSpan ? 'display:none' : ''}
                    `
                    "
                    @click="cellClick(item, headers, visibleHeaders)"
                >
                    <!--
                            Display header in  table data for Mobile view 
                            as thead will be removed when windowSize.x < 600 
                        -->
                    <div v-if="windowSize.x < 600" class="v-data-table__mobile-row__header">
                        {{ header.text }}
                    </div>
                    <!-- Adde mobile class when windowSize.x < 600 -->
                    <div :class="[windowSize.x < 600 && 'v-data-table__mobile-row__cell']">
                        <slot :name="header.value" :data="{ item, header }">
                            <!-- no content for the corresponding header, usually this is an error -->
                            <span v-if="$_.isUndefined(item[header.value])"></span>
                            <!-- regular cell -->
                            <span v-else>{{ getValue(item, header) }}</span>
                        </slot>
                        <!-- Actions slot includes expandIndicator slot -->
                        <div
                            v-if="header.text === 'Actions'"
                            :class="`d-flex justify-${header.align}`"
                        >
                            <slot :data="{ item }" name="actions" />
                            <!-- expandle activator -->
                            <v-tooltip top>
                                <template v-slot:activator="{ on }">
                                    <v-btn
                                        v-if="$scopedSlots['expandable']"
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
                                            <v-icon v-if="!expandedRows.includes(item.id)" size="24"
                                                >keyboard_arrow_down</v-icon
                                            >
                                            <v-icon v-else size="24">keyboard_arrow_up</v-icon>
                                        </slot>
                                    </v-btn>
                                </template>
                                <span>Show detailed information</span>
                            </v-tooltip>
                        </div>
                    </div>
                </td>

                <!-- Extra table data item when toggle icon are visible -->
                <td
                    v-if="windowSize.x > 960 && hasColumnToggle"
                    :style="
                        `${headers[headers.length - 1].text === 'Actions' ? 'padding:0px;' : ''}`
                    "
                />
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
import DataTableHeaderMobile from './DataTableHeaderMobile'

export default {
    name: 'data-table',
    components: { DataTableHeaderMobile },
    /* SLOTS available for data-table */
    // :name="header.value" // slot aka item
    // name="actions" :data="{ item }"
    // name="expandable"   :data="{ item }"
    // name="expandIndicator" :expanded Boolean
    props: {
        headers: { type: Array },
        data: { type: Array },
        numOfColsHasRowSpan: { type: Number, default: 0 },
        sortBy: { type: String },
        search: { type: String, default: '' },
        sortDesc: { type: Boolean },
        loading: { type: Boolean, default: false },
        singleExpand: { type: Boolean, default: false },
        showExpand: { type: Boolean, default: false },
        tableClass: { type: String, default: 'data-table-full' },
        hasColumnToggle: { type: Boolean, default: true },
        onRowClick: { type: Function },
        onCellClick: { type: Function },
        itemsPerPage: { type: Number, default: 10 },
        page: { type: Number, default: 1 },
        dense: { type: Boolean, default: false },
    },
    data() {
        return {
            windowSize: {
                x: 0,
                y: 0,
            },
            expandedRows: [],
            pagination: {},
            visible: [],
            isColumnToggleVisible: false,
        }
    },
    computed: {
        visibleHeaders() {
            return this.headers.filter(header => this.visible.includes(header))
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
    mounted() {
        this.onResize()
    },
    created() {
        this.visible = this.headers.filter(h => !h.hidden)
    },

    methods: {
        onResize() {
            this.windowSize = { x: window.innerWidth, y: window.innerHeight }
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
            const value =
                item[header.value] || item[header.value] === 0
                    ? item[header.value].text || item[header.value]
                    : 'n/a'

            return this.$_.isFunction(header.format) ? header.format(value) : value
        },
        columnToggle() {
            this.isColumnToggleVisible = !this.isColumnToggleVisible
        },
    },
}
</script>
