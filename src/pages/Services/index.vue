<template>
    <v-row class="mt-0">
        <v-col class="pt-0" cols="12">
            <services-table :servicesData="servicesData" />
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
import ServicesTable from './ServicesTable'

export default {
    name: 'services',
    components: {
        ServicesTable,
    },
    computed: {
        ...mapGetters(['servicesData']),
    },
}
</script>
