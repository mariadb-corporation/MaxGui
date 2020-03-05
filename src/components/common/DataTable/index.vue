<template>
    <v-data-table
        v-resize="onResize"
        item-key="name"
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
    >
        <!-- Toggle the column, enable this feature by set hasColumnToggle to be true  -->
        <template v-if="hasColumnToggle && isColumnToggleVisible" v-slot:body.prepend>
            <tr>
                <td class="pl-4" :colspan="visibleHeaders.length" style="height: 100%">
                    <div class="d-flex" style="height: 40px">
                        <v-checkbox
                            color="#0e9bc0"
                            class="small ma-0 py-2 pa-0 pr-2"
                            v-model="visible"
                            v-for="(header, i) in headers"
                            :key="`check-${i}`"
                            :label="header.text || header.value"
                            :value="header"
                        />
                    </div>
                </td>
            </tr>
        </template>
        <template v-slot:header="{ props: { headers } }">
            <thead class="v-data-table-header" :class="[windowSize.x < 600 && 'v-data-table-header-mobile']">
                <tr v-if="windowSize.x >= 600">
                    <th
                        v-for="(header, i) in headers"
                        :width="header.width"
                        :key="header.text"
                        :class="[
                            header.align && `text-${header.align}`,
                            header.sortable !== false ? 'pointer sortable' : '',
                            pagination.sortDesc[0] ? 'desc' : 'asc',
                            header.value === pagination.sortBy[0] ? 'active' : '',
                        ]"
                        @click="changeSort(header.value)"
                    >
                        <!--
                            This condition i === headers.length - 1 is to display searchbox and
                            toggle icon as the last th item 
                            -->
                        <div v-if="i === headers.length - 1" class="d-flex">
                            <div>
                                <span>{{ header.text }}</span>
                                <v-icon
                                    v-if="header.sortable !== false"
                                    size="16"
                                    class="ml-2 v-data-table-header__icon fa fa-chevron-up"
                                />
                            </div>
                            <v-spacer></v-spacer>
                            <!--                               
                                <search-box
                                    v-if="hasSearch && !isColumnToggleVisible"
                                    class="pl-2 color text-text border-text-subtle"
                                    position="right"
                                    v-model="search"
                                    @click.native.stop
                                /> -->
                            <!--column toggle icon-->
                            <v-icon
                                v-if="hasColumnToggle"
                                size="18"
                                class="pl-4 pr-0 toggle-icon fa fa-eye"
                                @click.stop="columnToggle"
                            />
                        </div>
                        <template v-else>
                            <span>{{ header.text }}</span>
                            <v-icon
                                v-if="header.sortable !== false"
                                size="16"
                                class="ml-2 v-data-table-header__icon fa fa-chevron-up"
                            />
                        </template>
                    </th>
                </tr>
                <tr v-else>
                    <data-table-header-mobile @sort="changeSort" :items="headers" />
                </tr>
            </thead>
        </template>

        <template v-slot:item="{ item, index }">
            <tr
                @click="rowClick(item, headers, visibleHeaders)"
                :class="{
                    pointer: onRowClick || $scopedSlots['expandable'],
                    'last-row': index === data.length - 1,
                    'v-data-table__mobile-table-row': windowSize.x < 600,
                }"
            >
                <td
                    v-for="(header, i) in visibleHeaders"
                    @click="cellClick(item, headers, visibleHeaders)"
                    :key="i"
                    :class="[
                        header.value,
                        header.tdClass || header.class,
                        windowSize.x < 600 && 'v-data-table__mobile-row',
                    ]"
                >
                    <template v-if="windowSize.x >= 600">
                        <slot :name="header.value" :data="{ item, header }">
                            <!-- no content for the corresponding header, usually this is an error -->
                            <span v-if="$typy(item[header.value]).isUndefined"></span>
                            <!-- regular cell -->
                            <span v-else>{{ getValue(item, header) }}</span>
                        </slot>
                        <!-- expandle row -->
                        <div v-if="i === headers.length - 1" style="display:flex">
                            <slot name="actions" :data="{ item }" />
                            <slot
                                v-if="$scopedSlots['expandable']"
                                name="expandIndicator"
                                :expanded="expandedRows.includes(item.id)"
                            />
                        </div>
                    </template>
                    <!-- Mobile view -->
                    <template v-else>
                        <div class="v-data-table__mobile-row__header">{{ header.text }}</div>
                        <div class="v-data-table__mobile-row__cell">
                            <slot :name="header.value" :data="{ item, header }">
                                <!-- no content for the corresponding header, usually this is an error -->
                                <span v-if="$typy(item[header.value]).isUndefined"></span>
                                <!-- regular cell -->
                                <span v-else>{{ getValue(item, header) }}</span>
                                <!-- expandle row -->
                                <div v-if="i === headers.length - 1" style="display:flex">
                                    <slot name="actions" :data="{ item }" />
                                    <slot
                                        v-if="$scopedSlots['expandable']"
                                        name="expandIndicator"
                                        :expanded="expandedRows.includes(item.id)"
                                    />
                                </div>
                            </slot>
                        </div>
                    </template>
                </td>
            </tr>
            <!-- optional expandable row -->
            <tr v-if="expandedRows.includes(item.id)" class="expanded-row">
                <td colspan="100%" style="padding: 0;">
                    <slot name="expandable" :data="{ item }" />
                </td>
            </tr>
        </template>
    </v-data-table>
