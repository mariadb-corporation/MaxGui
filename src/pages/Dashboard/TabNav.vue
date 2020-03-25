<template>
    <v-tabs v-model="activeTab">
        <v-tab
            v-for="route in tabRoutes"
            :key="route.path"
            :to="route.path"
            class="color border-bottom-table-header "
        >
            {{ route.name }}
        </v-tab>
        <v-tabs-items v-model="activeTab">
            <v-tab-item v-for="route in tabRoutes" :id="route.path" :key="route.name" class="pt-5">
                <router-view v-if="activeTab === route.path" />
            </v-tab-item>
        </v-tabs-items>
    </v-tabs>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
    name: 'tab-nav',
    props: {
        tabRoutes: Array,
    },
    data() {
        return {
            activeTab: '/dashboard/servers',
        }
    },
    computed: {
        ...mapGetters(['searchKeyWord']),

        // tabRoutesFilter() {
        //     let self = this
        //     // let filteredData = this.tabRoutes.filter(obj => obj.name.includes(self.searchKeyWord))
        //     let filteredData = this.tabRoutes.filter(obj => !obj.name === 'dashboardHome')

        //     return filteredData
        // },
    },
    watch: {
        $route: function(to, from) {
            console.log('to', to)
            this.activeTab = to
        },
    },
}
</script>
