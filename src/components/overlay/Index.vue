<template>
    <v-fade-transition>
        <component :is="currentOverLay" :key="overlay" />
    </v-fade-transition>
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
    computed: {
        ...mapGetters(['overlay']),
        currentOverLay: function() {
            switch (this.overlay) {
                case OVERLAY_TRANSPARENT_LOADING:
                    return LoadingTransparentOverlay
                case OVERLAY_LOADING:
                    return LoadingOverlay
                case OVERLAY_LOGOUT:
                    return LogoutOverlay
                case OVERLAY_ERROR:
                    return ErrorOverlay
                default:
                    return false
            }
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
