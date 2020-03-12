<template>
    <v-row>
        <v-col class="pt-0" cols="10">
            <servers-table :serversData="serversData" />
        </v-col>
    </v-row>
</template>

<script>
import { mapGetters, mapState, mapActions } from 'vuex'
import ServersTable from './ServersTable'

export default {
    name: 'servers',
    components: {
        ServersTable,
    },
    computed: {
        ...mapGetters(['serversData']),
        ...mapState(['darkTheme']),
    },
    created() {
        this.fetchServers()
    },
    methods: {
        ...mapActions(['fetchServers']),
    },
}
</script>
