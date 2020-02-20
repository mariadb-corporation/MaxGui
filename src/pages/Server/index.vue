<template>
    <v-container v-if="currentServer" class="pa-6 attTable-padding">
        <v-row justify="center">
            <v-col cols="12" lg="6">
                <h2>Attributes</h2>
                <recursive-nested-collapse
                    v-for="(value, propertyName) in currentServer.attributes"
                    :readOnlyVal="!$help.hasChild(value)"
                    :key="propertyName"
                    :propertyName="propertyName"
                    :value="$help.handleNull(value)"
                    :child="!$help.hasChild(value) ? {} : value"
                />
            </v-col>
            <v-col cols="12" lg="6" v-if="!isEmpty(currentServer.relationships)">
                <h2>Relationships</h2>
                <recursive-nested-collapse
                    v-for="(value, propertyName) in currentServer.relationships"
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
import RecursiveNestedCollapse from "components/RecursiveNestedCollapse";
import { mapGetters, mapActions, mapMutations } from "vuex";
import { isEmpty } from "lodash";

export default {
    name: "Server",
    components: {
        "recursive-nested-collapse": RecursiveNestedCollapse
    },

    computed: {
        ...mapGetters(["currentServer"])
    },
    methods: {
        ...mapActions(["fetchServerById"]),
        isEmpty(obj) {
            return isEmpty(obj);
        }
    },
    created() {
        this.fetchServerById(this.$route.params.id);
    }
};
</script>

<style lang="scss" scoped>
h2 {
    text-align: center;
    margin-bottom: 20px;
}
</style>
