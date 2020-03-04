<template>
    <v-row class="server-add">
        <v-col class="pt-0" cols="10">
            <servers-table :serversData="serversData" />
        </v-col>
    </v-row>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import ServersTable from './ServersTable';

export default {
    name: 'servers',
    components: {
        ServersTable,
    },
    computed: {
        ...mapGetters(['serversData', 'darkTheme']),
    },
    created() {
        this.fetchServers();
    },
    methods: {
        ...mapActions(['fetchServers']),
    },
};
</script>

<style lang="scss" scoped>
.server-add {
    margin-bottom: 60px;
}
</style>
