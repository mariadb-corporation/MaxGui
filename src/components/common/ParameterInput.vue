<template>
    <span>
        <!-- if objectItem has expanded property, meaning it has child object, so no need to render input -->
        <fragment v-if="'expanded' in objectItem" />
        <!-- Hanlde edge case with log_throttling parameter in maxscale, 
        the value is an object but doesn't contain type information-->
        <fragment
            v-else-if="objectItem.nodeParent && objectItem.nodeParent.id === 'log_throttling'"
        >
            <v-text-field
                :id="`${objectItem.id}-${objectItem.nodeId}` || objectItem.id"
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
                @input="handleChange"
            />
        </fragment>
        <!-- Hanlde edge case with port, address, socket custom rules-->
        <fragment v-else-if="!isListener && objectItem.id === 'address'">
            <v-text-field
                :id="`${objectItem.id}-${objectItem.nodeId}` || objectItem.id"
                v-model.trim="objectItem.value"
                :name="objectItem.id"
                class="std error--text__bottom error--text__bottom--no-margin"
                single-line
                outlined
                dense
                :rules="rules.requiredAddress"
                :disabled="objectItem.disabled"
                autocomplete="off"
                @input="handleChange"
            />
        </fragment>
        <fragment v-else-if="objectItem.id === 'socket'">
            <v-text-field
                :id="`${objectItem.id}-${objectItem.nodeId}` || objectItem.id"
                v-model.trim="objectItem.value"
                :name="objectItem.id"
                class="std error--text__bottom error--text__bottom--no-margin"
                single-line
                outlined
                dense
                :rules="rules.requiredFieldEither"
                :disabled="objectItem.disabled"
                autocomplete="off"
                @input="handleChange"
            />
        </fragment>
        <fragment v-else-if="objectItem.id === 'port'">
            <v-text-field
                :id="`${objectItem.id}-${objectItem.nodeId}` || objectItem.id"
                v-model.trim.number="objectItem.value"
                type="number"
                min="0"
                :name="objectItem.id"
                class="std error--text__bottom error--text__bottom--no-margin"
                single-line
                outlined
                dense
                :rules="rules.requiredFieldEither"
                :disabled="objectItem.disabled"
                @input="handleChange"
            />
        </fragment>
        <!---------------------------------------------others parameter types ----------------------------------------->
        <fragment v-else-if="objectItem.type === 'bool'">
            <v-select
                :id="`${objectItem.id}-${objectItem.nodeId}` || objectItem.id"
                v-model="objectItem.value"
                :name="objectItem.id"
                class="std mariadb-select-input error--text__bottom error--text__bottom--no-margin"
                :menu-props="{ contentClass: 'mariadb-select-v-menu' }"
                :items="[true, false]"
                outlined
                dense
                :disabled="objectItem.disabled"
                @change="handleChange"
            />
        </fragment>
        <fragment v-else-if="objectItem.type === 'enum_mask'">
            <v-select
                :id="`${objectItem.id}-${objectItem.nodeId}` || objectItem.id"
                v-model="objectItem.value"
                :name="objectItem.id"
                class="std mariadb-select-input error--text__bottom error--text__bottom--no-margin"
                :menu-props="{ contentClass: 'mariadb-select-v-menu' }"
                :items="objectItem.enum_values"
                outlined
                dense
                multiple
                :disabled="objectItem.disabled"
                @change="handleChange"
            >
                <template v-slot:selection="{ item, index }">
                    <span v-if="index === 0" class="v-select__selection v-select__selection--comma">
                        {{ item }}
                    </span>
                    <span
                        v-if="index === 1"
                        class="v-select__selection v-select__selection--comma color caption text-field-text "
                    >
                        (+{{ objectItem.value.length - 1 }} others)
                    </span>
                </template>
            </v-select>
        </fragment>
        <fragment v-else-if="objectItem.type === 'enum'">
            <v-select
                :id="`${objectItem.id}-${objectItem.nodeId}` || objectItem.id"
                v-model="objectItem.value"
                :name="objectItem.id"
                class="std mariadb-select-input error--text__bottom error--text__bottom--no-margin"
                :menu-props="{ contentClass: 'mariadb-select-v-menu' }"
                :items="objectItem.enum_values"
                outlined
                dense
                :disabled="objectItem.disabled"
                @change="handleChange"
            />
        </fragment>
        <fragment v-else-if="objectItem.type === 'count'">
            <v-text-field
                :id="`${objectItem.id}-${objectItem.nodeId}` || objectItem.id"
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
                @input="handleChange"
            />
        </fragment>
        <fragment v-else-if="objectItem.type === 'int'">
            <v-text-field
                :id="`${objectItem.id}-${objectItem.nodeId}` || objectItem.id"
                v-model.trim.number="objectItem.value"
                type="number"
                :name="objectItem.id"
                class="std error--text__bottom error--text__bottom--no-margin"
                single-line
                outlined
                dense
                :rules="rules.int"
                :disabled="objectItem.disabled"
                @input="handleChange"
            />
        </fragment>
        <fragment v-else-if="objectItem.type === 'password string'">
            <v-text-field
                :id="`${objectItem.id}-${objectItem.nodeId}` || objectItem.id"
                v-model.trim="objectItem.value"
                :name="objectItem.id"
                class="std error--text__bottom error--text__bottom--no-margin"
                outlined
                dense
                autocomplete="new-password"
                type="password"
                :rules="rules.requiredField"
                :disabled="objectItem.disabled"
                @input="handleChange"
            />
        </fragment>
        <fragment v-else>
            <v-text-field
                :id="`${objectItem.id}-${objectItem.nodeId}` || objectItem.id"
                v-model.trim="objectItem.value"
                :name="objectItem.id"
                class="std error--text__bottom error--text__bottom--no-margin"
                single-line
                outlined
                dense
                :rules="rules.requiredField"
                :disabled="objectItem.disabled"
                autocomplete="off"
                @input="handleChange"
            />
        </fragment>
    </span>
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

