<template>
    <v-app id="vue-app">
        <div id="app">
            <sidebar />
            <v-content :style="`background-color: ${darkTheme ? '#121212' : '#ffffff'}`" id="page-wrap">
                <appbar v-if="user.token" />
                <snackbars v-if="user.token" />
                <router-view> </router-view>
            </v-content>
        </div>
    </v-app>
</template>

<script>
import store from 'store';
import Layouts from 'layouts';
import { mapGetters } from 'vuex';

export default {
    name: 'App',
    store,
    components: {
        ...Layouts,
    },
    computed: {
        ...mapGetters(['user', 'darkTheme']),
    },
};
</script>

<style lang="scss">
@import 'styles/main.scss';
@import 'styles/font.scss';
@import 'styles/constants.scss';
</style>
