<template>
    <span>
        <h1 class="text-navigation display-1 text-capitalize font-weight-light page-title">
            {{ currentRoute }}
        </h1>
        <v-tabs
            v-if="currentPath !== '/dashboard/maxscale' && currentPath.match(/^(\/dashboard\/?)\w+/g)"
            v-model="activeTab"
        >
            <v-tab
                class="color border-bottom-table-header"
                :to="route.path"
                v-for="route in tabRoutes"
                :key="route.path"
            >
                {{ route.name }}
            </v-tab>
            <v-tabs-items class="pt-5" v-model="activeTab">
                <v-tab-item v-for="route in tabRoutes" :key="route.name" :id="route.path">
                    <router-view v-if="activeTab === route.path" />
                </v-tab-item>
            </v-tabs-items>
            <v-tab-item id="/dashboard/servers">
                <router-view v-if="activeTab === '/dashboard/servers'" />
            </v-tab-item>
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
    props: {
        tabRoutes: Array,
        currentRoute: String,
    },
    data() {
        return {
            activeTab: '/dashboard/services',
        };
    },
    computed: {
        currentPath() {
            return this.$route.path;
        },
    },
};
</script>
