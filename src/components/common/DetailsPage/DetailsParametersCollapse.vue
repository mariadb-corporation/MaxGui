<template>
    <fragment>
        <collapse
            :toggleOnClick="() => (showParameters = !showParameters)"
            :toggleVal="showParameters"
            :title="`${$tc('parameters', 2)}`"
            :editing="editableCell"
            :onEdit="() => (editableCell = true)"
            :doneEditing="() => (showConfirmDialog = true)"
        >
            <template v-slot:content>
                <v-form ref="form" v-model="isValid">
                    <data-table
                        :headers="variableValueTableHeaders"
                        :data="parametersTableRow"
                        tdBorderLeft
                        showAll
                        :editableCell="editableCell"
                        :search="searchKeyWord"
                        :loading="loading"
                        keepPrimitiveValue
                        :isTree="isTree"
                        @cell-mouseenter="showCellTooltip"
                    >
                        <template v-slot:header-append-id>
                            <span class="ml-1 color text-field-text">
                                ({{ parametersTableRow.length }})
                            </span>
                        </template>

                        <template v-if="editableCell" v-slot:value="{ data: { item } }">
                            <!-- render if usePortOrSocket  -->
                            <parameter-input
                                v-if="handleShowSpecialInputs(item.id)"
                                :parentForm="$refs.form"
                                :item="item"
                                :portValue="portValue"
                                :socketValue="socketValue"
                                :addressValue="addressValue"
                                @on-input-change="handleItemChange"
                            />
                            <parameter-input
                                v-else-if="requiredParams.includes(item.id)"
                                :item="item"
                                required
                                @on-input-change="handleItemChange"
                            />
                            <parameter-input
                                v-else
                                :item="item"
                                @on-input-change="handleItemChange"
                            />
                        </template>
                        <template v-slot:id="{ data: { item } }">
                            <span
                                v-if="
                                    'type' in item ||
                                        'description' in item ||
                                        'unit' in item ||
                                        'default_value' in item
                                "
                                :id="`param-${item.id}_${componentId}`"
                                class="pointer"
                            >
                                {{ item.id }}
                            </span>
                            <span v-else>
                                {{ item.id }}
                            </span>
                        </template>
                    </data-table>
                </v-form>
            </template>
        </collapse>
        <v-tooltip
            v-if="parameterTooltip.item"
            right
            transition="slide-x-transition"
            content-class="shadow-drop color text-navigation"
            :activator="`#param-${parameterTooltip.item.id}_${componentId}`"
            max-width="300"
        >
            <v-sheet style="border-radius: 10px;overflow:auto;" class="pa-4" max-width="300">
                <fragment v-for="(value, name) in parameterTooltip.item" :key="name">
                    <span v-if="name !== 'id'" class="d-block body-2">
                        <span class="mr-1 font-weight-medium text-capitalize">
                            {{ $t(name) }}:
                        </span>
                        <span> {{ value }}</span>
                    </span>
                </fragment>
            </v-sheet>
        </v-tooltip>
        <base-dialog
            v-model="showConfirmDialog"
            :onCancel="cancelEdit"
            :onClose="closeConfirmDialog"
            :onSave="acceptEdit"
            :title="`${$t('implementChanges')}`"
            saveText="thatsRight"
            :disabledSaveBtn="shouldDisableSaveBtn"
        >
            <template v-slot:body>
                <span class="d-block mb-4">
                    {{
                        $tc(
                            'changeTheFollowingParameter',
                            changedParametersArr.length > 1 ? 2 : 1,
                            {
                                quantity: changedParametersArr.length,
                            }
                        )
                    }}
                </span>

                <div
                    v-for="(item, i) in changedParametersArr"
                    :key="i"
                    class="d-block"
                    :class="[item.nodeParent !== null && changedParamsInfo(i, item) && 'mt-2']"
                >
                    <div v-if="item.nodeParent !== null">
                        <div class="font-weight-bold">
                            {{ changedParamsInfo(i, item) }}
                        </div>
                        <p class="d-block mb-1">{{ item.id }}: {{ item.value }}</p>
                    </div>
                    <p v-else class="d-block mt-2 ">
                        <span class="font-weight-bold">{{ item.id }}:</span
                        ><span> {{ item.value }}</span>
                    </p>
                </div>
            </template>
        </base-dialog>
    </fragment>
</template>

<script>
/*
 * Copyright (c) 2020 MariaDB Corporation Ab
 *
 * Use of this software is governed by the Business Source License included
 * in the LICENSE.TXT file and at www.mariadb.com/bsl11.
 *
 * Change Date: 2024-06-15
 *
 * On the date above, in accordance with the Business Source License, use
 * of this software will be governed by version 2 or later of the General
 * Public License.
 */

/*
This component allows to read parameters and edit parameters. It means to be used for details page

PROPS:
_requiredParams: accepts array of string , it simply enables required attribute in parameter-input dynamically
_usePortOrSocket: accepts boolean , if true, get portValue, addressValue, and socketValue to pass to parameter-input for
handling special input field when editting server or listener. If editing listener, addressValue will be null
 */
