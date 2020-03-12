<style lang="scss" scoped>
@import 'styles/constants';

.text {
    color: $error;
}
</style>

<template>
    <v-overlay :opacity="1" :absolute="true">
        <div class="overlay">
            <div class="overlay-content">
                <WelcomeMessage />
                <div class="loading-icon">
                    <img src="@/assets/icon-globe-error.svg" alt="MariaDB" class="loading-icon" />
                </div>
                <div class="text text-center">
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
