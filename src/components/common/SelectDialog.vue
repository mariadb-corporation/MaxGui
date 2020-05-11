<template>
    <span>
        <base-dialog
            v-model="computeShowDialog"
            :onCancel="onCancel"
            :onSave="onSave"
            :onClose="onClose"
            :title="title"
            :saveText="mode"
            :disabledSaveBtn="$help.isEmpty(selectEntities)"
        >
            <template v-slot:body>
                <fragment>
                    <p>
                        {{ $tc('specify', multiple ? 2 : 1) }}

                        {{ $tc(entityName, multiple ? 2 : 1) }}
                    </p>
                    <v-select
                        v-model="selectEntities"
                        :items="itemsList"
                        item-text="id"
                        return-object
                        outlined
                        dense
                        class="std mariadb-select-input"
                        :menu-props="{ contentClass: 'mariadb-select-v-menu' }"
                        hide-details
                        :no-data-text="
                            $t(`noEntityAvailable`, {
                                entityName: `${$tc(entityName, 2)}`,
                            })
                        "
                        :multiple="multiple"
                        required
                    />
                </fragment>
            </template>
        </base-dialog>
    </span>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
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
    name: 'select-dialog',
    props: {
        value: { type: Boolean, required: true },
        mode: { type: String, required: true }, // change or add
        title: String,
        entityName: String,
        item: Object, // for change mode
        handleSave: { type: Function, required: true },
        onClose: { type: Function, required: true },
        onCancel: { type: Function, required: true },
        multiple: { type: Boolean, default: false },
        itemsList: { type: Array }, // for add mode
    },
    data() {
        return {
            show: false,
            selectEntities: [],
        }
    },
    computed: {
        computeShowDialog: {
            // get value from props
            get() {
                return this.value
            },
            // set the value to show property in data
            set(value) {
                this.show = value
            },
        },
    },
    watch: {
        value: function(val) {
            if (val) {
                this.$emit('get-all-entities')
            } else {
                this.selectEntities = []
            }
        },
        // always return array
        selectEntities: function(val) {
            if (val) {
                if (this.multiple) return this.$emit('get-selected-entities', val)
                else return this.$emit('get-selected-entities', [val])
            }
        },
    },

    methods: {
        async onSave() {
            await this.handleSave()
            this.onCancel()
        },
    },
}
</script>
