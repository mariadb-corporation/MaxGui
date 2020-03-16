<template>
    <v-row class="mt-5">
        <v-col class="pt-0" cols="10">
            <services-table :servicesData="servicesData" />
        </v-col>
    </v-row>
</template>

<script>
import { mapGetters, mapState, mapActions } from 'vuex'
import ServicesTable from './ServicesTable'

export default {
    name: 'services',
    components: {
        ServicesTable,
    },
    computed: {
        ...mapGetters(['servicesData']),
        ...mapState(['darkTheme']),
    },
    created() {
        this.fetchServices()
    },
    methods: {
        ...mapActions(['fetchServices']),
    },
}
</script>
