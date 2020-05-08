<template>
    <fragment>
        <fragment v-if="objectItem.type === 'bool'">
            <!-- No need rules for v-select as it always has predefined value-->
            <v-select
                :id="objectItem.id"
                v-model="objectItem.value"
                :name="objectItem.id"
                class="std mariadb-select-input error--text__bottom error--text__bottom--no-margin"
                :menu-props="{ contentClass: 'mariadb-select-v-menu' }"
                height="36px"
                :items="[true, false]"
                outlined
                dense
                @change="handleChange"
            />
        </fragment>

        <!-- TODO: enum_mask type to whether allow multiple values-->
        <fragment v-else-if="objectItem.type === 'enum'">
            <!-- No need rules for v-select as it always has predefined value-->
            <v-select
                :id="objectItem.id"
                v-model="objectItem.value"
                :name="objectItem.id"
                class="std mariadb-select-input error--text__bottom error--text__bottom--no-margin"
                :menu-props="{ contentClass: 'mariadb-select-v-menu' }"
                height="36px"
                :items="objectItem.enum_values"
                outlined
                dense
                @change="handleChange"
            />
        </fragment>
        <fragment v-else-if="objectItem.type === 'count'">
            <v-text-field
                :id="objectItem.id"
                v-model.trim.number="objectItem.value"
                type="number"
                min="0"
                :name="objectItem.id"
                class="std error--text__bottom error--text__bottom--no-margin"
                single-line
                outlined
                dense
                :rules="rules.naturalNumber"
                :disabled="objectItem.disabled"
                @change="handleChange"
            />
        </fragment>
        <fragment v-else-if="objectItem.type === 'int'">
            <v-text-field
                :id="objectItem.id"
                v-model.trim.number="objectItem.value"
                type="number"
                :name="objectItem.id"
                class="std error--text__bottom error--text__bottom--no-margin"
                single-line
                outlined
                dense
                :rules="rules.int"
                :disabled="objectItem.disabled"
                @change="handleChange"
            />
        </fragment>
        <fragment v-else-if="objectItem.type === 'password string'">
            <v-text-field
                :id="objectItem.id"
                v-model.trim="objectItem.value"
                :name="objectItem.id"
                class="std error--text__bottom error--text__bottom--no-margin"
                outlined
                dense
                autocomplete="new-password"
                type="password"
                :rules="rules.requiredField"
                :disabled="objectItem.disabled"
                @change="handleChange"
            />
        </fragment>
        <fragment v-else>
            <v-text-field
                :id="objectItem.id"
                v-model.trim="objectItem.value"
                :name="objectItem.id"
                class="std error--text__bottom error--text__bottom--no-margin"
                single-line
                outlined
                dense
                :rules="rules.requiredField"
                :disabled="objectItem.disabled"
                autocomplete="off"
                @change="handleChange"
            />
        </fragment>
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
    name: 'parameter-input',
    props: {
        item: { type: Object, required: true },
        required: { type: Boolean, default: false },
        /* this props need to be added if parameter-input is called to have default value for count and int type
        MaxScale module return the value for count and int as string, so this createMode is true, 
        objectItem.value will be converted to number
        */
        createMode: { type: Boolean, default: false },
    },
    data() {
        return {
            objectItem: {},
            rules: {
                naturalNumber: [val => this.validateNaturalNumber(val)],
                int: [val => this.validateInteger(val)],
                requiredField: [val => this.handleRequiredField(val)],
            },
        }
    },

    async created() {
        this.objectItem = this.$help.cloneDeep(this.item)
    },
    methods: {
        handleChange(val) {
            let self = this
            let changed = !this.$help.isEqual(self.objectItem, self.item)
            let obj = self.objectItem
            /* 
                Handling edge case, either socket or address needs to be defined, 
                that leads to the issue when empty port or empty socket will be treated as string
                This converts it to null

            */
            if (
                (self.objectItem.id === 'port' || self.objectItem.id === 'socket') &&
                self.objectItem.value === ''
            ) {
                obj.value = null
            }

            // compare v-model objectItem with props item
            this.$emit('on-input-change', self.objectItem, changed)
        },
        validateNaturalNumber(val) {
            let value = val
            if (this.createMode) value = parseInt(val, 10)
            if (typeof value === 'string' && this.objectItem.id !== 'port') {
                return `${this.objectItem.id} does not accept non numeric values`
            } else if (value < 0) {
                return `${this.objectItem.id} does not accept negative values`
            }
            return true
        },
        validateInteger(val) {
            let value = val
            if (this.createMode) value = parseInt(val, 10)
            if (typeof value === 'string') {
                return `${this.objectItem.id} does not accept non numeric values`
            } else if (!Number.isInteger(value)) {
                return `${this.objectItem.id} accepts only integer`
            }
            return true
        },
        handleRequiredField(val) {
            if (!val) {
                return this.required ? `${this.objectItem.id} is required` : true
            }
            return true
        },
    },
}
</script>

<style lang="scss" scoped>
.std.v-input.v-text-field.error--text.error--text__bottom--no-margin {
    margin: 14px 0px 6px;
    ::v-deep .v-text-field__details {
        margin: 0px;
    }
}
.std ::v-deep .v-input__control {
    .v-input__slot {
        margin: 0;
    }
}
</style>
