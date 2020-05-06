<template>
    <div class="mb-2">
        <label class="text-capitalize label color text-small-text d-block">
            {{ $tc('router', 1) }}
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
            :placeholder="$t('selectARouter')"
            :rules="[v => !!v || 'Router is required']"
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
                >
                    <template v-slot:value="props">
                        <parameter-input
                            ref="parameterInput"
                            :item="props.data.item"
                            @on-input-change="handleItemChange"
                        />
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
                    :placeholder="$t('selectServers')"
                    :no-data-text="$t('noServers')"
                    hide-details
                />
            </template>
        </collapse>
        <collapse
            wrapperClass="mt-4"
            titleWrapperClass="mx-n9"
            :toggleOnClick="() => (showFilters = !showFilters)"
            :toggleVal="showFilters"
            :title="`${$tc('filters', 2)}`"
        >
            <template v-slot:content>
                <v-select
                    v-model="selectedFilters"
                    :items="filtersList"
                    item-text="id"
                    return-object
                    multiple
                    name="filters"
                    outlined
                    dense
                    class="std mariadb-select-input"
                    :menu-props="{ contentClass: 'mariadb-select-v-menu' }"
                    height="36px"
                    :placeholder="$t('selectFilters')"
                    :no-data-text="$t('noFilters')"
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
    name: 'service-form-input',
    props: {
        resourceModules: { type: Array, required: true },
        allServers: { type: Array, required: true },
        allFilters: { type: Array, required: true },
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
            showFilters: true,
            selectedFilters: [],
        }
    },
    computed: {
        serversList: function() {
            let cloneArr = this.$help.cloneDeep(this.allServers)
            for (let i = 0; i < cloneArr.length; ++i) {
                let obj = cloneArr[i]
                delete obj.attributes
                delete obj.links
                delete obj.relationships
                delete obj.idNum
            }
            return cloneArr
        },
        filtersList: function() {
            let cloneArr = this.$help.cloneDeep(this.allFilters)
            for (let i = 0; i < cloneArr.length; ++i) {
                let obj = cloneArr[i]
                delete obj.attributes
                delete obj.links
                delete obj.relationships
            }
            return cloneArr
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
                    case 'duration':
                        defaultValue = paramObj.default_value.replace(/\D/g, '')
                        break
                    case 'bool':
                        defaultValue = paramObj.default_value === 'true'
                        break
                    case 'password string':
                        defaultValue = ''
                        break

                    default:
                        defaultValue = paramObj.default_value || null
                }

                if (paramObj.name === 'user') defaultValue = ''

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
                    router: this.selectedModule.id,
                    parameters: parametersObj,
                    relationships: {
                        servers: { data: this.selectedServers },
                        filters: { data: this.selectedFilters },
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
