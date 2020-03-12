<template>
    <v-app>
        <top-header v-if="user && user.token" :user="user" />
        <navigation v-if="user && user.token" />
        <snackbars v-if="user && user.token" />
        <overlay />
        <v-content v-if="user && user.token">
            <v-container fluid class="v-content-padding">
                <search-to-create
                    :isTabRoute="checkIsTabRoute()"
                    :currentRoute="currentRoute"
                    :tabRoutes="tabRoutes"
                />
                <h1 class="text-navigation display-1 text-capitalize page-title">
                    {{ currentRoute }}
                </h1>

                <TabNav :tabRoutes="tabRoutes" />
                <transition name="fade">
                    <router-view v-if="!checkIsTabRoute()" />
                </transition>
            </v-container>
        </v-content>
        <!-- Public routes -->
        <transition v-if="!user" name="fade">
            <router-view />
        </transition>
    </v-app>
</template>

<script>
import store from 'store'
import Layouts from 'layouts'
import { mapGetters } from 'vuex'
import SearchToCreate from 'components/SearchToCreate'
import { routes } from 'router/routes'
import TabNav from 'components/TabNav'
import tabRoutes from 'router/tabRoutes'
import Overlay from './components/overlay/Index'

export default {
    store,
    components: {
        ...Layouts,
        SearchToCreate,
        TabNav,
        Overlay,
    },
    data() {
        return {
            tabRoutes: tabRoutes,
        }
    },
    computed: {
        ...mapGetters(['user']),
        currentRoute() {
            return this.$route.name
        },
    },

    methods: {
        // check if currentRoute is a tabRoute
        checkIsTabRoute() {
            let arr = this.tabRoutes
            let isTabRoute = false
            for (let i = 0; i < arr.length; i++) {
                if (arr[i].name === this.currentRoute) {
                    isTabRoute = true
                }
            }
            return isTabRoute
        },
    },
}
</script>

<style lang="scss">
@import 'styles/main.scss';

.page-title {
    margin-bottom: 55px;
}
/* Enter and leave animations can use different */
/* durations and timing functions.              */

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}
.fade-enter,
.fade-leave-to {
    opacity: 0;
}
</style>
