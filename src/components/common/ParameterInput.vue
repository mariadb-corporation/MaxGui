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
                :items="[true, false]"
                outlined
                dense
                @change="handleChange"
            />
        </fragment>

        <fragment v-else-if="objectItem.type === 'enum_mask'">
            <!-- No need rules for v-select as it always has predefined value-->

            <v-select
                :id="objectItem.id"
                v-model="objectItem.value"
                :name="objectItem.id"
                class="std mariadb-select-input error--text__bottom error--text__bottom--no-margin"
                :menu-props="{ contentClass: 'mariadb-select-v-menu' }"
                :items="objectItem.enum_values"
                outlined
                dense
                multiple
                @change="handleChange"
            >
                <template v-slot:selection="{ item, index }">
                    <span v-if="index === 0" class="v-select__selection v-select__selection--comma">
                        {{ item }}
                    </span>
                    <span v-if="index === 1" class="ml-1 color caption text-field-text ">
                        (+{{ objectItem.value.length - 1 }} others)
                    </span>
                </template>
            </v-select>
        </fragment>
        <fragment v-else-if="objectItem.type === 'enum'">
            <!-- No need rules for v-select as it always has predefined value-->
            <v-select
                :id="objectItem.id"
                v-model="objectItem.value"
                :name="objectItem.id"
                class="std mariadb-select-input error--text__bottom error--text__bottom--no-margin"
                :menu-props="{ contentClass: 'mariadb-select-v-menu' }"
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
        this.objectItem = this.convertEnumMaskStringtoArray()
    },
    methods: {
        /*
        Workaround enum_mask type, when multiple props is enabled,
        v-select component accepts array as value type for v-model
        But when sending the values back to parent component, it will be converted
        to a string.
        */
        convertEnumMaskStringtoArray() {
            let cloned = this.$help.cloneDeep(this.item)
            if (this.item.type === 'enum_mask') {
                cloned.value = cloned.value.split(',') // convert string to array
            }
            return cloned
        },
        handleChange() {
            let self = this
            let item = self.convertEnumMaskStringtoArray()
            let newObj = self.objectItem
            let changed = !self.$help.isEqual(newObj, item)

            /* 
                Handling edge case, either socket or address needs to be defined, 
                that leads to the issue when empty port or empty socket will be treated as string
                This converts it to null

            */
            if ((newObj.id === 'port' || newObj.id === 'socket') && newObj.value === '') {
                newObj.value = null
            }
            let cloned = self.$help.cloneDeep(newObj)
            if (this.item.type === 'enum_mask') {
                cloned.value = cloned.value.toString()
            }
            this.$emit('on-input-change', cloned, changed)
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
