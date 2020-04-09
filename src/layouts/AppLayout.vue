<template>
    <fragment>
        <top-header :user="user" />
        <navigation :currentPath="currentPath" />
        <snackbars />
        <v-content>
            <div class="fill-height v-content-padding">
                <div class="d-flex ml-n1">
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
            class="pl-2 d-flex justify-center color border-top-reflection"
            color="white"
            padless
            app
            height="40"
            inset
        >
            <span class=" footer-text color text-code-color align-center text-truncate">
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
/*
 * Copyright (c) 2020 MariaDB Corporation Ab
 *
 * Use of this software is governed by the Business Source License included
 * in the LICENSE.TXT file and at www.mariadb.com/bsl11.
 *
 * Change Date: 2024-07-01
 *
 * On the date above, in accordance with the Business Source License, use
 * of this software will be governed by version 2 or later of the General
 * Public License.
 */
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
        ...mapGetters('user', ['user']),

        currentRoute: function() {
            return this.$route.name
        },

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

.footer-text {
    font-size: 10px;
    a {
        text-decoration: none;
    }
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
