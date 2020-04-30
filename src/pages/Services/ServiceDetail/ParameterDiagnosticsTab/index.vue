<template>
    <v-row>
        <!-- PARAMETERS TABLE -->
        <v-col class="py-0 my-0" cols="6">
            <details-table-wrapper
                :toggleOnClick="() => (showParameters = !showParameters)"
                :toggleVal="showParameters"
                :title="`${$tc('parameters', 2)}`"
                :editing="editableCell"
                :onEdit="() => (editableCell = true)"
                :doneEditing="() => (showConfirmDialog = true)"
            >
                <template v-slot:table>
                    <data-table
                        :headers="variableValueTableHeaders"
                        :data="parametersTableRow"
                        :tdBorderLeft="true"
                        :itemsPerPage="parametersTableRow.length"
                        :showAll="true"
                        :search="searchKeyWord"
                        :editableCell="editableCell"
                        :loading="editableCell ? loadingEditableParams : loading"
                    >
                        <template v-if="editableCell" v-slot:value="props">
                            <parameter-input
                                :item="props.data.item"
                                @on-input-change="handleItemChange"
                            />
                        </template>
                        <template v-if="editableCell" v-slot:id="props">
                            <b>{{ props.data.item.type }}</b
                            >: {{ props.data.item.id }}
                        </template>
                    </data-table>
                </template>
            </details-table-wrapper>
        </v-col>
        <base-dialog
            v-model="showConfirmDialog"
            :onCancel="cancelEdit"
            :onClose="closeConfirmDialog"
            :onSave="acceptEdit"
            :title="`${$t('implementChanges')}`"
            saveText="thatsRight"
            :disabledSaveBtn="changesItems.length ? false : true"
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
        <v-col class="py-0 my-0" cols="6">
            <details-table-wrapper
                :toggleOnClick="() => (showRouterDiagnostics = !showRouterDiagnostics)"
                :toggleVal="showRouterDiagnostics"
                :title="`${$t('routerDiagnostics')}`"
            >
                <template v-slot:table>
                    <tree-data
                        :headers="variableValueTableHeaders"
                        :data="routerDiagnosticsTableRow"
                        :search="searchKeyWord"
                    />
                </template>
            </details-table-wrapper>
        </v-col>
    </v-row>
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

export default {
    name: 'parameter-diagnostics-tab',

    props: {
        searchKeyWord: { type: String, required: true },
        currentService: { type: Object, required: true },
        updateServiceParameters: { type: Function, required: true },
        onEditSucceeded: { type: Function, required: true },
        loading: { type: Boolean, required: true },
    },

    data() {
        return {
            variableValueTableHeaders: [
                { text: 'Variable', value: 'id', width: '65%' },
                { text: 'Value', value: 'value', width: '35%', editableCol: true },
            ],
            showParameters: true,
            editableCell: false,
            showConfirmDialog: false,
            changesItems: [],
            showRouterDiagnostics: true,
            routerParameters: [],
            loadingEditableParams: false,
        }
    },

    computed: {
        parametersTableRow: function() {
            let currentService = this.$help.cloneDeep(this.currentService)
            if (!this.$help.isEmpty(currentService)) {
                const { attributes: { parameters = {} } = {} } = currentService
                let tableRow = this.$help.objToArrOfObj(parameters)
                let editableParams = this.$help.cloneDeep(this.routerParameters)
                let arr = []
                if (this.editableCell) {
                    for (let o = 0; o < tableRow.length; ++o) {
                        for (let i = 0; i < editableParams.length; ++i) {
                            if (tableRow[o].id === editableParams[i].name) {
                                let paramObj = this.$help.cloneDeep(editableParams[i])
                                paramObj['value'] = tableRow[o].value
                                // param in editableParams has name propery instead of id
                                paramObj['id'] = paramObj.name
                                delete paramObj.name
                                arr.push(paramObj)
                            }
                        }
                    }
                } else {
                    arr = tableRow
                }
                return arr
            }
            return []
        },

        routerDiagnosticsTableRow: function() {
            let currentService = this.currentService
            if (!this.$help.isEmpty(currentService)) {
                const { attributes: { router_diagnostics = {} } = {} } = currentService
                let arrData
                let arr = this.$help.objToArrOfObj(router_diagnostics)
                if (arr.length) {
                    arrData = arr.map(obj => {
                        return {
                            id: obj.id,
                            value: this.$help.isObject(obj.value) ? '' : obj.value,
                            isLink: false,
                            children: this.$help.processTreeData(obj.value, 0),
                            level: 0,
                            colNameWidth: `calc(65% - 11px -  ${0 * 8}px)`,
                            colValueWidth: 'calc(35% - 11px)',
                        }
                    })
                }
                return arrData
            }
            return []
        },
    },
    watch: {
        editableCell: async function(val) {
            if (val) {
                const {
                    attributes: { router },
                } = this.currentService
                let res = await this.axios.get(
                    `/maxscale/modules/${router}?fields[module]=parameters`
                )
                const { attributes: { parameters = [] } = {} } = res.data.data
                this.routerParameters = parameters
                this.loadingEditableParams = true
                await setTimeout(() => (this.loadingEditableParams = false), 150)
            } else {
                this.loadingEditableParams = false
            }
        },
    },
    methods: {
        handleItemChange(newItem, changed) {
            let clone = this.$help.cloneDeep(this.changesItems)
            let targetIndex = clone.findIndex(o => o.id == newItem.id)
            if (changed) {
                targetIndex === -1 && this.changesItems.push(newItem)
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
            await self.updateServiceParameters({
                id: self.currentService.id,
                parameters: self.$help.arrOfObjToObj(self.changesItems),
                callback: self.onEditSucceeded,
            })
            self.cancelEdit()
        },
    },
}
</script>
