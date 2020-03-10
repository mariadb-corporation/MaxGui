<template>
    <v-tabs
        v-if="currentPath !== '/dashboard/maxscale' && currentPath.match(/^(\/dashboard\/?)\w+/g)"
        v-model="activeTab"
    >
        <v-tab
            class="color border-bottom-table-header"
            :to="route.path"
            v-for="route in tabRoutesFilter"
            :key="route.path"
        >
            {{ route.name }}
        </v-tab>
        <v-tabs-items class="pt-5" v-model="activeTab">
            <v-tab-item v-for="route in tabRoutesFilter" :key="route.name" :id="route.path">
                <router-view v-if="activeTab === route.path" />
            </v-tab-item>
        </v-tabs-items>
        <v-tab-item id="/dashboard/servers">
            <router-view v-if="activeTab === '/dashboard/servers'" />
        </v-tab-item>
    </v-tabs>
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
    },
    data() {
        return {
            activeTab: '/dashboard/services',
        };
    },
    computed: {
        ...mapGetters(['searchKeyWord']),
        currentPath() {
            return this.$route.path;
        },
        tabRoutesFilter() {
            let self = this;
            let filteredData = this.tabRoutes.filter(obj => obj.name.includes(self.searchKeyWord));
            return filteredData;
        },
    },
};
</script>
