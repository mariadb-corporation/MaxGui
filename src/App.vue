<template>
    <v-app>
        <top-header :user="user" v-if="user && user.token" />
        <navigation v-if="user && user.token" />
        <snackbars v-if="user && user.token" />
        <v-content>
            <v-container v-if="user && user.token" fluid class="v-content-padding">
                <search />
                <router-view />
            </v-container>
            <router-view v-else />
        </v-content>
    </v-app>
</template>

<script>
import store from 'store';
import Layouts from 'layouts';
import { mapGetters } from 'vuex';
import Search from 'components/Search';

export default {
    name: 'App',
    store,
    components: {
        ...Layouts,
        Search,
    },
    computed: {
        ...mapGetters(['user']),
    },
};
</script>

<style lang="scss">
@import 'styles/main.scss';
</style>
