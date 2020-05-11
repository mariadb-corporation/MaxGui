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
                    >
                        <template v-if="editableCell" v-slot:value="props">
                            <fragment
                                v-if="
                                    isServiceOrMonitor &&
                                        (props.data.item.id === 'user' ||
                                            props.data.item.id === 'password')
                                "
                            >
                                <parameter-input
                                    :item="props.data.item"
                                    required
                                    @on-input-change="handleItemChange"
                                />
                            </fragment>
                            <fragment v-else>
                                <parameter-input
                                    :item="props.data.item"
                                    @on-input-change="handleItemChange"
                                />
                            </fragment>
                        </template>
                        <template v-if="editableCell" v-slot:id="props">
                            <b>{{ props.data.item.type }}</b
                            >: {{ props.data.item.id }}
                        </template>
                    </data-table>
                </v-form>
            </template>
        </collapse>
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
                        $tc('changeTheFollowingParameter', changesItems.length > 1 ? 2 : 1, {
                            quantity: changesItems.length,
                        })
                    }}
                </span>

                <p
                    v-for="item in changesItems"
                    :key="item.id"
                    class="d-block mb-1 font-weight-bold"
                >
                    {{ item.id }}
                </p>
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
 * Change Date: 2024-07-01
 *
 * On the date above, in accordance with the Business Source License, use
 * of this software will be governed by version 2 or later of the General
 * Public License.
 */
/* 
This component allows to read parameters and edit parameters
isServiceOrMonitor simply enable required attribute for user and password input fields 
which should be true when creating a service or monitor 
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
        isServiceOrMonitor: { type: Boolean, default: true },
    },
    data() {
        return {
            // parameters
            isValid: false,
            showParameters: true,
            variableValueTableHeaders: [
                { text: 'Variable', value: 'id', width: '65%' },
                {
                    text: 'Value',
                    value: 'value',
                    width: '35%',
                    editableCol: true,
                    cellTruncated: true,
                },
            ],
            loadingEditableParams: false,
            editableCell: false,
            changesItems: [],
            showConfirmDialog: false,
        }
    },
    computed: {
        parametersTableRow: function() {
            const parameters = this.$help.cloneDeep(this.parameters)
            const keepPrimitiveValue = true
            let tableRow = this.$help.objToArrOfObj(parameters, keepPrimitiveValue)
            let editableParams = this.$help.cloneDeep(this.moduleParameters)
            let arr = []

            for (let o = 0; o < tableRow.length; ++o) {
                const resourceParam = tableRow[o]
                let readMode = !this.editableCell
                this.assignParamsTypeInfo(arr, resourceParam, editableParams, readMode)
            }

            return arr
        },
        shouldDisableSaveBtn: function() {
            if (this.changesItems.length > 0 && this.isValid) return false
            else return true
        },
    },
    watch: {
        showConfirmDialog: function(val) {
            if (val && this.editableCell) this.$refs.form.validate()
        },
    },

    methods: {
        assignParamsTypeInfo(arr, resourceParam, editableParams, readMode) {
            const { id: resourceParamName } = resourceParam
            const moduleParam = editableParams.find(param => param.name === resourceParamName)
            const newParam = this.$help.cloneDeep(resourceParam)

            if (moduleParam) {
                const { type, unit, enum_values } = moduleParam
                // assign
                newParam['type'] = type
                if (newParam.type === 'duration' || newParam.type === 'size') {
                    newParam.value = `${newParam.value}${unit}`
                } else if (newParam.type === 'enum' || newParam.type === 'enum_mask') {
                    newParam['enum_values'] = enum_values
                }
                arr.push(newParam)
            } else {
                // if readMode is true, push uneditable params as well
                readMode && arr.push(newParam)
            }
        },

        handleItemChange(newItem, changed) {
            let clone = this.$help.cloneDeep(this.changesItems)

            let targetIndex = clone.findIndex(o => o.id == newItem.id)
            if (changed) {
                // if item is not in the changesItems list
                if (targetIndex === -1) {
                    this.changesItems.push(newItem)
                } else {
                    // if item is already in the array,eg: value of enum_mask param has changed
                    this.changesItems[targetIndex] = newItem
                }
            } else {
                targetIndex > -1 && this.changesItems.splice(targetIndex, 1)
            }
        },

        closeConfirmDialog() {
            this.showConfirmDialog = false
        },

        // this simply put everything back to original state
        cancelEdit() {
            this.editableCell = false
            this.closeConfirmDialog()
            this.changesItems = []
        },

        async acceptEdit() {
            let self = this
            await self.updateResourceParameters({
                id: self.resourceId,
                parameters: self.$help.arrOfObjToObj(self.changesItems),
                callback: self.onEditSucceeded,
            })
            self.cancelEdit()
        },
    },
}
</script>
