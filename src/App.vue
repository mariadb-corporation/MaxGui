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

export default {
    store,
    components: {
        Overlay,
        AppLayout,
        NoLayout,
    },
}
</script>

<style lang="scss">
@import 'styles/main.scss';
</style>
