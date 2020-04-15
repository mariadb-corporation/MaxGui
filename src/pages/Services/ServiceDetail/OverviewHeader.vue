<template>
    <v-sheet class="d-flex mb-2">
        <div class="d-flex" style="width:40%">
            <outline-small-card
                cardWrapper="detail-overview-with-graph mt-5"
                cardClass="detail-overview-with-graph__card "
            >
                <template v-slot:title>
                    {{ $t('overview') }}
                </template>
                <template v-slot:card-body>
                    <span class="caption text-uppercase font-weight-bold color text-deep-ocean">
                        ROUTER
                    </span>
                    <span class="text-no-wrap body-2">
                        {{ currentService.attributes.router }}
                    </span>
                </template>
            </outline-small-card>
            <outline-small-card
                cardWrapper="detail-overview-with-graph mt-5"
                cardClass="detail-overview-with-graph__card "
            >
                <template v-slot:card-body>
                    <span class="caption text-uppercase font-weight-bold color text-deep-ocean">
                        STARTED AT
                    </span>
                    <span class="text-no-wrap body-2">
                        {{ $help.formatValue(currentService.attributes.started) }}
                    </span>
                </template>
            </outline-small-card>
        </div>
        <div style="width:60%">
            <outline-small-card
                cardWrapper="detail-overview-with-graph ml-2 mt-5"
                cardClass="detail-overview-with-graph__card-graph"
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
        </div>
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
import CurrentConnectionsChart from 'pages/Services/CurrentConnectionsChart'
export default {
    name: 'overview-header',
    components: {
        CurrentConnectionsChart,
    },
    props: {
        currentService: { type: Object, required: true },
    },
    data() {
        return {
            totalConnections: 100,
            currentConnections: 0,
        }
    },
    created() {
        this.currentConnections = this.currentService.attributes.connections
    },
    methods: {
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
.detail-overview-with-graph {
    width: 100%;
    ::v-deep &__card {
        border-radius: 0px !important;
    }
    ::v-deep &__card,
    ::v-deep &__card-graph {
        display: flex;
        align-items: center;
        flex-direction: column;
        justify-content: center;
    }
    ::v-deep &__card-graph {
        padding-top: 6px;
    }
    &:not(:first-of-type) {
        ::v-deep .detail-overview-with-graph__card {
            border-left: none !important;
        }
    }
}
</style>
