<template>
    <v-sheet v-if="!$_.isEmpty(currentService)" class="px-6">
        <details-page-title />
        <icon-sprite-sheet
            size="13"
            class="status-icon mr-1"
            :frame="$help.serviceStateIcon(currentService.attributes.state)"
        >
            status
        </icon-sprite-sheet>
        <span class="color text-navigation body-2">
            {{ currentService.attributes.state === 'Started' ? 'Healthy' : 'Unhealthy' }}
        </span>

        <v-slide-group :show-arrows="false" width="100%" class="mb-5" center-active>
            <v-slide-item style="width:40%">
                <div class="d-flex" style="width:100%">
                    <outline-small-card
                        cardWrapper="detail-overview mt-6"
                        cardClass="detail-overview__card "
                    >
                        <template v-slot:title>
                            {{ $t('overview') }}
                        </template>
                        <template v-slot:card-body>
                            <span class="caption font-weight-bold color text-deep-ocean"
                                >ROUTER</span
                            >
                            <span class="text-no-wrap">
                                {{ currentService.attributes.router }}
                            </span>
                        </template>
                    </outline-small-card>
                    <outline-small-card
                        cardWrapper="detail-overview mt-6"
                        cardClass="detail-overview__card "
                    >
                        <template v-slot:card-body>
                            <span class="caption font-weight-bold color text-deep-ocean">
                                STARTED AT
                            </span>
                            <span class="text-no-wrap">
                                {{ $help.formatValue(currentService.attributes.started) }}
                            </span>
                        </template>
                    </outline-small-card>
                </div>
            </v-slide-item>
            <v-slide-item style="width:60%">
                <outline-small-card
                    cardWrapper="detail-overview ml-2 mt-6"
                    cardClass="detail-overview__card-graph"
                >
                    <template v-slot:title>
                        {{ $t('currentConnections') }}
                        <span class="text-lowercase font-weight-medium">
                            ({{ currentConnections }}/{{ totalConnections }})</span
                        >
                    </template>
                    <template v-slot:card-body>
                        <v-col>
                            <current-connections-chart :updatingChart="updatingChart" />
                        </v-col>
                    </template>
                </outline-small-card>
            </v-slide-item>
        </v-slide-group>
        <v-row>
            <v-col cols="6">
                <h5>Parameters</h5>
                <recursive-nested-collapse
                    v-for="(value, propertyName) in currentService.attributes.parameters"
                    :key="propertyName"
                    :hasChild="$help.hasChild(value)"
                    :propertyName="propertyName"
                    :value="$help.handleNull(value)"
                    :child="$help.hasChild(value) ? value : {}"
                />
            </v-col>
            <v-col v-if="!$_.isEmpty(currentService.relationships)" cols="6">
                <h5>Relationships</h5>
                <fragment
                    v-for="(value, propertyName) in currentService.relationships"
                    :key="propertyName"
                >
                    <recursive-nested-collapse
                        v-if="propertyName !== 'services'"
                        :hasChild="$help.hasChild(value)"
                        :propertyName="propertyName"
                        :value="$help.handleNull(value)"
                        :child="$help.hasChild(value) ? value : {}"
                    />
                </fragment>
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
import CurrentConnectionsChart from 'pages/Services/CurrentConnectionsChart'

export default {
    name: 'service-detail',
    components: {
        'recursive-nested-collapse': RecursiveNestedCollapse,
        CurrentConnectionsChart,
    },
    data() {
        return {
            totalConnections: 100,
            currentConnections: 0,
        }
    },
    computed: {
        ...mapGetters('service', ['currentService']),
    },
    created() {
        this.fetchServiceById(this.$route.params.id)
        this.currentConnections = 10 //this.currentService.attributes.connections
    },
    methods: {
        ...mapActions('service', ['fetchServiceById']),
        async updatingChart(chart) {
            let self = this
            // Use sparse fieldsets to fetch only necessary data
            let res = await this.axios.get(
                `/services/${self.$route.params.id}?fields[services]=connections,total_connections`
            )
            if (res.status === 200) {
                let { attributes: { connections, total_connections } = {} } = res.data.data

                let testCurrent = Math.round(Math.random() * 100)

                this.totalConnections = 100 //total_connections
                this.currentConnections = testCurrent //connections

                chart.data.datasets.forEach(function(dataset) {
                    dataset.data.push({
                        x: Date.now(),
                        //connections
                        y: testCurrent,
                    })
                })
                chart.update({
                    preservation: true,
                })
            }
        },
    },
}
</script>

<style lang="scss" scoped>
.detail-overview {
    width: 100%;
    ::v-deep &__card,
    ::v-deep &__card-graph {
        border-radius: 0px !important;
        display: flex;
        align-items: center;
        flex-direction: column;
        justify-content: center;
    }
    ::v-deep &__card-graph {
        padding-top: 6px;
    }
    &:not(:first-of-type) {
        ::v-deep .detail-overview__card {
            border-left: none !important;
        }
    }
}
</style>
