<template>
    <v-snackbar
        v-model="message.status"
        :color="message.type"
        :bottom="true"
        :right="true"
        :timeout="timeout"
        multi-line
    >
        <span v-for="(item, i) in message.text" :key="i">{{ item }}</span>
        <v-btn dark class="mr-0" text icon @click="message.status = false">
            <v-icon size="16">
                close
            </v-icon>
        </v-btn>
    </v-snackbar>
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
    name: 'snackbars',
    data() {
        return {
            timeout: 6000,
        }
    },
    computed: {
        message() {
            return this.$store.state.message
        },
    },
}
</script>
