<template>
    <div class="mb-2">
        <label class="text-capitalize label color text-small-text d-block">
            {{ $tc('module', 1) }}
        </label>
        <v-select
            id="module-select"
            v-model="selectedModule"
            :items="resourceModules"
            item-text="id"
            return-object
            name="resource"
            outlined
            dense
            class="std mariadb-select-input error--text__bottom"
            :menu-props="{ contentClass: 'mariadb-select-v-menu' }"
            height="36px"
            :placeholder="$tc('select', 1, { entityName: $tc('module', 1) })"
            :rules="[v => !!v || 'Module is required']"
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
                                props.data.item.id === 'user' || props.data.item.id === 'password'
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
        <collapse
            wrapperClass="mt-4"
            titleWrapperClass="mx-n9"
            :toggleOnClick="() => (showServers = !showServers)"
            :toggleVal="showServers"
            :title="`${$tc('servers', 2)}`"
        >
            <template v-slot:content>
                <v-select
                    v-model="selectedServers"
                    :items="serversList"
                    item-text="id"
                    return-object
                    multiple
                    name="servers"
                    outlined
                    dense
                    class="std mariadb-select-input"
                    :menu-props="{ contentClass: 'mariadb-select-v-menu' }"
                    height="36px"
                    :placeholder="$tc('select', 2, { entityName: $tc('servers', 2) })"
                    :no-data-text="$t('noEntityAvailable', { entityName: $tc('servers', 2) })"
                    hide-details
                />
            </template>
        </collapse>
    </div>
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
import { mapActions, mapGetters } from 'vuex'
export default {
    name: 'monitor-form-input',
    props: {
        resourceModules: { type: Array, required: true },
        allServers: { type: Array, required: true },
        emittingFormValuesEvent: { type: Boolean, required: true },
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
            // Relationships section
            showServers: true,
            selectedServers: [],
        }
    },
    computed: {
        serversList: function() {
            let cloneArr = this.$help.cloneDeep(this.allServers)
            let result = []
            for (let i = 0; i < cloneArr.length; ++i) {
                let obj = cloneArr[i]
                if (this.$help.isUndefined(obj.relationships.monitors)) {
                    delete obj.attributes
                    delete obj.links
                    delete obj.relationships
                    delete obj.idNum
                    result.push(obj)
                }
            }
            return result
        },

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
    watch: {
        emittingFormValuesEvent: function(val) {
            if (val) {
                /*
            When using module parameters, only parameters that have changed by the user
            will be sent in the post request, omitted parameters will be assigned default_value by MaxScale
            */
                let parametersObj = this.$help.arrOfObjToObj(this.changedParametersArr)
                const formValues = {
                    module: this.selectedModule.id,
                    parameters: parametersObj,
                    relationships: {
                        servers: { data: this.selectedServers },
                    },
                }
                this.$emit('form-values', formValues)
            }
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
    },
}
</script>
