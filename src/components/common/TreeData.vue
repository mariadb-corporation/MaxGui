<template>
    <fragment>
        <div class="header color bg-table-header d-flex justify-center align-center">
            <div
                v-for="(header, i) in headers"
                :key="i"
                class="header__item color text-small-text d-flex align-center text-uppercase "
                :class="[i == 0 ? 'px-12' : 'px-10']"
                :style="{
                    width: header.width,
                }"
            >
                {{ header.text }}
                <span v-if="showTotalRowsNumber && i === 0" class="ml-1 color text-field-text"
                    >({{ data.length }})</span
                >
            </div>
        </div>
        <v-treeview
            item-text="id"
            dense
            hoverable
            :items="data"
            :search="search"
            expand-icon="$expand"
            :open.sync="openSync"
            :transition="true"
        >
            <template v-slot:label="{ item, open }">
                <div
                    class="pointer d-flex align-center tree-node"
                    :class="[open ? 'font-weight-bold' : '']"
                    @click="handleItemClick(item)"
                >
                    <div
                        class="d-flex align-center"
                        :style="{
                            width: item.colNameWidth,
                        }"
                    >
                        <router-link
                            v-if="item.isLink"
                            :to="`/dashboard/servers/${item.id}`"
                            class="no-underline"
                        >
                            <span>{{ item.id }} </span>
                        </router-link>
                        <span v-else> {{ item.id }}</span>
                    </div>
                    <div
                        class="d-flex align-center pl-10"
                        :class="[item.children.length ? '' : 'color border-left-table-border']"
                        style="height:45px"
                        :style="{
                            width: item.colValueWidth,
                        }"
                    >
                        {{ item.value }}
                    </div>
                </div>
            </template>
        </v-treeview>
    </fragment>
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
 * of this software will be governed by version 1 or later of the General
 * Public License.
 */

export default {
    /* This component intends to render nested objects. First level of the object will be rendered first
    by providing keyName props then value props
    The child props will detect whether render nested component or not
    */

    props: {
        data: { type: Array, required: true },
        headers: Array,
        search: String,
        openNode: Array,
        showTotalRowsNumber: { type: Boolean, default: false },
    },
    data() {
        return {
            open: [],
        }
    },
    computed: {
        openSync: {
            // get openNode from props
            get() {
                return this.openNode
            },
            // set the value to show property in data
            set(openNode) {
                this.open = openNode
            },
        },
    },
    methods: {
        handleItemClick() {
            // console.log('item', item)
        },
    },
}
</script>
<style lang="scss" scoped>
.tree-node {
    font-size: 0.875rem;
    color: $navigation;
    white-space: nowrap;
}
.header {
    height: 48px;
    &__item {
        font-size: 11px;
        border-bottom: none;
        white-space: nowrap;
        font-weight: 600;
    }
}
.v-treeview {
    border-left: thin solid #e7eef1;
    border-right: thin solid #e7eef1;
}

::v-deep .v-treeview-node__root {
    border-bottom: thin solid #e7eef1;
    padding-left: 18px;
}

::v-deep .v-treeview-node__toggle {
    transform: none;
}
::v-deep .v-treeview-node__toggle--open {
    transform: rotate(-180deg);
}
</style>
