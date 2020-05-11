<template>
    <v-row class="mt-5">
        <portal to="page-title">
            <h4
                style="margin-bottom: 0px; line-height: 10px;"
                class="color text-navigation text-navigation display-1 text-capitalize page-title"
            >
                {{ $route.name }}
            </h4>
        </portal>
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

export default {
    name: 'settings',
}
</script>
