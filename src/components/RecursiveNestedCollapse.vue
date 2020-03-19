<template>
    <v-expansion-panels
        :class="[hasChild ? '' : 'no-pointer']"
        :readonly="!hasChild"
        accordion
        tile
    >
        <v-expansion-panel>
            <v-expansion-panel-header v-if="propertyName !== 'links'" :ripple="hasChild">
                <b>{{ propertyName }}</b>
                <fragment v-if="!hasChild">
                    {{ $help.handleEmptyString(value) }}
                </fragment>
                <template v-slot:actions>
                    <v-icon size="24" color="primary">{{ hasChild ? '$expand' : '' }}</v-icon>
                </template>
            </v-expansion-panel-header>

            <v-expansion-panel-content
                v-if="$help.hasChild(child)"
                class="v-expansion-panel-content__scrollable"
            >
                <fragment v-if="childIsObj(child) || propertyName === 'listeners'">
                    <recursive-nested-collapse
                        v-for="(childValue, childPropertyName) in child"
                        :key="childPropertyName"
                        :hasChild="$help.hasChild(childValue)"
                        :propertyName="childPropertyName"
                        :value="$help.handleNull(childValue)"
                        :child="$help.hasChild(childValue) ? childValue : {}"
                    />
                </fragment>
                <fragment v-else>
                    <compute-table :data="child" />
                </fragment>
            </v-expansion-panel-content>
        </v-expansion-panel>
    </v-expansion-panels>
</template>

<script>
import ComputeTable from 'components/ComputeTable'

export default {
    /* This component intends to render nested objects. First level of the object will be rendered first
    by providing propertyName props then value props
    The child props will detect whether render nested component or not
    */
    name: 'recursive-nested-collapse',
    components: { 'compute-table': ComputeTable },
    props: {
        propertyName: [String, Number, Boolean],
        value: [String, Number, Boolean], // null object value has been handle by handleNull
        child: [Object, Array],
        hasChild: Boolean,
        index: Number,
    },

    methods: {
        childIsObj(child) {
            if (typeof child === 'object' && !Array.isArray(child)) {
                return true
            }
            return false
        },
    },
}
</script>
<style lang="scss" scoped>
.v-expansion-panel-content__scrollable {
    overflow: scroll;
    max-height: 500px;
    padding: 5px 0px;
}
</style>
