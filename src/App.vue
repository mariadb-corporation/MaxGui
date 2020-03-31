<template>
    <v-app>
        <overlay />
        <component :is="$route.meta.layout"> </component>
    </v-app>
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
 *  Public License.
 */
import store from 'store'
import AppLayout from 'layouts/AppLayout'
import NoLayout from 'layouts/NoLayout'
import Overlay from './components/overlay/Index'
import Logger from 'utils/logging'
const logger = new Logger('main')

export default {
    store,
    components: {
        Overlay,
        AppLayout,
        NoLayout,
    },
    async created() {
        logger.info(this.$store.state.config.asciiLogo)
        logger.info(`Loaded Version: ${process.env.VUE_APP_VERSION}`)
    },
}
</script>

<style lang="scss">
@import 'styles/main.scss';
</style>
