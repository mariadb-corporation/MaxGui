<template>
    <v-expansion-panels :readonly="readOnlyVal" accordion tile>
        <v-expansion-panel>
            <v-expansion-panel-header ripple>
                <b>{{ propertyName }}</b>
                {{ value }}
                <template v-slot:actions>
                    <v-icon color="primary">{{ readOnlyVal ? '' : '$expand' }}</v-icon>
                </template>
            </v-expansion-panel-header>

            <v-expansion-panel-content class="v-expansion-panel-content__scrollable" v-if="$help.hasChild(child)">
                <template v-if="childIsObj(child)">
                    <recursive-nested-collapse
                        v-for="(childValue, childPropertyName) in child"
                        :readOnlyVal="!$help.hasChild(childValue)"
                        :key="childPropertyName"
                        :propertyName="childPropertyName"
                        :value="$help.handleNull(childValue)"
                        :child="!$help.hasChild(childValue) ? {} : childValue"
                    />
                </template>
                <template v-else>
                    <styled-table :data="child"></styled-table>
                </template>
            </v-expansion-panel-content>
        </v-expansion-panel>
    </v-expansion-panels>
</template>

<script>
import StyledTable from 'components/StyledTable';

export default {
    /* This component intends to render nested objects. First level will be rendered first
    by providing propertyName props then value props
    The child props will detect whether render nested component or not
    */
    name: 'RecursiveNestedCollapse',
    props: {
        propertyName: [String, Number, Boolean],
        value: [String, Number, Boolean], // null object value has been handle by handleNull
        child: [Object, Array],
        readOnlyVal: Boolean,
    },
    components: { 'styled-table': StyledTable },

    methods: {
        childIsObj(child) {
            if (typeof child === 'object' && !Array.isArray(child)) {
                return true;
            }
            return false;
        },
    },
};
</script>
<style lang="scss" scoped>
.v-expansion-panel-content__scrollable {
    overflow: scroll;
    max-height: 240px;
    padding: 5px 0px;
}
</style>
