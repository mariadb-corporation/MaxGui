<template>
    <v-container v-if="getCurrentServer" class="">
        <v-row justify="center">
            <v-col cols="12" lg="6">
                <h3>Attributes</h3>
                <recursive-nested-collapse
                    v-for="(value, propertyName) in getCurrentServer.attributes"
                    :readOnlyVal="!$help.hasChild(value)"
                    :key="propertyName"
                    :propertyName="propertyName"
                    :value="$help.handleNull(value)"
                    :child="!$help.hasChild(value) ? {} : value"
                />
            </v-col>
            <v-col cols="12" lg="6" v-if="!isEmpty(getCurrentServer.relationships)">
                <h3>Relationships</h3>
                <recursive-nested-collapse
                    v-for="(value, propertyName) in getCurrentServer.relationships"
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
    name: 'server-read',
    components: {
        'recursive-nested-collapse': RecursiveNestedCollapse,
    },
    props: {
        id: String,
    },

    computed: {
        ...mapGetters(['serversDataMap']),
        /**
         * @returns {Object} A deep clone object from vuex state
         */
        getCurrentServer: function() {
            return cloneDeep(this.serversDataMap.get(this.id));
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
