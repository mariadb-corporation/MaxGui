<template>
    <fragment>
        <!-- if targetItem has expanded property, meaning it has child object, so no need to render input -->
        <fragment v-if="'expanded' in targetItem" />
        <!-- Hanlde edge case with log_throttling parameter in maxscale, 
        the value is an object but doesn't contain type information-->

        <v-text-field
            v-else-if="targetItem.nodeParent && targetItem.nodeParent.id === 'log_throttling'"
            :id="`${targetItem.id}-${targetItem.nodeId}` || targetItem.id"
            v-model.trim.number="targetItem.value"
            :name="targetItem.id"
            class="std error--text__bottom error--text__bottom--no-margin"
            single-line
            outlined
            dense
            :rules="rules.number"
            :disabled="targetItem.disabled"
            autocomplete="off"
            @keypress="preventNonNumericalVal($event)"
            @input="handleChange"
        />

        <!-- Handle edge case with port, address, socket custom rules-->

        <v-text-field
            v-else-if="!isListener && targetItem.id === 'address'"
            :id="`${targetItem.id}-${targetItem.nodeId}` || targetItem.id"
            v-model.trim="targetItem.value"
            :name="targetItem.id"
            class="std error--text__bottom error--text__bottom--no-margin"
            single-line
            outlined
            dense
            :rules="rules.requiredAddress"
            :disabled="targetItem.disabled"
            autocomplete="off"
            @input="handleChange"
        />

        <v-text-field
            v-else-if="targetItem.id === 'socket'"
            :id="`${targetItem.id}-${targetItem.nodeId}` || targetItem.id"
            v-model.trim="targetItem.value"
            :name="targetItem.id"
            class="std error--text__bottom error--text__bottom--no-margin"
            single-line
            outlined
            dense
            :rules="rules.requiredFieldEither"
            :disabled="targetItem.disabled"
            autocomplete="off"
            @input="handleChange"
        />

        <v-text-field
            v-else-if="targetItem.id === 'port'"
            :id="`${targetItem.id}-${targetItem.nodeId}` || targetItem.id"
            v-model.trim.number="targetItem.value"
            :name="targetItem.id"
            class="std error--text__bottom error--text__bottom--no-margin"
            single-line
            outlined
            dense
            :rules="rules.requiredFieldEither"
            :disabled="targetItem.disabled"
            autocomplete="off"
            @keypress="preventNonNumericalVal($event)"
            @input="handleChange"
        />

        <!-- bool parameter type -->
        <v-select
            v-else-if="targetItem.type === 'bool'"
            :id="`${targetItem.id}-${targetItem.nodeId}` || targetItem.id"
            v-model="targetItem.value"
            :name="targetItem.id"
            class="std mariadb-select-input error--text__bottom error--text__bottom--no-margin"
            :menu-props="{ contentClass: 'mariadb-select-v-menu', bottom: true, offsetY: true }"
            :items="[true, false]"
            outlined
            dense
            :disabled="targetItem.disabled"
            @change="handleChange"
        />

        <!-- enum_mask parameter type -->
        <v-select
            v-else-if="targetItem.type === 'enum_mask'"
            :id="`${targetItem.id}-${targetItem.nodeId}` || targetItem.id"
            v-model="targetItem.value"
            :name="targetItem.id"
            class="std mariadb-select-input error--text__bottom error--text__bottom--no-margin"
            :menu-props="{ contentClass: 'mariadb-select-v-menu', bottom: true, offsetY: true }"
            :items="targetItem.enum_values"
            outlined
            dense
            multiple
            :disabled="targetItem.disabled"
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
                    (+{{ targetItem.value.length - 1 }} others)
                </span>
            </template>
        </v-select>

        <!-- enum parameter type -->
        <v-select
            v-else-if="targetItem.type === 'enum'"
            :id="`${targetItem.id}-${targetItem.nodeId}` || targetItem.id"
            v-model="targetItem.value"
            :name="targetItem.id"
            class="std mariadb-select-input error--text__bottom error--text__bottom--no-margin"
            :menu-props="{ contentClass: 'mariadb-select-v-menu', bottom: true, offsetY: true }"
            :items="targetItem.enum_values"
            outlined
            dense
            :disabled="targetItem.disabled"
            @change="handleChange"
        />

        <!-- count or int parameter or duration type -->
        <v-text-field
            v-else-if="
                targetItem.type === 'count' ||
                    targetItem.type === 'int' ||
                    targetItem.type === 'duration'
            "
            :id="`${targetItem.id}-${targetItem.nodeId}` || targetItem.id"
            v-model.trim.number="targetItem.value"
            :name="targetItem.id"
            class="std error--text__bottom error--text__bottom--no-margin"
            single-line
            outlined
            dense
            :rules="rules.number"
            :disabled="targetItem.disabled"
            autocomplete="off"
            @keypress="
                targetItem.type === 'int'
                    ? preventNonInteger($event)
                    : preventNonNumericalVal($event)
            "
            @input="handleChange"
        >
            <!-- duration parameter type -->
            <template v-if="targetItem.type === 'duration'" v-slot:append>
                <v-select
                    v-model="chosenDurationSuffix"
                    :name="targetItem.id"
                    class="suffix-select mariadb-select-input"
                    :menu-props="{
                        contentClass: 'mariadb-select-v-menu',
                        bottom: true,
                        offsetY: true,
                    }"
                    :items="durationSuffixes"
                    outlined
                    dense
                />
            </template>
        </v-text-field>

        <!-- password string parameter type -->
        <v-text-field
            v-else-if="targetItem.type === 'password string'"
            :id="`${targetItem.id}-${targetItem.nodeId}` || targetItem.id"
            v-model.trim="targetItem.value"
            :name="targetItem.id"
            class="std error--text__bottom error--text__bottom--no-margin"
            outlined
            dense
            type="password"
            :rules="rules.required"
            autocomplete="off"
            :disabled="targetItem.disabled"
            @input="handleChange"
        />

        <!--others parameter types -->
        <v-text-field
            v-else
            :id="`${targetItem.id}-${targetItem.nodeId}` || targetItem.id"
            v-model.trim="targetItem.value"
            :name="targetItem.id"
            class="std error--text__bottom error--text__bottom--no-margin"
            single-line
            outlined
            dense
            :rules="rules.required"
            :disabled="targetItem.disabled"
            autocomplete="off"
            @input="handleChange"
        />
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

