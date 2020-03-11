<template>
    <v-container v-if="getCurrentServer" class="">
        <v-row justify="center">
            <v-col cols="12">
                <h3>Attributes</h3>
                <recursive-nested-collapse
                    v-for="(value, propertyName) in getCurrentServer.attributes"
                    :key="propertyName"
                    :hasChild="$help.hasChild(value)"
                    :propertyName="propertyName"
                    :value="$help.handleNull(value)"
                    :child="$help.hasChild(value) ? value : {}"
                />
            </v-col>
            <v-col v-if="!isEmpty(getCurrentServer.relationships)" cols="12">
                <h3>Relationshis</h3>
                <recursive-nested-collapse
                    v-for="(value, propertyName) in getCurrentServer.relationships"
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
import RecursiveNestedCollapse from 'components/RecursiveNestedCollapse';
import { mapGetters } from 'vuex';
import { isEmpty, cloneDeep } from 'lodash';

export default {
    name: 'ServerRead',
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
