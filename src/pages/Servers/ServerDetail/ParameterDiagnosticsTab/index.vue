<template>
    <v-row>
        <!-- PARAMETERS TABLE -->
        <v-col class="py-0 my-0" cols="6">
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
                            :loading="loading"
                            keepPrimitiveValue
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
        </v-col>
        <v-col class="py-0 my-0" cols="6">
            <collapse
                :toggleOnClick="() => (showMonitorDiagnostics = !showMonitorDiagnostics)"
                :toggleVal="showMonitorDiagnostics"
                :title="`${$t('monitorDiagnostics')}`"
            >
                <template v-slot:content>
                    <tree-data
                        :headers="variableValueTableHeaders"
                        :data="monitorDiagnosticsTableRow"
                    />
                </template>
            </collapse>
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

import { mapGetters, mapActions } from 'vuex'
export default {
    name: 'parameter-diagnostics-tab',

    props: {
        currentServer: { type: Object, required: true },
        updateServerParameters: { type: Function, required: true },
        onEditSucceeded: { type: Function, required: true },
        loading: { type: Boolean, required: true },
    },

    data() {
        return {
            // parameters
            isValid: false,
            showParameters: true,
            editableCell: false,
            showConfirmDialog: false,
            changesItems: [],
            showMonitorDiagnostics: true,
            editableParams: [
                {
                    id: 'address',
                    type: 'string',
                },
                {
                    id: 'port',
                    type: 'count',
                },
                {
                    id: 'socket',
                    type: 'string',
                },
                {
                    id: 'monitoruser',
                    type: 'string',
                },
                {
                    id: 'monitorpw',
                    type: 'string',
                },
            ],
            //MONITOR
            monitorDiagnosticsTableRow: [],
            // COMMOn
            variableValueTableHeaders: [
                { text: 'Variable', value: 'id', width: '65%' },
                { text: 'Value', value: 'value', width: '35%', editableCol: true },
            ],
        }
    },

    computed: {
        parametersTableRow: function() {
            let currentServer = this.$help.cloneDeep(this.currentServer)
            if (!this.$help.isEmpty(currentServer)) {
                const { attributes: { parameters = {} } = {} } = currentServer
                const keepPrimitiveValue = true
                let tableRow = this.$help.objToArrOfObj(parameters, keepPrimitiveValue)
                let editableParams = this.$help.cloneDeep(this.editableParams)
                let arr = []
                if (this.editableCell) {
                    for (let o = 0; o < tableRow.length; ++o) {
                        for (let i = 0; i < editableParams.length; ++i) {
                            if (tableRow[o].id === editableParams[i].id) {
                                let paramObj = this.$help.cloneDeep(editableParams[i])
                                paramObj['value'] = tableRow[o].value
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
    async created() {
        this.fetchMonitorDiagnostics()
    },
    methods: {
        async fetchMonitorDiagnostics() {
            let self = this
            if (!self.$help.isEmpty(self.currentServer.relationships.monitors)) {
                const { relationships: { monitors = {} } = {} } = self.currentServer

                let res = await this.axios.get(
                    `/monitors/${monitors.data[0].id}?fields[monitors]=monitor_diagnostics`
                )
                const {
                    attributes: {
                        monitor_diagnostics: { server_info },
                    },
                } = res.data.data

                let monitorDiagnosticsObj = server_info.find(
                    server => server.name === self.currentServer.id
                )
                let arrData
                let arr = self.$help.objToArrOfObj(monitorDiagnosticsObj)
                if (arr.length) {
                    arrData = arr.map(obj => {
                        return {
                            id: obj.id,
                            value: self.$help.isObject(obj.value) ? '' : obj.value,
                            isLink: false,
                            children: self.$help.processTreeData(obj.value, 0),
                            level: 0,
                            colNameWidth: `calc(65% - 11px -  ${0 * 8}px)`,
                            colValueWidth: 'calc(35% - 11px)',
                        }
                    })
                }

                this.monitorDiagnosticsTableRow = arrData
            }
        },

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
            this.closeConfirmDialog()
            this.editableCell = false
            this.changesItems = []
        },

        async acceptEdit() {
            let self = this
            await self.updateServerParameters({
                id: self.currentServer.id,
                parameters: self.$help.arrOfObjToObj(self.changesItems),
                callback: self.onEditSucceeded,
            })
            self.cancelEdit()
        },
    },
}
</script>
