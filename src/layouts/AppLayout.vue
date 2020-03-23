<template>
    <fragment>
        <top-header :user="user" />
        <navigation :currentRoute="currentRoute" :currentPath="currentPath" />
        <snackbars />
        <v-content>
            <div class="fill-height v-content-padding">
                <div v-show="checkIsTabRoute() || currentRoute === 'dashboard'">
                    <search-to-create
                        :isTabRoute="checkIsTabRoute()"
                        :currentRoute="currentRoute"
                        :tabRoutes="tabRoutes"
                    />
                </div>
                <h1 class="text-navigation display-1 text-capitalize page-title">
                    {{ currentRoute }}
                    {{ $_.isUndefined($route.params.id) ? '' : $route.params.id }}
                </h1>

                <TabNav
                    v-if="
                        currentPath !== '/dashboard/maxscale' &&
                            currentPath.match(/^(\/dashboard\/?)\w+/g)
                    "
                    :tabRoutes="tabRoutes"
                />
                <transition name="fade" mode="out-in">
                    <router-view v-if="$route.meta.requiresAuth" />
                </transition>
            </div>
        </v-content>
    </fragment>
</template>

<script>
import Navigation from './Navigation'
import Header from './Header'
import Snackbars from './Snackbars'
import { mapGetters } from 'vuex'
import { routes } from 'router/routes'
import TabNav from 'components/TabNav'
import tabRoutes from 'router/tabRoutes'
import SearchToCreate from 'components/SearchToCreate'

export default {
    name: 'app-layout',
    components: {
        SearchToCreate,
        TabNav,
        navigation: Navigation,
        'top-header': Header,
        snackbars: Snackbars,
    },
    data() {
        return {
            tabRoutes: tabRoutes,
        }
    },
    computed: {
        ...mapGetters(['user']),
        currentRoute() {
            console.log('isTabRoute', this.$route.name === 'dashboard')
            return this.$route.name
        },
        currentPath() {
            return this.$route.path
        },
    },
    methods: {
        // check if currentRoute is a tabRoute
        checkIsTabRoute() {
            let arr = this.tabRoutes
            let isTabRoute = false
            for (let i = arr.length - 1; i >= 0; --i) {
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
.page-title {
    margin-bottom: 55px;
}
/* Enter and leave animations can use different */
/* durations and timing functions.              */
.fade-enter-active,
.fade-leave-active {
    transition-duration: 0.2s;
    transition-property: opacity;
    transition-timing-function: ease;
}

.fade-enter,
.fade-leave-active {
    opacity: 0;
}
</style>
