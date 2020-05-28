<template>
    <collapse
        wrapperClass="mt-4 d-inline-flex flex-column"
        titleWrapperClass="mx-n9"
        :toggleOnClick="() => (showParameters = !showParameters)"
        :toggleVal="showParameters"
        :title="`${$tc('parameters', 2)}`"
    >
        <template v-slot:content>
            <data-table
                :headers="variableValueTableHeaders"
                :data="parametersTableRow"
                showAll
                editableCell
                keepPrimitiveValue
            >
                <template v-slot:append-id>
                    <span class="ml-1 color text-field-text">
                        ({{ parametersTableRow.length }})
                    </span>
                </template>
                <template v-slot:value="{ data: { item } }">
                    <!-- rendered if usePortOrSocket is true-->
                    <fragment v-if="handleShowSpecialInputs(item.id)">
                        <parameter-input
                            :parentForm="parentForm"
                            :item="item"
                            :portValue="portValue"
                            :socketValue="socketValue"
                            :addressValue="addressValue"
                            :isListener="isListener"
                            isFixedWidth
                            createMode
                            @on-input-change="handleItemChange"
                        />
                    </fragment>

                    <fragment v-else-if="requiredParams.includes(item.id)">
                        <parameter-input
                            :item="item"
                            required
                            createMode
                            isFixedWidth
                            @on-input-change="handleItemChange"
                        />
                    </fragment>
                    <fragment v-else>
                        <parameter-input
                            :item="item"
                            createMode
                            isFixedWidth
                            @on-input-change="handleItemChange"
                        />
                    </fragment>
                </template>
                <template v-slot:id="{ data: { item } }">
                    <v-tooltip
                        v-if="
                            'type' in item ||
                                'description' in item ||
                                'unit' in item ||
                                'default_value' in item
                        "
                        right
                        transition="slide-x-transition"
                        content-class="shadow-drop color text-navigation"
                    >
                        <template v-slot:activator="{ on }">
                            <span class="pointer" v-on="on">
                                {{ item.id }}
                            </span>
                        </template>
                        <v-sheet style="border-radius: 10px;" class="pa-4" max-width="300">
                            <fragment v-for="(value, name) in item" :key="name">
                                <span v-if="parameterInfo.includes(name)" class="d-block body-2">
                                    <span class="mr-1 font-weight-medium text-capitalize">
                                        {{ $t(name) }}:
                                    </span>
                                    <span> {{ value }}</span>
                                </span>
                            </fragment>
                        </v-sheet>
                    </v-tooltip>
                    <span v-else>
                        {{ item.id }}
                    </span>
                </template>
            </data-table>
        </template>
    </collapse>
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
This component allows to edit parameters taken from parameters array that must have similar format to
module parameters. All default_values will be returned as string regardless of type
The component is meant to be used for creating resource

PROPS:
_requiredParams: accepts array of string , it simply enables required attribute in parameter-input dynamically
_usePortOrSocket: accepts boolean , if true, get portValue, addressValue, and socketValue to pass to parameter-input for
handling special input field when editting server or listener. If editing listener, addressValue will be null
_isListener: accepts boolean , if true, address won't be required
*/
export default {
    name: 'parameters-collapse',
    props: {
        parameters: { type: Array, required: true },
        // specical props to manipulate required or dependent input attribute
        usePortOrSocket: { type: Boolean, default: false },
        requiredParams: { type: Array, default: () => [] },
        parentForm: { type: Object },
        isListener: { type: Boolean, default: false },
    },
    data: function() {
        return {
            // nested form
            isValid: false,
            // Parameters table section
            showParameters: true,
            variableValueTableHeaders: [
                { text: 'Variable', value: 'id', width: '1px' },
                { text: 'Value', value: 'value', width: '1px', editableCol: true },
            ],
            // parameters input
            changedParametersArr: [],
            //
            portValue: null,
            socketValue: null,
            // info will be shown in tooltip
            parameterInfo: ['type', 'description', 'unit', 'default_value'],
        }
    },
    computed: {
        parametersTableRow: function() {
            const self = this
            let parameters = self.parameters
            let arr = []
            for (let i = 0; i < parameters.length; ++i) {
                let paramObj = self.$help.cloneDeep(parameters[i])
                let defaultValue
                switch (paramObj.type) {
                    case 'bool':
                        defaultValue = paramObj.default_value === 'true'
                        break
                    default:
                        defaultValue = paramObj.default_value || null
                }

                paramObj['value'] = defaultValue
                paramObj['id'] = paramObj.name
                delete paramObj.name
                arr.push(paramObj)
                this.assignPortSocketDependencyValues(paramObj.id, paramObj.value)
            }
            return arr
        },
    },

    methods: {
        /**
         * @param {String} id id of parameter
         * @return {Boolean} true if usePortOrSocket is true and id matches requirements
         */
        handleShowSpecialInputs(id) {
            return this.usePortOrSocket && (id === 'port' || id === 'socket' || id === 'address')
        },

        /**
         * @param {Object} newItem Object item received from parameter-input {id:'', value:"", type:""}
         * @param {Boolean} changed Detect whether the input has been modified
         * @return push or re-assign or splice newItem to changedParametersArr which be rendered in showConfirmDialog
         * Also assigining value to component's data: portValue, socketValue, addressValue for
         * validation in parameter-input
         */
        handleItemChange(newItem, changed) {
            let clone = this.$help.cloneDeep(this.changedParametersArr)

            let targetIndex = clone.findIndex(o => o.id == newItem.id)
            if (changed) {
                // if item is not in the changedParametersArr list
                if (targetIndex === -1) {
                    this.changedParametersArr.push(newItem)
                } else {
                    // if item is already in the array,eg: value of enum_mask param has changed
                    this.changedParametersArr[targetIndex] = newItem
                }
            } else {
                targetIndex > -1 && this.changedParametersArr.splice(targetIndex, 1)
            }

            this.assignPortSocketDependencyValues(newItem.id, newItem.value)
        },

        /**
         * @param {String} resourceParamId Name of the parameter
         * @param {String} resourceParamValue Value of the parameter
         * @return assigining value to component's data: portValue, socketValue, addressValue
         */
        assignPortSocketDependencyValues(resourceParamId, resourceParamValue) {
            if (this.usePortOrSocket) {
                switch (resourceParamId) {
                    case 'port':
                        this.portValue = resourceParamValue
                        break
                    case 'socket':
                        this.socketValue = resourceParamValue
                        break
                    case 'address':
                        this.addressValue = resourceParamValue
                        break
                }
            }
        },

        getParameterObj() {
            return this.$help.arrOfObjToObj(this.changedParametersArr)
        },
    },
}
</script>
