<template>
    <v-data-table
        :headers="headers"
        :items="data"
        hide-default-footer
        :hide-default-header="true"
        :class="['data-table-rowspan', tableClass]"
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
        <template v-slot:body="{ items }">
            <template slot="no-results">
                <tr>
                    {{
                        $t('$vuetify.dataIterator.noResultsText')
                    }}
                </tr>
            </template>
            <template v-for="(section, index) in getFormatedItems(items)">
                <tbody :key="index">
                    <tr
                        v-for="item in section"
                        :key="item.id"
                        :class="{ 'last-row': item.isLastRow }"
                    >
                        <td
                            v-for="(header, i) in headers"
                            :key="i"
                            :rowspan="i < numOfColsHasRowSpan ? item.rowspan : 1"
                            :scope="i < numOfColsHasRowSpan ? 'rowgroup' : 'cell'"
                            :class="[
                                header.value,
                                header.tdClass || header.class,
                                i < numOfColsHasRowSpan ? 'data-table-full_rowspan-feat' : '',
                            ]"
                            :style="
                                `${
                                    i === numOfColsHasRowSpan
                                        ? 'border-left: 1px solid #e7eef1;'
                                        : ''
                                }
                    ${item.hidden && i < numOfColsHasRowSpan ? 'display:none' : ''}
                    `
                            "
                            @click="cellClick(item, headers)"
                        >
                            <div>
                                <slot :name="header.value" :data="{ item, header }">
                                    <!-- no content for the corresponding header, usually this is an error -->
                                    <span v-if="$_.isUndefined(item[header.value])"></span>
                                    <!-- regular cell -->
                                    <span v-else>{{ getValue(item, header) }} </span>
                                </slot>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </template>
        </template>
    </v-data-table>
</template>
<script>
export default {
    name: 'data-table-rowspan',
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
        onCellClick: { type: Function },
        itemsPerPage: { type: Number, default: 10 },
        page: { type: Number, default: 1 },
        dense: { type: Boolean, default: false },
    },
    data() {
        return {
            pagination: {},
        }
    },
    watch: {
        pagination: {
            handler(val) {
                this.$emit('pagination', val)
            },
            deep: true,
        },
    },
    methods: {
        changeSort(column) {
            // TODO: support multiple column sorting
            console.log('this.pagination.sortBy[0]', this.pagination.sortBy[0])
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
        getFormatedItems: function(items) {
            let sections = [[]]

            let index = 0

            items.forEach(item => {
                sections[index].push(item)
                if (item.isLastRow) {
                    index++
                    sections[index] = []
                }
            })
            //remove last empty array
            sections.pop()
            return sections
        },
    },
}
</script>
<style lang="scss">
.data-table-rowspan {
    a:hover {
        text-decoration: underline;
    }
    table {
        th {
            padding: 0 24px;
            background-color: $table-border;
            text-transform: uppercase;
            color: $small-text !important;
            font-size: 11px;
            &.active {
                color: #000 !important;
            }
            &:last-child {
                border-radius: 0 5px 0 0;
            }
            &:first-child {
                border-radius: 5px 0 0 0;
            }
            .toggle-icon {
                color: inherit;
            }
        }
        tbody {
            tr {
                pointer-events: none !important;
                td {
                    pointer-events: all !important;
                    padding: 0 24px;
                    border-bottom: 1px solid $table-border;
                    font-size: 14px;
                    color: $navigation;
                    @media (max-width: 600px) {
                        border-bottom: none;
                    }
                    &:last-child {
                        border-right: 1px solid $table-border;
                    }
                    &:first-child {
                        border-left: 1px solid $table-border;
                    }
                    .cell-accent {
                        height: 100%;
                        padding: 0 24px;
                        margin-left: -24px;
                        display: flex;
                        border-left: 8px solid #828282;
                        &.info-accent {
                            border-color: $accent;
                        }
                        &.success-accent {
                            border-color: $success;
                        }
                        &.error-accent {
                            border-color: $error;
                        }
                        &.warning-accent {
                            border-color: $warning;
                        }
                    }
                    &.actions {
                        text-align: right;
                        button {
                            opacity: 0;
                        }
                    }
                }
                // td[scope='cell']:hover {
                //     background-color: #eeeeee !important;
                // }
                &:hover {
                    td.actions button {
                        opacity: 1;
                    }
                }
                &.last-row {
                    td {
                        &:last-child {
                            border-radius: 0 0 5px 0;
                        }
                        &:first-child {
                            border-radius: 0 0 0 5px;
                        }
                    }
                }
            }
        }
        //Zebra stripping hover effect :D
        tbody:hover td[scope='rowgroup'],
        tr:hover td {
            background-color: #eeeeee !important;
        }
    }
}
</style>
