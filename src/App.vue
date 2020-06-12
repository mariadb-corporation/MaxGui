<template>
    <v-app>
        <overlay />
        <component :is="$route.meta.layout"> </component>
        <base-dialog
            v-model="updateExists"
            :onClose="() => null"
            :onCancel="() => null"
            :onSave="confirmUpdate"
            :title="`${$t('newUpdateAvailable')}`"
            saveText="update"
            forceAccept
        />
    </v-app>
</template>

<script>
/*
 * Copyright (c) 2020 MariaDB Corporation Ab
 *
 * Use of this software is governed by the Business Source License included
 * in the LICENSE.TXT file and at www.mariadb.com/bsl11.
 *
 * Change Date: 2024-06-15
 *
 * On the date above, in accordance with the Business Source License, use
 * of this software will be governed by version 2 or later of the General
 *  Public License.
 */
import store from 'store'
import AppLayout from 'layouts/AppLayout'
import NoLayout from 'layouts/NoLayout'
import Overlay from './components/overlay/Index'
import { mapState, mapMutations } from 'vuex'
import Logger from 'utils/logging'
const logger = new Logger('main')

export default {
    store,
    components: {
        Overlay,
        AppLayout,
        NoLayout,
    },

    computed: {
        ...mapState(['isUpdateAvailable']),
        updateExists: function() {
            return this.isUpdateAvailable
        },
    },

    mounted() {
        let overlay = document.getElementById('global-overlay')
        if (overlay) {
            overlay.style.display = 'none'
        }
    },

    async created() {
        logger.info(this.$store.state.config.asciiLogo)
        logger.info(`Loaded Version: ${process.env.VUE_APP_VERSION}`)
    },

    methods: {
        ...mapMutations(['setUpdateAvailable']),
        confirmUpdate() {
            this.setUpdateAvailable(false)
            window.location.reload()
            logger.info('App is updated')
        },
    },
}
</script>

<style lang="scss">
@import 'styles/main.scss';
</style>
