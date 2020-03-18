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
import { mapGetters } from 'vuex'

export default {
    name: 'overlay',
    components: {
        'error-overlay': ErrorOverlay,
        'loading-overlay': LoadingOverlay,
        'loading-transparent-overlay': LoadingTransparentOverlay,
        'logout-overlay': LogoutOverlay,
    },
    computed: {
        ...mapGetters(['overlay']),
        transparentLoading() {
            return this.overlay === OVERLAY_TRANSPARENT_LOADING
        },
        loading() {
            return this.overlay === OVERLAY_LOADING
        },
        logingOut() {
            return this.overlay === OVERLAY_LOGOUT
        },
        error() {
            return this.overlay === OVERLAY_ERROR
        },
    },
    watch: {
        overlay: function(newVal) {
            let body = document.getElementsByTagName('BODY')[0]
            if (newVal) {
                body.style.overflow = 'hidden'
            } else {
                body.style.overflow = 'initial'
            }
        },
    },
}
</script>
