<template>
    <v-app>
        <top-header :user="user" v-if="user && user.token" />
        <sidebar v-if="user && user.token" />
        <snackbars v-if="user && user.token" />
        <v-content>
            <router-view />
        </v-content>
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
        ...mapGetters(['user']),
    },
};
</script>

<style lang="scss">
@import 'styles/main.scss';
</style>
