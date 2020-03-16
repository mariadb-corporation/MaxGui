<template>
    <v-overlay z-index="9999" :opacity="1" :absolute="true">
        <div class="overlay">
            <div class="overlay-content">
                <WelcomeMessage :greeting="$t('welcomeTo')" />
                <div class="loading-icon">
                    <img src="@/assets/icon-globe.svg" alt="MariaDB" />
                </div>
                <div class="color text-accent text-center">
                    {{ $t('loggingOut') }}
                </div>
            </div>
        </div>
    </v-overlay>
</template>

<script>
import WelcomeMessage from './WelcomeMessage'
export default {
    name: 'load-overlay',
    components: { WelcomeMessage },
}
</script>
