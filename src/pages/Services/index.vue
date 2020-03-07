<template>
    <v-row class="server-add">
        <v-col class="pt-0" cols="10">
            <services-table :servicesData="servicesData" />
        </v-col>
    </v-row>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import ServicesTable from './ServicesTable';

export default {
    name: 'services',
    components: {
        ServicesTable,
    },
    computed: {
        ...mapGetters(['servicesData', 'darkTheme']),
    },
    created() {
        this.fetchServices();
    },
    methods: {
        ...mapActions(['fetchServices']),
    },
};
</script>

<style lang="scss" scoped>
.server-add {
    margin-bottom: 60px;
}
</style>
