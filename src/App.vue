<template>
    <v-app>
        <overlay />
        <component :is="layout"> </component>
    </v-app>
</template>

<script>
import store from 'store'
import AppLayout from 'layouts/AppLayout'
import NoLayout from 'layouts/NoLayout'
import Overlay from './components/overlay/Index'

export default {
    store,
    components: {
        Overlay,
        AppLayout,
        NoLayout,
    },
    computed: {
        layout() {
            return this.$store.getters.layout
        },
    },
}
</script>

<style lang="scss">
@import 'styles/main.scss';
</style>
