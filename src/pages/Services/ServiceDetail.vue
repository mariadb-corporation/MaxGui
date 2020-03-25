<template>
    <v-container v-if="currentService" fluid>
        <details-page-title />
        <v-row>
            <v-col cols="6">
                <h5>Attributes</h5>
                <recursive-nested-collapse
                    v-for="(value, propertyName) in currentService.attributes"
                    :key="propertyName"
                    :hasChild="$help.hasChild(value)"
                    :propertyName="propertyName"
                    :value="$help.handleNull(value)"
                    :child="$help.hasChild(value) ? value : {}"
                />
            </v-col>
            <v-col v-if="!$_.isEmpty(currentService.relationships)" cols="6">
                <h5>Relationships</h5>
                <fragment
                    v-for="(value, propertyName) in currentService.relationships"
                    :key="propertyName"
                >
                    <recursive-nested-collapse
                        v-if="propertyName !== 'services'"
                        :hasChild="$help.hasChild(value)"
                        :propertyName="propertyName"
                        :value="$help.handleNull(value)"
                        :child="$help.hasChild(value) ? value : {}"
                    />
                </fragment>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import RecursiveNestedCollapse from 'components/RecursiveNestedCollapse'
import { mapGetters, mapActions } from 'vuex'

export default {
    name: 'service-detail',
    components: {
        'recursive-nested-collapse': RecursiveNestedCollapse,
    },

    computed: {
        ...mapGetters(['currentService']),
        // /**
        //  * @returns {Object} A deep clone object from vuex state
        //  */
        // getCurrentService: function() {
        //     console.log('this.$route.params.id', this.$route.params.id)
        //     return this.$_.cloneDeep(this.servicesDataMap.get(this.$route.params.id))
        // },
    },
    created() {
        this.fetchServiceById(this.$route.params.id)
    },
    methods: {
        ...mapActions(['fetchServiceById']),
    },
}
</script>

<style lang="scss" scoped>
h5 {
    text-align: center;
    margin-bottom: 20px;
}
</style>
