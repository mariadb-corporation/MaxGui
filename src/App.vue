<template>
    <v-app>
        <top-header :user="user" v-if="user && user.token" />
        <navigation v-if="user && user.token" />
        <snackbars v-if="user && user.token" />
        <v-content>
            <v-container v-if="user && user.token" fluid class="v-content-padding">
                <search-to-create />
                <h1 class="text-navigation display-1 text-capitalize font-weight-light page-title">
                    {{ currentRoute }}
                </h1>
                <v-tabs
                    style="margin-bottom:30px"
                    v-if="currentPath.includes('dashboard') && currentRoute !== 'dashboard'"
                >
                    <v-tab
                        class="color border-bottom-table-header"
                        :to="route.path"
                        v-for="route in slideRoute"
                        :key="route.path"
                    >
                        {{ route.name }}
                    </v-tab>
                </v-tabs>
                <transition name="slide-fade">
                    <router-view />
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

export default {
    name: 'App',
    store,
    components: {
        ...Layouts,
        SearchToCreate,
    },
    data() {
        return {
            items: routes,
        };
    },
    computed: {
        ...mapGetters(['user']),
        slideRoute: function() {
            return routes.filter(route => route.isSlideNav);
        },
        currentPath() {
            return this.$route.path;
        },
        currentRoute() {
            return this.$route.name;
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
    transition: all 0.6s ease;
}
// .slide-fade-leave-active {
//     transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
// }
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active below version 2.1.8 */ {
    transform: translateX(10px);
    opacity: 0;
}
</style>
