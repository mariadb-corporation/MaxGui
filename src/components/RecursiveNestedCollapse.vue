<template>
    <div>
        <v-expansion-panels :readonly="readOnlyVal" accordion tile>
            <v-expansion-panel>
                <v-expansion-panel-header>
                    <b>{{ propertyName }}</b>
                    {{ value }}
                    <template v-slot:actions>
                        <v-icon color="primary">{{
                            readOnlyVal ? "" : "$expand"
                        }}</v-icon>
                    </template>
                </v-expansion-panel-header>
                <v-expansion-panel-content
                    class="v-expansion-panel-content__scrollable"
                    v-if="hasChild(child)"
                >
                    <template v-if="childIsObj(child)">
                        <recursive-nested-collapse
                            v-for="(childValue, childPropertyName) in child"
                            :readOnlyVal="!hasChild(childValue)"
                            :key="childPropertyName"
                            :propertyName="childPropertyName"
                            :value="handleNull(childValue)"
                            :child="!hasChild(childValue) ? {} : childValue"
                        />
                    </template>
                    <template v-else>
                        <styled-table :data="child"></styled-table>
                    </template>
                </v-expansion-panel-content>
            </v-expansion-panel>
        </v-expansion-panels>
    </div>
</template>

<script>
import StyledTable from "components/StyledTable";

export default {
    name: "RecursiveNestedCollapse",
    props: {
        propertyName: [String, Number, Boolean],
        value: [String, Number, Boolean], // null object value has been handle by handleNull
        child: [Object, Array],
        readOnlyVal: Boolean
    },
    components: { "styled-table": StyledTable },

    data() {
        return {
            hasChild: this.$help.hasChild,
            handleNull: this.$help.handleNull
        };
    },
    methods: {
        childIsObj(child) {
            if (typeof child === "object" && !Array.isArray(child)) {
                return true;
            }
            return false;
        }
    }
};
</script>
<style lang="scss" scoped>
.v-expansion-panel-content__scrollable {
    overflow: scroll;
    max-height: 240px;
    padding: 5px 0px;
}
</style>
