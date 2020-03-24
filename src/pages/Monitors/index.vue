<template>
    <v-row class="mt-5">
        <v-col class="pt-0" cols="10">
            <monitors-table :allMonitors="allMonitors" />
        </v-col>
    </v-row>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import MonitorsTable from './MonitorsTable'

export default {
    name: 'servers',
    components: {
        MonitorsTable,
    },
    computed: {
        ...mapGetters(['allMonitors']),
    },
    created() {
        this.fetchAllMonitors()
    },
    methods: {
        ...mapActions(['fetchAllMonitors']),
    },
}
</script>
