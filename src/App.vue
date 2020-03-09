<template>
    <v-app>
        <top-header :user="user" v-if="user && user.token" />
        <navigation v-if="user && user.token" />
        <snackbars v-if="user && user.token" />
        <v-content>
            <v-container v-if="user && user.token" fluid class="v-content-padding">
                <search-to-create />
                <TabNav :slideRoutes="slideRoutes" :currentRoute="currentRoute" />
                <transition name="slide-fade">
                    <router-view v-if="!checkIsSlideNav()" />
                </transition>
            </v-container>

            <router-view v-else />
        </v-content>
    </v-app>
</template>

<script>
import store from 'store';
import Layouts from 'layouts';
import { mapGetters } from 'vuex';
import SearchToCreate from 'components/SearchToCreate';
import { routes } from 'router/routes';
import TabNav from 'components/TabNav';

export default {
    name: 'App',
    store,
    components: {
        ...Layouts,
        SearchToCreate,
        TabNav,
    },
    computed: {
        ...mapGetters(['user']),
        currentRoute() {
            return this.$route.name;
        },
        slideRoutes: function() {
            return routes.filter(route => route.isSlideNav);
        },
    },

    methods: {
        checkIsSlideNav() {
            let arr = this.slideRoutes;
            let isSlideNav = false;
            for (let i = 0; i < arr.length; i++) {
                if (arr[i].name === this.currentRoute) {
                    isSlideNav = true;
                }
            }
            return isSlideNav;
        },
    },
};
</script>

<style lang="scss">
@import 'styles/main.scss';
.page-title {
    margin-bottom: 55px;
}
/* Enter and leave animations can use different */
/* durations and timing functions.              */
.slide-fade-enter-active {
    transition: all 0.2s ease;
}
.slide-fade-leave-active {
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active below version 2.1.8 */ {
    opacity: 0;
}
</style>
