<template>
    <v-app>
        <overlay />
        <component :is="$route.meta.layout"> </component>
    </v-app>
</template>

<script>
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