/* 
_createMode: In creation mode, the value for parameter are received from maxscale modules but the value for 
count and int returned as string. So, objectItem.value will be converted to number if createMode is true
_portValue,_socketValue,_addressValue and _parentForm is passed if target resource is being 
created or updated. If target resource is listener, _addressValue will be null. 
_isListener: accepts boolean , if true, address won't be required
*/
export default {
    name: 'parameter-input',
    props: {
        item: { type: Object, required: true },
        required: { type: Boolean, default: false },
        createMode: { type: Boolean, default: false },
        portValue: { type: Number },
        socketValue: { type: String },
        addressValue: { type: String },
        parentForm: { type: Object },
        isListener: { type: Boolean, default: false },
    },
    data() {
        return {
            objectItem: {},
            rules: {
                naturalNumber: [val => this.validateNaturalNumber(val)],
                int: [val => this.validateInteger(val)],
                requiredField: [val => this.handleRequiredField(val)],
                requiredAddress: [val => this.handleRequiredAddress(val)],
                requiredFieldEither: [val => this.handleRequiredFieldEither(val)],
            },
            count: 0,
            uniqueKey: 'input-',
        }
    },
    watch: {
        'objectItem.value'() {
            this.$nextTick(() => {
                // createMode should not trigger parent form validate on first render
                if (this.createMode) {
                    this.parentForm && this.count !== 0 && this.parentForm.validate()

                    this.count === 0 && (this.count = this.count + 1)
                } else {
                    this.parentForm && this.parentForm.validate()
                }
            })
        },
        item: {
            deep: true,
            handler(val) {
                this.objectItem = this.convertEnumMaskStringtoArray(val)
            },
        },
    },
    async created() {
        this.objectItem = this.convertEnumMaskStringtoArray(this.item)
    },
    methods: {
        /*
        Workaround enum_mask type, when multiple props is enabled,
        v-select component accepts array as value type for v-model
        But when sending the values back to parent component, it will be converted
        to a string.
        */
        convertEnumMaskStringtoArray(obj) {
            let cloned = this.$help.cloneDeep(obj)
            if (obj.type === 'enum_mask') {
                cloned.value = cloned.value.split(',') // convert string to array
            }
            return cloned
        },

        handleChange() {
            let self = this
            let item = self.convertEnumMaskStringtoArray(this.item)
            let newObj = self.objectItem

            let changed = !self.$help.isEqual(newObj, item)
            let inputObj = self.$help.cloneDeep(newObj)

            /*
                Handling edge case, either socket or port needs to be defined,
                that leads to the issue when empty port or empty socket will be treated as string
                This converts it to null

            */
            if ((inputObj.id === 'port' || inputObj.id === 'socket') && inputObj.value === '') {
                inputObj.value = null
            }

            if (this.item.type === 'enum_mask') {
                inputObj.value = inputObj.value.toString()
            }

            this.$emit('on-input-change', inputObj, changed)
        },
        // ---------------------------------------------------- input validation ---------------------------------------
        // port or socket
        handleRequiredFieldEither(val) {
            let portExist = this.portValue !== '' && this.portValue !== null
            let socketExist = !!this.socketValue

            let bothEmpty =
                (this.objectItem.id === 'port' && !val && !this.socketValue) ||
                (this.objectItem.id === 'socket' && !val && !this.portValue)

            let bothValueExist = portExist && socketExist

            if (bothEmpty || bothValueExist) {
                return `Either port or socket need to be defined`
            } else return true
        },

        // address rules if !isListener
        handleRequiredAddress(val) {
            let portExist = this.portValue !== '' && this.portValue !== null
            let socketExist = !!this.socketValue
            let bothExist = socketExist && portExist
            if (!val && portExist) {
                return `${this.objectItem.id} is required when using port`
            } else if (val && socketExist && !bothExist) {
                return `${this.objectItem.id} should be defined only when using port`
            }
            return true
        },

        validateNaturalNumber(val) {
            if (this.required && !val) {
                return `${this.objectItem.id} is required`
            } else if (typeof value === 'string') {
                return `${this.objectItem.id} does not accept non numeric values`
            } else if (val < 0) {
                return `${this.objectItem.id} does not accept negative values`
            }
            return true
        },

        validateInteger(val) {
            let value = val
            this.createMode && (value = parseInt(val, 10))
            if (this.required && !val) {
                return `${this.objectItem.id} is required`
            } else if (typeof value === 'string') {
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