/*
_createMode: In creation mode, it will not trigger parent form validate on first render
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
        isFixedWidth: { type: Boolean, default: false },
    },
    data() {
        return {
            targetItem: {},
            rules: {
                required: [val => this.handleRequired(val)],
                number: [val => this.validateNumber(val)],
                requiredAddress: [val => this.handleRequiredAddress(val)],
                requiredFieldEither: [val => this.handleRequiredFieldEither(val)],
            },
            count: 0,
            durationSuffixes: ['ms', 's', 'm', 'h'],
            chosenDurationSuffix: null,
        }
    },
    watch: {
        'targetItem.value'() {
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
        chosenDurationSuffix: function(newSuffix, oldSuffix) {
            if (oldSuffix) {
                this.targetItem.value = this.suffixSwapper(
                    newSuffix,
                    oldSuffix,
                    this.targetItem.value
                )
            }
        },
    },

    async created() {
        this.targetItem = this.processItem(this.$help.cloneDeep(this.item))
    },

    methods: {
        suffixSwapper(newSuffix, oldSuffix, val) {
            switch (newSuffix) {
                case 'ms':
                    return this.toBaseMiliOrReverse(oldSuffix, val)
                case 's':
                case 'm':
                case 'h': {
                    const reverseBase = true
                    // first convert to miliseconds from oldSuffix
                    const baseMiliSec = this.toBaseMiliOrReverse(oldSuffix, val)
                    // then reverse from baseMiliSec to newSuffix
                    return this.toBaseMiliOrReverse(newSuffix, baseMiliSec, reverseBase)
                }
            }
        },

        /**
         * @param {String} suffix duration suffix: s,m,h,ms
         * @param {Object} val mode be processed. Default is null
         * @param {Boolean} reverse
         * @return {Number} returns converted value
         */
        toBaseMiliOrReverse(suffix, val, reverse) {
            let result
            switch (suffix) {
                case 's':
                    result = reverse ? val / 1000 : val * 1000
                    break
                case 'm':
                    result = reverse ? val / (60 * 1000) : val * 60 * 1000
                    break
                case 'h':
                    result = reverse ? val / (60 * 60 * 1000) : val * 60 * 60 * 1000
                    break
                case 'ms':
                default:
                    result = val
            }
            return Math.ceil(result)
        },

        /**
         * @param {Object} clonedItem cloned item that needs to be processed
         * @param {String} mode mode be processed. Default is null
         * @return {Object} new clonedItem or original clonedItem
         */
        processItem(clonedItem, mode) {
            switch (clonedItem.type) {
                case 'enum_mask':
                    return this.processEnumMask(clonedItem, mode)
                case 'duration': {
                    if (clonedItem.value) {
                        return this.processDuration(clonedItem, mode)
                    } else {
                        //if there is no value, find unit props
                        this.chosenDurationSuffix = clonedItem.unit ? clonedItem.unit : 'ms'
                        return clonedItem
                    }
                }
                default:
                    return clonedItem
            }
        },

        /**
         * @param {Object} item target item to be processed
         * @param {String} mode mode be processed
         * @return {Object} new processed item
         * Processing enum_mask type for editing
         * v-select component accepts array as value type for v-model when multiple props is enabled.
         * But when sending the values back to parent component, it will be converted
         * to a string.
         */
        processEnumMask(item, mode) {
            let result = item
            if (mode === 'reverse') {
                result.value = result.value.toString()
            } else result.value = result.value.split(',') // to array
            return result
        },

        /**
         * @param {Object} item target item to be processed
         * @param {String} mode mode be processed
         * @return {Object} new processed item
         */
        processDuration(item, mode) {
            let result = item
            if (mode === 'reverse') {
                result.value = `${result.value}${this.chosenDurationSuffix}`
            } else {
                let suffix = null
                let indexOfSuffix = null
                // get suffix from result.value string
                for (let i = 0; i < this.durationSuffixes.length; ++i) {
                    if (result.value.includes(this.durationSuffixes[i])) {
                        suffix = this.durationSuffixes[i]
                        indexOfSuffix = result.value.indexOf(suffix)
                        break
                    }
                }

                if (suffix) {
                    this.chosenDurationSuffix = suffix
                    result.value = result.value.slice(0, indexOfSuffix)
                }
            }
            return result
        },

        // ----------------------------------------------  Handle input change ---------------------------------------
        handleChange() {
            const self = this
            /*reverse processing item to original type*/
            let targetItemCloned = this.processItem(
                this.$help.cloneDeep(self.targetItem),
                'reverse'
            )
            const changed = !this.$help.isEqual(targetItemCloned, self.item)
            /*
                _Handling edge case, either socket or port needs to be defined,
                that leads to the issue when empty port or empty socket will be
                treated as string. But maxscale wants it null if it is empty.
                _Some parameter types such as count or int, when value is empty, it should be also converted to null.
            */
            if (targetItemCloned.value === '') {
                // socket is type string
                const types = ['count', 'int']
                targetItemCloned.id === 'socket' ||
                    (types.includes(targetItemCloned.type) && (targetItemCloned.value = null))
            }

            this.$emit('on-input-change', targetItemCloned, changed)
        },

        // ---------------------------------------------------- input validation ---------------------------------------
        validateNumber(val) {
            const isEmptyVal = this.isEmpty(val)

            const intType = this.targetItem.type === 'int'
            const naturalType =
                this.targetItem.type === 'count' || this.targetItem.type === 'duration'

            const isValidInt = /^[-]?\d*$/g.test(val)
            const isValidNaturalNum = /^\d*$/g.test(val)

            if (this.required && isEmptyVal) {
                return this.$t('errors.requiredInput', { inputName: this.targetItem.id })
            } else if ((intType && !isValidInt) || val === '-') {
                return this.$t('errors.nonInteger')
            } else if (naturalType && !isValidNaturalNum) {
                return this.$t('errors.negativeNum')
            }
            return true
        },

        handleRequired(val) {
            if (this.isEmpty(val) && this.required) {
                return this.$t('errors.requiredInput', { inputName: this.targetItem.id })
            }
            return true
        },

        // port or socket
        handleRequiredFieldEither(val) {
            const portExist = !this.isEmpty(this.portValue)
            const socketExist = !this.isEmpty(this.socketValue)

            const bothEmpty =
                (this.targetItem.id === 'port' && !val && !this.socketValue) ||
                (this.targetItem.id === 'socket' && !val && !this.portValue)

            const bothValueExist = portExist && socketExist

            if (bothEmpty || bothValueExist) {
                return this.$t('errors.portSocket')
            } else return true
        },

        // address rules if !isListener
        handleRequiredAddress(val) {
            const portExist = !this.isEmpty(this.portValue)
            const socketExist = !this.isEmpty(this.socketValue)
            const bothExist = socketExist && portExist

            const isEmptyVal = this.isEmpty(val)

            if (isEmptyVal && portExist) {
                return this.$t('errors.addressRequired')
            } else if (!isEmptyVal && socketExist && !bothExist) {
                return this.$t('errors.addressRequiredEmpty')
            }
            return true
        },

        // ---------------------------------------------------- helpers ---------------------------------------
        // allow to enter minus or hyphen minus and numbers
        preventNonInteger(e) {
            const key = e.key
            !key.match(/^[-]?\d*$/g) && e.preventDefault()
        },
        // allow to enter only number
        preventNonNumericalVal(e) {
            const key = e.key
            !key.match(/^\d*$/g) && e.preventDefault()
        },
        isEmpty: val => val === '' || val === null,
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
    min-width: 160px;
    .v-input__slot {
        margin: 0;
    }
}
.std ::v-deep .v-messages__message {
    white-space: normal;
    line-height: 16px;
}
.suffix-select ::v-deep .v-select__selections input,
.std ::v-deep .v-select__selections input {
    display: none;
}
.suffix-select {
    border-radius: 0px;
    ::v-deep .v-input__control {
        min-width: 60px;
        margin-top: -8px;
        margin-right: -10px;
        .v-input__slot {
            padding: 0 0px 0 9px !important;
            .v-select__slot {
                .v-select__selection.v-select__selection--comma {
                    text-align: center;
                    width: 100%;
                }
            }

            .v-input__append-inner {
                padding-left: 0px !important;
            }
        }
        fieldset {
            border-right: none;
            border-top: none;
            border-bottom: none;
        }
    }
}
</style>
