<template>
    <v-container v-if="getCurrentService" class="">
        <v-row justify="center">
            <v-col cols="12" >
                <h3>Attributes</h3>
                <recursive-nested-collapse
                    v-for="(value, propertyName) in getCurrentService.attributes"
                    :readOnlyVal="!$help.hasChild(value)"
                    :key="propertyName"
                    :propertyName="propertyName"
                    :value="$help.handleNull(value)"
                    :child="!$help.hasChild(value) ? {} : value"
                />
            </v-col>
            <v-col cols="12" v-if="!isEmpty(getCurrentService.relationships)">
                <h3>Relationships</h3>
                <recursive-nested-collapse
                    v-for="(value, propertyName) in getCurrentService.relationships"
                    :readOnlyVal="!$help.hasChild(value)"
                    :key="propertyName"
                    :propertyName="propertyName"
                    :value="$help.handleNull(value)"
                    :child="!$help.hasChild(value) ? {} : value"
                />
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import RecursiveNestedCollapse from 'components/RecursiveNestedCollapse';
import { mapGetters } from 'vuex';
import { isEmpty, cloneDeep } from 'lodash';

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
            return cloneDeep(this.servicesDataMap.get(this.id));
        },
    },
    methods: {
        isEmpty(obj) {
            return isEmpty(obj);
        },
        cloneDeep() {
            return cloneDeep();
        },
    },
};
</script>

<style lang="scss" scoped>
h3 {
    text-align: center;
    margin-bottom: 20px;
}
</style>
