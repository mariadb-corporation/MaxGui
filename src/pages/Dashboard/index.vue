<template>
    <v-container fluid class="page-padding">
        <v-row class="server-add" justify="center">
            <v-col class="pt-0" :xs="12" :xl="6">
                <servers-table :serversData="serversData" />
            </v-col>
            <v-col class="pt-0" :xs="12" :xl="6">
                <services-table :servicesData="servicesData" />
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import ServersTable from './ServersTable';
import ServicesTable from './ServicesTable';

export default {
    name: 'Dashboard',
    components: {
        ServersTable,
        ServicesTable,
    },
    computed: {
        ...mapGetters(['serversData', 'servicesData', 'darkTheme']),
    },
    created() {
        this.fetchServers();
        this.fetchServices();
    },
    methods: {
        ...mapActions(['fetchServers', 'fetchServices']),
    },
};
</script>

<style lang="scss" scoped>
.server-add {
    margin-bottom: 60px;
}
</style>
