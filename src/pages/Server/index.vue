<template>
    <v-container v-if="currentServer" class="pa-6 attTable-padding">
        <h3>{{ this.$route.params.id }} Attributes</h3>
        <v-row align="center" justify="center">
            <v-col cols="12" lg="6">
                <recursive-nested-collapse
                    v-for="(value, propertyName) in currentServer.attributes"
                    :readOnlyVal="!hasChild(value)"
                    :key="propertyName"
                    :propertyName="propertyName"
                    :value="handleNull(value)"
                    :child="!hasChild(value) ? {} : value"
                />
            </v-col>
        </v-row>
        <br />
        <h3>{{ this.$route.params.id }} Relationships</h3>
        <v-row align="center" justify="center">
            <v-col cols="12" lg="6">
                <recursive-nested-collapse
                    v-for="(value, propertyName) in currentServer.relationships"
                    :readOnlyVal="!hasChild(value)"
                    :key="propertyName"
                    :propertyName="propertyName"
                    :value="handleNull(value)"
                    :child="!hasChild(value) ? {} : value"
                />
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import RecursiveNestedCollapse from "components/RecursiveNestedCollapse";

export default {
    name: "Server",
    components: {
        "recursive-nested-collapse": RecursiveNestedCollapse
    },
    data() {
        return {
            currentServer: null,
            hasChild: this.$help.hasChild,
            handleNull: this.$help.handleNull
        };
    },
    mounted() {
        let credentials = JSON.parse(localStorage.getItem("credentials"));
        this.axios
            .get(`/v1/servers/${this.$route.params.id}`, {
                auth: credentials
            })
            .then(res => (this.currentServer = res.data.data));
    }
};
</script>

<style lang="scss" scoped>
h3 {
    text-align: center;
}
</style>