</template>

<script>
import DataTableHeaderMobile from './DataTableHeaderMobile';

export default {
    name: 'data-table',
    components: { DataTableHeaderMobile },
    props: {
        headers: { type: Array },
        data: { type: Array },
        sortBy: { type: String },
        sortDesc: { type: Boolean },
        loading: { type: Boolean, default: false },
        singleExpand: { type: Boolean, default: false },
        showExpand: { type: Boolean, default: false },
        tableClass: { type: String, default: 'data-table-full' },
        // hasSearch: { type: Boolean, default: true },
        hasColumnToggle: { type: Boolean, default: true },
        onRowClick: { type: Function },
        onCellClick: { type: Function },
        itemsPerPage: { type: Number, default: 10 },
        page: { type: Number, default: 1 },
    },
    data() {
        return {
            windowSize: {
                x: 0,
                y: 0,
            },
            expandedRows: [],
            // search: '',
            pagination: {},
            visible: [],
            isColumnToggleVisible: false,
        };
    },
    computed: {
        visibleHeaders() {
            return this.headers.filter(header => this.visible.includes(header));
        },
    },

    watch: {
        pagination: {
            handler(val) {
                this.$emit('pagination', val);
            },
            deep: true,
        },
        data: {
            handler(list) {
                list.forEach(item => {
                    if (item.expanded) this.expandedRows.push(item.id);
                });
            },
        },
    },
    mounted() {
        this.onResize();
    },
    created() {
        this.visible = this.headers.filter(h => !h.hidden);
    },

    methods: {
        onResize() {
            this.windowSize = { x: window.innerWidth, y: window.innerHeight };
        },
        changeSort(column) {
            console.log('column', column);
            // TODO: support multiple column sorting
            if (this.pagination.sortBy[0] === column) {
                this.pagination.sortDesc = [!this.pagination.sortDesc[0]];
            } else {
                this.pagination.sortBy = [column];
                this.pagination.sortDesc = [false];
            }
        },
        rowClick(item, headers) {
            if (this.$scopedSlots['expandable']) this.toggleRow(item.id);
            this.onRowClick && this.onRowClick(item, headers);
        },
        cellClick(item, header) {
            this.onCellClick && this.onCellClick(item, header);
        },
        toggleRow(id) {
            if (!this.$scopedSlots['expandable']) return;

            const isOpen = this.expandedRows.includes(id);

            if (isOpen) {
                this.expandedRows = this.expandedRows.filter(i => i !== id);
            } else {
                this.expandedRows.push(id);
            }
        },
        getValue(item, header) {
            const value =
                item[header.value] || item[header.value] === 0 ? item[header.value].text || item[header.value] : 'n/a';

            return this.$typy(header.format).isFunction ? header.format(value) : value;
        },
        columnToggle() {
            this.isColumnToggleVisible = !this.isColumnToggleVisible;
        },
    },
};
</script>
