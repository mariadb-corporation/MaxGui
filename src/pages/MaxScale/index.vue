<template>
    <v-container>
        <v-row>
            <v-col cols="12"> <h2 class="text-left">Parameters</h2></v-col>
        </v-row>
        <v-row>
            <v-col cols="7">
                <recursive-nested-collapse
                    v-for="(value, propertyName) in genData()"
                    :hasChild="$help.hasChild(value)"
                    :key="propertyName"
                    :propertyName="propertyName"
                    :value="$help.handleNull(value)"
                    :child="$help.hasChild(value) ? value : {}"
                />
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import RecursiveNestedCollapse from 'components/RecursiveNestedCollapse';
import { mapGetters, mapActions } from 'vuex';

export default {
    name: 'MaxScale',
    components: {
        RecursiveNestedCollapse,
    },

    data() {
        return {
            data: null,
        };
    },
    computed: {
        ...mapGetters(['maxscaleDetails']),
    },
    created() {
        !this.$route.params.parameters && this.fetchMaxScaleDetails();
    },
    methods: {
        ...mapActions(['fetchMaxScaleDetails']),
        genData() {
            if (this.$route.params.parameters) {
                return this.$help.deepClone(this.$route.params.parameters);
            }
            return this.$help.deepClone(this.maxscaleDetails.parameters);
        },
    },
};
</script>

<style scoped></style>
