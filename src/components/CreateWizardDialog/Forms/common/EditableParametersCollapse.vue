<template>
    <collapse
        wrapperClass="mt-4"
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
                <template v-slot:value="props">
                    <fragment
                        v-if="
                            isServiceOrMonitor &&
                                (props.data.item.id === 'user' || props.data.item.id === 'password')
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
                            createMode
                            @on-input-change="handleItemChange"
                        />
                    </fragment>
                </template>
                <template v-slot:id="props">
                    <b>{{ props.data.item.type }}</b>
                    : {{ props.data.item.id }}
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
isServiceOrMonitor simply enable required attribute for user and password input fields 
which should be true when creating a service or monitor
The parameters array accepts array that has similar format to module parameters
*/
export default {
    name: 'editable-parameters-collapse',
    props: {
        parameters: { type: Array, required: true },
        isServiceOrMonitor: { type: Boolean, default: true },
    },
    data: function() {
        return {
            // Parameters table section
            showParameters: true,
            variableValueTableHeaders: [
                { text: 'Variable', value: 'id', width: '1px' },
                { text: 'Value', value: 'value', width: '1px', editableCol: true },
            ],
            // parameters input
            changedParametersArr: [],
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
                delete paramObj.default_value
                paramObj['id'] = paramObj.name
                delete paramObj.name
                arr.push(paramObj)
            }

            return arr
        },
    },

    methods: {
        handleItemChange(newItem, changed) {
            let clone = this.$help.cloneDeep(this.changedParametersArr)
            let targetIndex = clone.findIndex(o => o.id == newItem.id)
            if (changed) {
                targetIndex === -1 && this.changedParametersArr.push(newItem)
            } else {
                targetIndex > -1 && this.changedParametersArr.splice(targetIndex, 1)
            }
        },
        getParameterObj() {
            return this.$help.arrOfObjToObj(this.changedParametersArr)
        },
    },
}
</script>
