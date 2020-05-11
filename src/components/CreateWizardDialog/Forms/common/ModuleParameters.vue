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
            :placeholder="$tc('select', 1, { entityName: $tc(moduleName, 1) })"
            :rules="[v => !!v || `${$tc(moduleName, 1)} is required`]"
            required
        />

        <editable-parameters-collapse
            v-if="selectedModule"
            :key="selectedModule.id"
            ref="parametersTable"
            :parameters="getModuleParameters"
            :requiredParams="requiredParams"
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
This component takes modules props to render v-select component for selecting a module.
When a module is selelcted, a parameters input table will be rendered.
moduleName props is defined to render correct label for select input 
requiredParams simply enable required attribute in parameter-input
*/
import EditableParametersCollapse from './EditableParametersCollapse'

export default {
    name: 'module-parameters',
    components: {
        EditableParametersCollapse,
    },
    props: {
        moduleName: { type: String, required: true },
        modules: { type: Array, required: true },
        requiredParams: { type: Array, default: () => [] },
    },
    data: function() {
        return {
            // router module input
            selectedModule: undefined,
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
    },

    methods: {
        getModuleInputValues() {
            /*
            When using module parameters, only parameters that have changed by the user
            will be sent in the post request, omitted parameters will be assigned default_value by MaxScale
            */

            const moduleInputs = {
                moduleId: this.selectedModule.id,
                parameters: this.$refs.parametersTable.getParameterObj(),
            }
            return moduleInputs
        },
    },
}
</script>
