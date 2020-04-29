<template>
    <fragment>
        <!-- MAXSCALE TABLE
        <v-row>
            <v-col cols="6">
                <div class="mb-1 d-flex align-center">
                    <div class="d-flex align-center">
                        <v-btn
                            icon
                            class="arrow-toggle"
                            @click="() => (showMonitorDiagnostics = !showMonitorDiagnostics)"
                        >
                            <v-icon
                                :class="[!showMonitorDiagnostics ? 'arrow-down' : 'arrow-up']"
                                size="32"
                            >
                                $expand
                            </v-icon>
                        </v-btn>
                        <p
                            class="mb-0 body-2 font-weight-bold color text-navigation text-uppercase"
                        >
                            MaxScale Detail
                        </p>
                    </div>
                </div>
                <v-expand-transition>
                    <div v-show="showMonitorDiagnostics">
                        <tree-data
                            :headers="monitorDiagnosticsTableHeaders"
                            :data="tableRowProcessed('monitorDiagnostics')"
                            :search="searchKeyWord"
                            :openNode="getFirstOpenNodeId"
                        />
                    </div>
                </v-expand-transition>
            </v-col>
        </v-row>

        <v-sheet max-width="600">
            <recursive-nested-collapse
                v-for="(value, keyName) in genData()"
                :key="keyName"
                :hasChild="$help.hasChild(value)"
                :keyName="keyName"
                :value="$help.handleValue(value)"
                :child="$help.hasChild(value) ? value : {}"
            />
        </v-sheet> -->
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
import { mapGetters, mapActions } from 'vuex'

export default {
    name: 'max-scale',

    data() {
        return {
            data: null,
        }
    },
    computed: {
        ...mapGetters('maxscale', ['maxScaleOverviewInfo']),
    },
    created() {
        !this.$route.params.parameters && this['maxscale/fetchMaxScaleOverviewInfo']()
    },
    methods: {
        ...mapActions(['maxscale/fetchMaxScaleOverviewInfo']),
        // genData() {
        //     if (this.$route.params.parameters) {
        //         return this.$help.cloneDeep(this.$route.params.parameters)
        //     }
        //     return this.$help.cloneDeep(this.maxScaleOverviewInfo.parameters)
        // },
    },
}
</script>

<style scoped></style>
