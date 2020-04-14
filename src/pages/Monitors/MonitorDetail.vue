<template>
    <v-sheet v-if="!$help.isEmpty(currentMonitor)" class="px-6">
        <details-page-title />
        <icon-sprite-sheet
            size="13"
            class="status-icon mr-1"
            :frame="$help.monitorStateIcon(currentMonitor.attributes.state)"
        >
            status
        </icon-sprite-sheet>
        <span class="color text-navigation body-2">
            {{ currentMonitor.attributes.state }}
        </span>

        <div class="d-flex mb-2">
            <template v-for="(value, name) in getTopOverviewInfo">
                <outline-small-card
                    :key="name"
                    cardWrapper="detail-overview mt-0"
                    cardClass="detail-overview__card px-10"
                >
                    <template v-slot:card-body>
                        <span class="caption text-uppercase font-weight-bold color text-deep-ocean">
                            {{ name.replace('_', ' ') }}
                        </span>

                        <span class="text-no-wrap body-2">
                            {{ value }}
                        </span>
                    </template>
                </outline-small-card>
            </template>
        </div>
        <!-- MONITOR DIAGNOSTICS TABLE -->
        <v-row>
            <v-col cols="6">
                <details-table-wrapper
                    :toggleOnClick="() => (showMonitorDiagnostics = !showMonitorDiagnostics)"
                    :toggleVal="showMonitorDiagnostics"
                    title="monitorDiagnostics"
                    :onAddClick="() => (addServerDialog = true)"
                    addBtnText="addServer"
                >
                    <template v-slot:table>
                        <tree-data
                            :headers="monitorDiagnosticsTableHeaders"
                            :data="tableRowProcessed('monitorDiagnostics')"
                            :search="searchKeyWord"
                            :openNode="getFirstOpenNodeId"
                        />
                    </template>
                </details-table-wrapper>
            </v-col>
        </v-row>
        <!-- PARAMETERS TABLE -->
        <v-row>
            <v-col cols="6">
                <details-table-wrapper
                    :toggleOnClick="() => (showParameters = !showParameters)"
                    :toggleVal="showParameters"
                    title="parameters"
                >
                    <template v-slot:table>
                        <data-table
                            class="table-fluid"
                            :headers="variableValueTableHeaders"
                            :data="tableRowProcessed('parameters')"
                            :tdBorderLeft="true"
                            :search="searchKeyWord"
                        />
                    </template>
                </details-table-wrapper>
            </v-col>
        </v-row>
    </v-sheet>
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
    data() {
        return {
            variableValueTableHeaders: [
                { text: 'Variable', value: 'id', width: '65%' },
                { text: 'Value', value: 'value', width: '35%' },
            ],
            monitorDiagnosticsTableHeaders: [
                { text: 'Servers', value: 'id', width: '65%' },
                { text: 'Value', value: 'value', width: '35%' },
            ],
            showParameters: true,
            showMonitorDiagnostics: true,
            addServerDialog: false,
        }
    },
    computed: {
        ...mapGetters({
            searchKeyWord: 'searchKeyWord',
            currentMonitor: 'monitor/currentMonitor',
        }),

        /**
         * @return {Object} return overviewInfo object
         */
        getTopOverviewInfo: function() {
            let self = this
            let currentMonitor = self.$help.cloneDeep(self.currentMonitor)
            let overviewInfo = {}
            if (!self.$help.isEmpty(currentMonitor)) {
                // Set fallback undefined value if properties doesnt exist
                const {
                    attributes: {
                        monitor_diagnostics: { master, master_gtid_domain_id, state, primary } = {},
                    } = {},
                } = currentMonitor

                overviewInfo = {
                    master: master,
                    master_gtid_domain_id: master_gtid_domain_id,
                    state: state,
                    primary: primary,
                }

                Object.keys(overviewInfo).forEach(
                    key => (overviewInfo[key] = self.$help.handleValue(overviewInfo[key]))
                )
            }
            return overviewInfo
        },
        /**
         * @param {String} type type for handle processing data
         * @return {Array} Array
         */
        tableRowProcessed() {
            return type => {
                let currentMonitor = this.$help.cloneDeep(this.currentMonitor)
                if (!this.$help.isEmpty(currentMonitor)) {
                    switch (type) {
                        case 'parameters': {
                            const { attributes: { parameters = {} } = {} } = currentMonitor
                            return this.$help.objToArrOfObj(parameters)
                        }
                        case 'monitorDiagnostics': {
                            const {
                                attributes: { monitor_diagnostics: { server_info = [] } = {} } = {},
                            } = currentMonitor
                            let arrData
                            if (server_info.length) {
                                arrData = server_info.map(obj => {
                                    let id = obj.name
                                    delete obj.name
                                    return {
                                        id: id,
                                        value: null,
                                        isLink: true,
                                        children: this.processTreeData(obj, 0),
                                        level: 0,
                                        colNameWidth: `calc(65% - 11px -  ${0 * 8}px)`,
                                        colValueWidth: 'calc(35% - 11px)',
                                    }
                                })
                            }
                            return arrData
                        }
                    }
                }
                return []
            }
        },
        getFirstOpenNodeId: function() {
            let currentMonitor = this.$help.cloneDeep(this.currentMonitor)
            const {
                attributes: { monitor_diagnostics: { server_info = [] } = {} } = {},
            } = currentMonitor
            if (server_info.length) {
                return [server_info[0].name]
            }
            return []
        },
    },

    created() {
        this.fetchMonitorById(this.$route.params.id)
    },

    methods: {
        ...mapActions('monitor', ['fetchMonitorById']),
        /**
         * @param {Object} obj Object to be processed in to tree data arr
         * @param {Number} level level of data
         * @return {Array} return tree data arr
         */
        processTreeData(obj, level) {
            if (typeof obj === 'object') {
                let data = []
                let self = this
                let targetObj = self.$help.cloneDeep(obj)

                if (!self.$help.isEmpty(targetObj)) {
                    Object.keys(targetObj).map(key => {
                        const value = self.$help.handleValue(targetObj[key])
                        let newValue = self.$help.cloneDeep(value)

                        let typeOfValue = typeof value
                        if (typeOfValue === 'object') {
                            newValue = null
                        } else if (Array.isArray(value)) {
                            newValue = { ...newValue } // convert to object
                        }
                        let chilren = self.processTreeData(
                            self.$help.handleValue(targetObj[key]),
                            level + 1
                        )

                        data.push({
                            id: key,
                            level: level + 1,
                            value: newValue,
                            children: chilren,
                            /* width of one v-treeview-node__level is 24, by default
                             */
                            colNameWidth: `calc(65% - 11px -  ${(level + 1) * 8.5}px)`,
                            colValueWidth: `calc(35% - 11px - ${(level + 1) * 8.5}px)`,
                        })
                    })
                    return data
                }
            }
            return []
        },
    },
}
</script>
