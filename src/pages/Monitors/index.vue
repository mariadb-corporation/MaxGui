<template>
    <page-wrapper>
        <v-row class="mt-0">
            <v-col class="pt-0" cols="10">
                <monitors-table :allMonitors="allMonitors" />
            </v-col>
        </v-row>
    </page-wrapper>
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
import MonitorsTable from './MonitorsTable'

export default {
    name: 'servers',
    components: {
        MonitorsTable,
    },
    computed: {
        ...mapGetters('monitor', ['allMonitors']),
    },
    created() {
        this.fetchAllMonitors()
    },
    methods: {
        ...mapActions('monitor', ['fetchAllMonitors']),
    },
}
</script>
