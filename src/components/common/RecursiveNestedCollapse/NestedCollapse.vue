<template>
    <fragment>
        <div class="tree-view-node ">
            <div class="d-flex tree-view-node__root align-center ">
                <span
                    class="tree-view-node__content__keyname d-flex align-center"
                    :style="{
                        width: headers[0].width,
                    }"
                >
                    <v-btn v-if="child" icon class="treeview-node__toggle" @click="toggleShow">
                        <v-icon :class="[!showChild ? 'arrow-down' : 'arrow-up']" size="24">
                            $expand
                        </v-icon>
                    </v-btn>
                    <span v-else class="pl-9" />
                    <span>{{ keyName }}</span>
                </span>

                <span
                    v-if="!child"
                    class="pl-10 tree-view-node__content__keyValue color border-left-table-border d-flex align-center "
                    :style="{
                        width: headers[1].width,
                        height: '45px',
                    }"
                >
                    {{ $help.handleEmptyString(value) }}
                </span>
            </div>
            <v-expand-transition>
                <div v-show="showChild" class="treeview-node__children">
                    <nested-collapse
                        v-for="(childValue, childKeyName) in child"
                        :key="childKeyName"
                        :keyName="childKeyName"
                        :value="$help.handleNull(childValue)"
                        :child="$help.hasChild(childValue) ? childValue : null"
                        :headers="headers"
                    />
                </div>
            </v-expand-transition>
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
 * of this software will be governed by version 2 or later of the General
 * Public License.
 */
export default {
    /* This component intends to render nested objects. First level of the object will be rendered first
    by providing keyName props then value props
    The child props will detect whether render nested component or not
    */
    name: 'nested-collapse',
    props: {
        keyName: [String, Number, Boolean, Object],
        value: [String, Number, Boolean, Object], // null object value has been handle by handleNull
        child: [Object, Array],
        index: Number,
        headers: Array,
    },
    data() {
        return {
            showChild: false,
        }
    },

    methods: {
        toggleShow() {
            this.showChild = !this.showChild
        },
    },
}
</script>
<style lang="scss" scoped>
.tree-view-node {
    &__root {
        border-bottom: thin solid $table-border;
        min-height: 45px;
    }
}
.treeview-node__toggle {
    .arrow-up {
        transform: rotate(-180deg);
    }
}
</style>