export default {
    name: 'details-parameters-collapse',
    props: {
        searchKeyWord: { type: String, required: true },
        resourceId: { type: String, required: true },
        parameters: { type: Object, required: true },
        moduleParameters: { type: Array, required: true },
        updateResourceParameters: { type: Function, required: true },
        onEditSucceeded: { type: Function, required: true },
        loading: { type: Boolean, required: true },
        // specical props to manipulate required or dependent input attribute
        usePortOrSocket: { type: Boolean, default: false },
        requiredParams: { type: Array, default: () => [] },
        isTree: { type: Boolean, default: false },
    },
    data() {
        return {
            // parameters
            isValid: false,
            showParameters: true,
            variableValueTableHeaders: [
                { text: 'Variable', value: 'id', width: '55%' },
                {
                    text: 'Value',
                    value: 'value',
                    width: '45%',
                    editableCol: true,
                    cellTruncated: true,
                },
            ],
            loadingEditableParams: false,
            editableCell: false,
            changedParametersArr: [],
            showConfirmDialog: false,

            addressValue: null,
            portValue: null,
            socketValue: null,

            parameterTooltip: {
                item: null,
            },
            // this is needed when using custom activator in v-tooltip.
            componentId: this.$help.lodash.uniqueId('component_tooltip_'),
        }
    },
    computed: {
        parametersTableRow: function() {
            const parameters = this.$help.lodash.cloneDeep(this.parameters)
            const keepPrimitiveValue = true
            let level = 0
            let tableRow = this.$help.objToArrOfObj(parameters, keepPrimitiveValue, level)

            let moduleParameters = this.$help.lodash.cloneDeep(this.moduleParameters)

            let arr = []

            for (let o = 0; o < tableRow.length; ++o) {
                const resourceParam = tableRow[o]
                this.assignParamsTypeInfo(arr, resourceParam, moduleParameters)
            }
            return arr
        },

        shouldDisableSaveBtn: function() {
            if (this.changedParametersArr.length > 0 && this.isValid) return false
            else return true
        },
    },
    watch: {
        showConfirmDialog: function(val) {
            if (val && this.editableCell) this.$refs.form.validate()
        },
    },

    methods: {
        /**
         * This function assign item info to parameterTooltip which will be read
         * by v-tooltip component to show parameter info
         */
        showCellTooltip({ e, item }) {
            if (e.type === 'mouseenter') {
                const { id, type, description, unit, default_value } = item
                this.parameterTooltip = {
                    item: {
                        id,
                        type,
                        description,
                        unit,
                        default_value,
                    },
                }
            } else
                this.parameterTooltip = {
                    item: null,
                }
        },

        changedParamsInfo(i, item) {
            const arr = this.changedParametersArr
            const { nodeParent: { id = null } = null } = item
            if (i > 0) {
                const prevNodeParent = arr[i - 1].nodeParent || null
                const prevNodeParentId = prevNodeParent && prevNodeParent.id
                if (prevNodeParentId !== id) return id
            } else if (i === 0) {
                return id
            } else return ''
        },
        /**
         * @param {String} id id of parameter
         * @return {Boolean} true if usePortOrSocket is true and id matches requirements
         */
        handleShowSpecialInputs(id) {
            return this.usePortOrSocket && (id === 'port' || id === 'socket' || id === 'address')
        },

        /**
         * @param {Array} arr Array to be pushed to.
         * @param {Object} resourceParam table object {id:'', value:''}
         * @param {Array} moduleParameters Module parameters object {id:'', value:'', type:'', unit:'',...}
         */
        assignParamsTypeInfo(arr, resourceParam, moduleParameters) {
            const { id: resourceParamId, value: resourceParamValue } = resourceParam
            const moduleParam = moduleParameters.find(param => param.name === resourceParamId)

            const newParam = this.$help.lodash.cloneDeep(resourceParam)

            if (moduleParam) {
                const { type, description, default_value, unit, enum_values } = moduleParam

                // assign
                type !== undefined && (newParam.type = type)
                description !== undefined && (newParam.description = description)
                unit !== undefined && (newParam.unit = unit)
                default_value !== undefined && (newParam.default_value = default_value)

                const hasModifiable = 'modifiable' in moduleParam
                if (hasModifiable && !moduleParam.modifiable) {
                    newParam['disabled'] = true
                } else if (!hasModifiable) newParam['disabled'] = false

                if (newParam.type === 'duration' && unit) {
                    newParam.value = `${newParam.value}${unit}`
                } else if (newParam.type === 'enum' || newParam.type === 'enum_mask') {
                    newParam['enum_values'] = enum_values
                }
            } else {
                newParam['disabled'] = true
            }

            arr.push(newParam)

            this.assignPortSocketDependencyValues(resourceParamId, resourceParamValue)
        },

        /**
         * @param {Object} newItem Object item received from parameter-input {id:'', value:"", type:""}
         * @param {Boolean} changed Detect whether the input has been modified
         * @return push or re-assign or splice newItem to changedParametersArr which be rendered in showConfirmDialog
         * Also assigining value to component's data: portValue, socketValue, addressValue for
         * validation in parameter-input
         */
        handleItemChange(newItem, changed) {
            let clone = this.$help.lodash.cloneDeep(this.changedParametersArr)

            let targetIndex = clone.findIndex(o => {
                return newItem.nodeId !== undefined
                    ? o.nodeId == newItem.nodeId
                    : o.id === newItem.id
            })

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

        closeConfirmDialog() {
            this.showConfirmDialog = false
        },

        // this simply put everything back to original state
        cancelEdit() {
            this.editableCell = false
            this.closeConfirmDialog()
            this.changedParametersArr = []
        },

        async acceptEdit() {
            let self = this
            await self.updateResourceParameters({
                id: self.resourceId,
                parameters: self.$help.arrOfObjToObj(self.changedParametersArr),
                callback: self.onEditSucceeded,
            })
            self.cancelEdit()
        },
    },
}
</script>
