<template>
    <v-row class="mt-0">
        <v-col class="pt-0" cols="12">
            <services-table :servicesData="servicesData" />
        </v-col>
    </v-row>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import ServicesTable from './ServicesTable'

export default {
    name: 'services',
    components: {
        ServicesTable,
    },
    computed: {
        ...mapGetters(['servicesData']),
    },
}
</script>
