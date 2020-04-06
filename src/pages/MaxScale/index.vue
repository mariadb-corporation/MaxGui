<template>
    <fragment>
        <h4 class="text-left">Parameters</h4>
        <v-sheet max-width="600">
            <recursive-nested-collapse
                v-for="(value, keyName) in genData()"
                :key="keyName"
                :hasChild="$help.hasChild(value)"
                :keyName="keyName"
                :value="$help.handleNull(value)"
                :child="$help.hasChild(value) ? value : {}"
            />
        </v-sheet>
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
        ...mapGetters('maxscale', ['maxscaleDetails']),
    },
    created() {
        !this.$route.params.parameters && this['maxscale/fetchMaxScaleDetails']()
    },
    methods: {
        ...mapActions(['maxscale/fetchMaxScaleDetails']),
        genData() {
            if (this.$route.params.parameters) {
                return this.$_.cloneDeep(this.$route.params.parameters)
            }
            return this.$_.cloneDeep(this.maxscaleDetails.parameters)
        },
    },
}
</script>

<style scoped></style>
