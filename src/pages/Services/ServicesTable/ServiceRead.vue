<template>
    <v-container v-if="getCurrentService" class="">
        <v-row justify="center">
            <v-col cols="12">
                <h5>Attributes</h5>
                <recursive-nested-collapse
                    v-for="(value, propertyName) in getCurrentService.attributes"
                    :key="propertyName"
                    :hasChild="$help.hasChild(value)"
                    :propertyName="propertyName"
                    :value="$help.handleNull(value)"
                    :child="$help.hasChild(value) ? value : {}"
                />
            </v-col>
            <v-col v-if="!$_.isEmpty(getCurrentService.relationships)" cols="12">
                <h5>Relationships</h5>
                <recursive-nested-collapse
                    v-for="(value, propertyName) in getCurrentService.relationships"
                    :key="propertyName"
                    :hasChild="$help.hasChild(value)"
                    :propertyName="propertyName"
                    :value="$help.handleNull(value)"
                    :child="$help.hasChild(value) ? value : {}"
                />
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import RecursiveNestedCollapse from 'components/RecursiveNestedCollapse'
import { mapGetters } from 'vuex'

export default {
    name: 'service-read',
    components: {
        'recursive-nested-collapse': RecursiveNestedCollapse,
    },
    props: {
        id: String,
    },

    computed: {
        ...mapGetters(['servicesDataMap']),
        /**
         * @returns {Object} A deep clone object from vuex state
         */
        getCurrentService: function() {
            return this.$_.cloneDeep(this.servicesDataMap.get(this.id))
        },
    },
}
</script>

<style lang="scss" scoped>
h5 {
    text-align: center;
    margin-bottom: 20px;
}
</style>
