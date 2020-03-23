<template>
    <v-container v-if="currentServer" fluid>
        <v-row>
            <v-col cols="6">
                <h5>Attributes</h5>
                <recursive-nested-collapse
                    v-for="(value, propertyName) in currentServer.attributes"
                    :key="propertyName"
                    :hasChild="$help.hasChild(value)"
                    :propertyName="propertyName"
                    :value="$help.handleNull(value)"
                    :child="$help.hasChild(value) ? value : {}"
                />
            </v-col>
            <v-col v-if="!$_.isEmpty(currentServer.relationships)" cols="6">
                <h5>Relationshis</h5>
                <recursive-nested-collapse
                    v-for="(value, propertyName) in currentServer.relationships"
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
import { mapGetters, mapActions } from 'vuex'

export default {
    name: 'server-read',
    components: {
        'recursive-nested-collapse': RecursiveNestedCollapse,
    },
    props: {
        id: String,
    },

    computed: {
        ...mapGetters(['currentServer']),
        // /**
        //  * @returns {Object} A deep clone object from vuex state
        //  */
        // getCurrentServer: function() {
        //     return this.$_.cloneDeep(this.serversDataMap.get(this.id))
        // },
    },
    created() {
        this.fetchServerById(this.$route.params.id)
    },
    methods: {
        ...mapActions(['fetchServerById']),
    },
}
</script>

<style lang="scss" scoped>
h5 {
    text-align: center;
    margin-bottom: 20px;
}
</style>
