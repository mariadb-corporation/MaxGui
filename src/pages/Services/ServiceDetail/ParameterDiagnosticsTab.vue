<template>
    <v-row>
        <!-- PARAMETERS TABLE -->
        <v-col class="py-0 my-0" cols="6">
            <details-table-wrapper
                :toggleOnClick="() => (showParameters = !showParameters)"
                :toggleVal="showParameters"
                title="parameters"
                :editing="paramsEditable"
                :onEdit="() => (paramsEditable = true)"
                :doneEditing="() => (showConfirmDialog = true)"
            >
                <template v-slot:table>
                    <data-table
                        :headers="variableValueTableHeaders"
                        :data="tableRowProcessed('parameters')"
                        :tdBorderLeft="true"
                        :itemsPerPage="tableRowProcessed('parameters').length"
                        :showAll="true"
                        :search="searchKeyWord"
                        :editableCell="paramsEditable"
                        :loading="loading"
                    >
                        <template v-if="paramsEditable" v-slot:value="props">
                            <fragment v-if="props.data.item.id === 'password'">
                                <parameter-input
                                    :item="props.data.item"
                                    :onItemChanges="handleItemChange"
                                    :hasPwdParam="true"
                                />
                            </fragment>
                            <fragment v-else-if="props.data.item.id === 'user'">
                                <parameter-input
                                    :item="props.data.item"
                                    :onItemChanges="handleItemChange"
                                    :hasUseParam="true"
                                />
                            </fragment>
                            <fragment v-else>
                                <parameter-input
                                    :item="props.data.item"
                                    :onItemChanges="handleItemChange"
                                />
                            </fragment>
                        </template>
                    </data-table>
                </template>
            </details-table-wrapper>

            <base-dialog
                v-model="showConfirmDialog"
                :onCancel="cancelEdit"
                :onClose="closeConfirmDialog"
                :onSave="acceptEdit"
                :title="`${$t('implementChanges')}`"
                saveText="thatsRight"
            >
                <template v-slot:body>
                    <span class="d-block mb-4">
                        {{ $t('changeTheFollowingParameters', { quantity: changesItems.length }) }}
                    </span>
                    <fragment v-for="item in changesItems" :key="item.id">
                        <p class="d-block mb-1 font-weight-bold">
                            {{ item.id }}
                        </p>
                    </fragment>
                </template>
            </base-dialog>
        </v-col>
        <v-col class="py-0 my-0" cols="6">
            <details-table-wrapper
                :toggleOnClick="() => (showRouterDiagnostics = !showRouterDiagnostics)"
                :toggleVal="showRouterDiagnostics"
                title="routerDiagnostics"
            >
                <template v-slot:table>
                    <!-- <data-table
           
                        :headers="variableValueTableHeaders"
                        :data="tableRowProcessed('routerDiagnostics')"
                        :tdBorderLeft="true"
                        :search="searchKeyWord"
                    /> -->
                    <tree-data
                        :headers="variableValueTableHeaders"
                        :data="tableRowProcessed('routerDiagnostics')"
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

import { mapGetters, mapActions } from 'vuex'
export default {
    name: 'parameter-diagnostics-tab',

    props: {
        searchKeyWord: { type: String, required: true },
        currentService: { type: Object, required: true },
        createOrUpdateService: { type: Function, required: true },
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
            paramsEditable: false,
            showConfirmDialog: false,
            changesItems: [],
            showRouterDiagnostics: true,
        }
    },
    computed: {
        tableRowProcessed() {
            return type => {
                let currentService = this.currentService

                if (!this.$help.isEmpty(currentService)) {
                    switch (type) {
                        case 'parameters': {
                            const { attributes: { parameters = {} } = {} } = currentService
                            return this.$help.objToArrOfObj(parameters)
                        }
                        case 'routerDiagnostics': {
                            const { attributes: { router_diagnostics = {} } = {} } = currentService
                            let arrData
                            let arr = this.$help.objToArrOfObj(router_diagnostics)
                            if (arr.length) {
                                arrData = arr.map(obj => {
                                    return {
                                        id: obj.id,
                                        value: obj.value,
                                        isLink: false,
                                        children: this.$help.processTreeData(obj.value, 0),
                                        level: 0,
                                        colNameWidth: `calc(65% - 11px -  ${0 * 8}px)`,
                                        colValueWidth: 'calc(35% - 11px)',
                                    }
                                })
                            }
                            return arrData
                            // return this.$help.objToArrOfObj(router_diagnostics)
                        }
                    }
                }
                return []
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

        cancelEdit() {
            this.paramsEditable = false
            this.showConfirmDialog = false
            this.changesItems = []
        },
        acceptEdit() {
            let self = this
            self.paramsEditable = false
            self.showConfirmDialog = false
            self.createOrUpdateService({
                mode: 'patch',
                id: self.currentService.id,
                parameters: self.$help.arrOfObjToObj(self.changesItems),
                callback: self.onEditSucceeded,
            })
        },
    },
}
</script>
