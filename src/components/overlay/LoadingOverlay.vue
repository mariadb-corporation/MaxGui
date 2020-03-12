<style lang="scss" scoped>
@import 'styles/constants';
.text {
    color: $accent;
}
</style>

<template>
    <v-overlay :opacity="1" :absolute="true">
        <div class="overlay">
            <div class="overlay-content">
                <WelcomeMessage />
                <div class="loading-icon">
                    <img src="@/assets/icon-globe.svg" alt="MariaDB" />
                </div>
                <div class="text text-center">
                    {{ 'initializing' }}
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
