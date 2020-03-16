<template>
    <v-overlay z-index="9999" :opacity="1" :absolute="true">
        <div class="overlay">
            <div class="overlay-content">
                <WelcomeMessage :greeting="$t('welcomeTo')" />
                <div class="loading-icon">
                    <img src="@/assets/icon-globe-error.svg" alt="MariaDB" class="loading-icon" />
                </div>
                <div class="color text-error text-center">
                    {{ 'serviceUnavailable' }} <br />
                    {{ 'refreshLater' }}
                </div>
            </div>
        </div>
    </v-overlay>
</template>

<script>
import WelcomeMessage from './WelcomeMessage'
export default {
    name: 'error-overlay',
    components: { WelcomeMessage },
}
</script>
