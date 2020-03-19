<template>
    <fragment>
        <h4 class="text-left">Parameters</h4>
        <v-sheet max-width="600">
            <recursive-nested-collapse
                v-for="(value, propertyName) in genData()"
                :key="propertyName"
                :hasChild="$help.hasChild(value)"
                :propertyName="propertyName"
                :value="$help.handleNull(value)"
                :child="$help.hasChild(value) ? value : {}"
            />
        </v-sheet>
    </fragment>
</template>

<script>
import RecursiveNestedCollapse from 'components/RecursiveNestedCollapse'
import { mapGetters, mapActions } from 'vuex'

export default {
    name: 'max-scale',
    components: {
        RecursiveNestedCollapse,
    },

    data() {
        return {
            data: null,
        }
    },
    computed: {
        ...mapGetters(['maxscaleDetails']),
    },
    created() {
        !this.$route.params.parameters && this.fetchMaxScaleDetails()
    },
    methods: {
        ...mapActions(['fetchMaxScaleDetails']),
        genData() {
            if (this.$route.params.parameters) {
                return this.$_.cloneDeep(this.$route.params.parameters)
            }
            return this.$_.cloneDeep(this.maxscaleDetails.parameters)
        },
    },
}
</script>

<style scoped></style>
