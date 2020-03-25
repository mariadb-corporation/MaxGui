<template>
    <fragment>
        <top-header :user="user" />
        <navigation :currentPath="currentPath" />
        <snackbars />
        <v-content>
            <div class="fill-height v-content-padding">
                <div class="d-flex flex-wrap align-center">
                    <portal-target name="page-title">
                        <!--
                        This component can be located anywhere in your App.
                        The slot content of the above portal component will be rendered here.
                        -->
                    </portal-target>
                    <v-spacer />

                    <search-to-create :currentRoute="currentRoute" :tabRoutes="tabRoutes" />
                </div>

                <transition name="fade" mode="out-in">
                    <router-view v-if="$route.meta.requiresAuth" />
                </transition>
            </div>
        </v-content>
        <v-footer
            class="d-flex justify-center color border-top-reflection"
            color="white"
            padless
            app
            height="40"
            inset
        >
            <span class="footer-text color text-code-color">
                MariaDB Corporation | Copyright © 2019 MariaDB ab. All rights reserved. |
                <a target="_blank" rel="noopener" href="https://mariadb.com/privacy-policy/">
                    Privacy Policy</a
                >
                |
                <a
                    target="_blank"
                    rel="noopener"
                    href="https://mariadb.com/product-terms-condition/"
                    >Terms of Use</a
                >
            </span>
        </v-footer>
    </fragment>
</template>

<script>
import Navigation from './Navigation'
import Header from './Header'
import Snackbars from './Snackbars'
import { mapGetters } from 'vuex'
import { routes } from 'router/routes'

import tabRoutes from 'router/tabRoutes'
import SearchToCreate from 'components/SearchToCreate'

export default {
    name: 'app-layout',
    components: {
        SearchToCreate,
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
        ...mapGetters(['user', 'maxscaleDetails']),

        currentRoute: function() {
            return this.$route.name
        },

        // pageTitle: function() {
        //     let title = this.currentRoute
        //     if (title === 'dashboard') {
        //         let version = !this.$_.isUndefined(this.maxscaleDetails)
        //             ? this.maxscaleDetails.version
        //             : ''
        //         title = `MariaDB ${this.$t('productName')} ${version}`
        //     }
        //     if (!this.$_.isUndefined(this.$route.params.id)) {
        //         title = this.$route.params.id
        //     }

        //     return title
        // },
        currentPath: function() {
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
.footer-text {
    font-size: 10px;
    a {
        text-decoration: none;
    }
}
</style>
