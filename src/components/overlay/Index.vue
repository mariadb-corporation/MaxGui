<template>
    <fragment>
        <loading-transparent-overlay v-if="transparentLoading" />
        <v-fade-transition>
            <loading-overlay v-if="loading" />
        </v-fade-transition>
        <error-overlay v-if="error" />
    </fragment>
</template>

<script>
import { OVERLAY_LOADING, OVERLAY_ERROR, OVERLAY_TRANSPARENT_LOADING } from 'store/overlayTypes'
import ErrorOverlay from './ErrorOverlay'
import LoadingTransparentOverlay from './LoadingTransparentOverlay'
import LoadingOverlay from './LoadingOverlay'

export default {
    name: 'overlay',
    components: {
        'error-overlay': ErrorOverlay,
        'loading-overlay': LoadingOverlay,
        'loading-transparent-overlay': LoadingTransparentOverlay,
    },
    computed: {
        transparentLoading() {
            return this.$store.state.overlay === OVERLAY_TRANSPARENT_LOADING
        },
        loading() {
            return this.$store.state.overlay === OVERLAY_LOADING
        },
        error() {
            return this.$store.state.overlay === OVERLAY_ERROR
        },
    },
}
</script>
