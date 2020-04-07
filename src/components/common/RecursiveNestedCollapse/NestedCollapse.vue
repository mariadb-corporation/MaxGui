<template>
    <div class="treeview-node">
        <div class="d-flex align-center treeview-node__root">
            <div
                class="treeview-node__content__keyname d-flex align-center"
                :style="{
                    width: headers[0].width,
                }"
            >
                <v-btn
                    v-if="$help.hasChild(child)"
                    icon
                    class="arrow-toggle"
                    :class="[firstLevelRoot ? 'ml-3' : '']"
                    @click="toggleShow"
                >
                    <v-icon :class="[!showChild ? 'arrow-down' : 'arrow-up']" size="24">
                        $expand
                    </v-icon>
                </v-btn>

                <span :class="[$help.hasChild(child) ? '' : 'ml-3']">{{ keyName }}</span>
            </div>
            <span
                v-if="!$help.hasChild(child)"
                class="pl-10 treeview-node__content__keyValue color border-left-table-border d-flex align-center "
                :style="{
                    width: headers[1].width,
                    height: '45px',
                }"
            >
                {{ value }}
            </span>
        </div>
        <v-expand-transition>
            <div v-show="showChild" class="treeview-node__children ">
                <nested-collapse
                    v-for="(childValue, childKeyName) in child"
                    :key="childKeyName"
                    :keyName="childKeyName"
                    :value="$help.handleValue(childValue)"
                    :child="$help.hasChild(childValue) ? childValue : {}"
                    :headers="headers"
                    :firstLevelRoot="false"
                />
            </div>
        </v-expand-transition>
    </div>
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
        // null object value has been handle by handleValue
        value: [String, Number, Boolean, Object, Array],
        child: [Object, Array],
        index: Number,
        headers: Array,
        firstLevelRoot: Boolean,
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
.treeview-node {
    &__root {
        min-height: 45px;
        border-bottom: thin solid $table-border;
        &:hover {
            background: #eeeeee;
        }
    }
    .treeview-node {
        padding-left: 36px;
    }
}
</style>
