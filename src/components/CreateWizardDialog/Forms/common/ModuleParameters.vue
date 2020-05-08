<template>
    <fragment>
        <label class="text-capitalize label color text-small-text d-block">
            {{ $tc(moduleName, 1) }}
        </label>
        <v-select
            id="module-select"
            v-model="selectedModule"
            :items="modules"
            item-text="id"
            return-object
            name="resource"
            outlined
            dense
            class="std mariadb-select-input error--text__bottom"
            :menu-props="{ contentClass: 'mariadb-select-v-menu' }"
            height="36px"
            :placeholder="$tc('select', 1, { entityName: $tc(moduleName, 1) })"
            :rules="[v => !!v || `${$tc(moduleName, 1)} is required`]"
            required
        />

        <collapse
            v-if="selectedModule"
            wrapperClass="mt-4"
            titleWrapperClass="mx-n9"
            :toggleOnClick="() => (showParameters = !showParameters)"
            :toggleVal="showParameters"
            :title="`${$tc('parameters', 2)}`"
        >
            <template v-slot:content>
                <data-table
                    :key="selectedModule.id"
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
This component takes modules props to render v-select component for selecting a module.
When a module is selelcted, a parameters input table will be rendered.
moduleName props is defined to render correct label for select input 
isServiceOrMonitor simply enable required attribute for user and password input fields 
which should be true when creating a service or monitor
*/
export default {
    name: 'module-parameters',
    props: {
        moduleName: { type: String, required: true },
        modules: { type: Array, required: true },
        isServiceOrMonitor: { type: Boolean, default: true },
    },
    data: function() {
        return {
            // router module input
            selectedModule: undefined,
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
        getModuleParameters: function() {
            const self = this
            if (self.selectedModule) {
                const {
                    attributes: { parameters = [] },
                } = self.$help.cloneDeep(self.selectedModule)
                return parameters
            }
            return []
        },
        parametersTableRow: function() {
            const self = this
            let parameters = self.getModuleParameters
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
                // param in editableParams has name propery instead of id
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
        getModuleInputValues() {
            /*
            When using module parameters, only parameters that have changed by the user
            will be sent in the post request, omitted parameters will be assigned default_value by MaxScale
            */
            const moduleInputs = {
                moduleId: this.selectedModule.id,
                parameters: this.$help.arrOfObjToObj(this.changedParametersArr),
            }
            return moduleInputs
        },
    },
}
</script>
