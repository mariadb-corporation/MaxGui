<template>
    <span>
        <h1 class="text-navigation display-1 text-capitalize font-weight-light page-title">
            {{ currentRoute }}
        </h1>
        <v-tabs style="margin-bottom:30px" v-if="currentPath.includes('dashboard') && currentRoute !== 'dashboard'">
            <v-tab
                class="color border-bottom-table-header"
                :to="route.path"
                v-for="route in slideRoute"
                :key="route.path"
            >
                {{ route.name }}
            </v-tab>
        </v-tabs>
    </span>
</template>

<script>
import store from 'store';
import Layouts from 'layouts';
import { mapGetters } from 'vuex';
import SearchToCreate from 'components/SearchToCreate';
import { routes } from 'router/routes';

export default {
    name: 'TabNav',

    data() {
        return {
            items: routes,
        };
    },
    computed: {
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
