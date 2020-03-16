<template>
    <v-app>
        <overlay />
        <template v-if="user && user.token">
            <top-header :user="user" />
            <navigation />
            <snackbars />
        </template>
        <v-content>
            <div class="fill-height" :class="[user && user.token ? 'v-content-padding' : '']">
                <search-to-create
                    v-if="user && user.token"
                    :isTabRoute="checkIsTabRoute()"
                    :currentRoute="currentRoute"
                    :tabRoutes="tabRoutes"
                />
                <h1
                    v-if="user && user.token"
                    class="text-navigation display-1 text-capitalize page-title"
                >
                    {{ currentRoute }}
                </h1>

                <TabNav :tabRoutes="tabRoutes" />
                <transition name="fade" mode="out-in">
                    <router-view />
                </transition>
            </div>
        </v-content>
    </v-app>
</template>

<script>
import store from 'store'
import Layouts from 'layouts'
import { mapGetters, mapMutations } from 'vuex'
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
        ...mapMutations(['showOverlay', 'hideOverlay']),

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
    transition-duration: 0.3s;
    transition-property: opacity;
    transition-timing-function: ease;
}

.fade-enter,
.fade-leave-active {
    opacity: 0;
}
</style>
