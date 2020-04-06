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
                <span v-if="i === 0" class="ml-1 color text-field-text">({{ data.length }})</span>
            </div>
        </div>
        <!-- <nested-collapse
            v-for="(item, i) in data"
            :key="i"
            :keyName="item.id"
            :value="$help.handleValue(item.value)"
            :child="$help.hasChild(item.value) ? item.value : null"
            :headers="headers"
            :index="i"
        /> -->
        <div class="tree-view">
            <nested-collapse
                :keyName="data[1].id"
                :value="$help.handleValue(data[1].value)"
                :child="$help.hasChild(data[1].value) ? data[1].value : null"
                :headers="headers"
                :index="0"
            />
        </div>
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
import NestedCollapse from './NestedCollapse'
export default {
    /* This component intends to render nested objects. First level of the object will be rendered first
    by providing keyName props then value props
    The child props will detect whether render nested component or not
    */
    components: {
        NestedCollapse,
    },
    props: {
        data: [Array],
        headers: Array,
    },
}
</script>
<style lang="scss" scoped>
.header {
    height: 48px;
    &__item {
        font-size: 11px;
        border-bottom: none;
        white-space: nowrap;
        font-weight: 600;
    }
}
.tree-view {
    border-left: thin solid $table-border;
    border-right: thin solid $table-border;
}
</style>
