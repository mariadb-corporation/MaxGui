<template>
    <!-- <v-container v-if="currentMonitor" fluid class="pl-8">
        <details-page-title />
        <v-row>
            <v-col cols="6">
                <h5>Attributes</h5>
                <recursive-nested-collapse
                    v-for="(value, propertyName) in currentMonitor.attributes"
                    :key="propertyName"
                    :hasChild="$help.hasChild(value)"
                    :propertyName="propertyName"
                    :value="$help.handleNull(value)"
                    :child="$help.hasChild(value) ? value : {}"
                />
            </v-col>
            <v-col v-if="!$_.isEmpty(currentMonitor.relationships)" cols="6">
                <h5>Relationshis</h5>
                <recursive-nested-collapse
                    v-for="(value, propertyName) in currentMonitor.relationships"
                    :key="propertyName"
                    :hasChild="$help.hasChild(value)"
                    :propertyName="propertyName"
                    :value="$help.handleNull(value)"
                    :child="$help.hasChild(value) ? value : {}"
                />
            </v-col>
        </v-row>
    </v-container> -->
    <v-sheet v-if="!$_.isEmpty(currentMonitor)" class="px-6">
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

        <v-slide-group :show-arrows="false" class="mb-5" center-active>
            <v-slide-item>
                <fragment>
                    <template v-for="(value, name) in getTopOverviewInfo">
                        <outline-small-card
                            :key="name"
                            cardWrapper="detail-overview mt-6"
                            cardClass="detail-overview__card px-10"
                        >
                            <template v-slot:card-body>
                                <span
                                    class="caption text-uppercase font-weight-bold color text-deep-ocean"
                                >
                                    {{ name.replace('_', ' ') }}
                                </span>

                                <span class="text-no-wrap body-2">
                                    {{ value }}
                                </span>
                            </template>
                        </outline-small-card>
                    </template>
                </fragment>
            </v-slide-item>
        </v-slide-group>
        <!-- MONITOR DIAGNOSTICS TABLE -->
        <v-row>
            <v-col cols="6">
                <p class="body-2 font-weight-bold color text-navigation text-uppercase">
                    {{ $t('monitorDiagnostics') }}
                </p>
                <!-- 
                <recursive-nested-collapse
                    v-for="(value, propertyName) in tableRowProcessed('monitorDiagnostics')"
                    :key="propertyName"
                    :hasChild="$help.hasChild(value)"
                    :propertyName="propertyName"
                    :value="$help.handleNull(value)"
                    :child="$help.hasChild(value) ? value : {}"
                /> -->
                <recursive-table
                    class="table-fluid"
                    :headers="variableValueTableHeaders"
                    :data="tableRowProcessed('monitorDiagnostics')"
                    :tdBorderLeft="true"
                />
            </v-col>
        </v-row>
        <!-- PARAMETERS TABLE -->
        <v-row>
            <v-col cols="6">
                <p class="body-2 font-weight-bold color text-navigation text-uppercase">
                    {{ $t('parameters') }}
                </p>
                <data-table
                    class="table-fluid"
                    :headers="variableValueTableHeaders"
                    :data="tableRowProcessed('parameters')"
                    :tdBorderLeft="true"
                />
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
import RecursiveNestedCollapse from 'components/RecursiveNestedCollapse'
import { mapGetters, mapActions } from 'vuex'

export default {
    components: {
        'recursive-nested-collapse': RecursiveNestedCollapse,
    },
    data() {
        return {
            variableValueTableHeaders: [
                { text: 'Variable', value: 'id', width: '65%' },
                { text: 'Value', value: 'value', width: '35%' },
            ],
        }
    },
    computed: {
        ...mapGetters('monitor', ['currentMonitor']),
        getTopOverviewInfo: function() {
            let self = this
            let currentMonitor = self.$_.cloneDeep(self.currentMonitor)
            let overviewInfo = {}
            if (!self.$_.isEmpty(currentMonitor)) {
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
        tableRowProcessed() {
            return type => {
                let currentMonitor = this.$_.cloneDeep(this.currentMonitor)
                if (!this.$_.isEmpty(currentMonitor)) {
                    switch (type) {
                        case 'parameters': {
                            const { attributes: { parameters = {} } = {} } = currentMonitor
                            return this.$help.objToArrOfObj(parameters)
                        }
                        case 'monitorDiagnostics': {
                            const {
                                attributes: { monitor_diagnostics: { server_info = [] } = {} } = {},
                            } = currentMonitor
                            let objData = server_info.map(obj => ({
                                id: obj.name,
                                value: obj,
                            }))

                            return objData
                        }
                    }
                }
                return []
            }
        },
    },

    created() {
        this.fetchMonitorById(this.$route.params.id)
    },
    methods: {
        ...mapActions('monitor', ['fetchMonitorById']),
    },
}
</script>
