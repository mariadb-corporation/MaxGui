<template>
    <fragment>
        <loading-transparent-overlay v-if="transparentLoading" />
        <v-fade-transition>
            <loading-overlay v-if="loading" />
        </v-fade-transition>
        <v-fade-transition>
            <logout-overlay v-if="logingOut" />
        </v-fade-transition>
        <v-fade-transition>
            <error-overlay v-if="error" />
        </v-fade-transition>
    </fragment>
</template>

<script>
import {
    OVERLAY_LOGOUT,
    OVERLAY_LOADING,
    OVERLAY_ERROR,
    OVERLAY_TRANSPARENT_LOADING,
} from 'store/overlayTypes'
import ErrorOverlay from './ErrorOverlay'
import LoadingTransparentOverlay from './LoadingTransparentOverlay'
import LoadingOverlay from './LoadingOverlay'
import LogoutOverlay from './LogoutOverlay'

export default {
    name: 'overlay',
    components: {
        'error-overlay': ErrorOverlay,
        'loading-overlay': LoadingOverlay,
        'loading-transparent-overlay': LoadingTransparentOverlay,
        'logout-overlay': LogoutOverlay,
    },
    computed: {
        transparentLoading() {
            return this.$store.state.overlay === OVERLAY_TRANSPARENT_LOADING
        },
        loading() {
            return this.$store.state.overlay === OVERLAY_LOADING
        },
        logingOut() {
            return this.$store.state.overlay === OVERLAY_LOGOUT
        },
        error() {
            return this.$store.state.overlay === OVERLAY_ERROR
        },
    },
}
</script>
