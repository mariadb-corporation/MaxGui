<template>
    <v-container v-if="currentMonitor" fluid>
        <v-row>
            <v-col cols="6">
                <h5>Attributes</h5>
                <recursive-nested-collapse
                    v-for="(value, propertyName) in currentMonitor.attributes"
                    :key="propertyName"
                    :hasChild="$help.hasChild(value)"
                    :propertyName="propertyName"
                    :value="$help.handleNull(value)"
                    :child="$help.hasChild(value) ? value : {}"
                />
            </v-col>
            <v-col v-if="!$_.isEmpty(currentMonitor.relationships)" cols="6">
                <h5>Relationshis</h5>
                <recursive-nested-collapse
                    v-for="(value, propertyName) in currentMonitor.relationships"
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
    name: 'monitor-read',
    components: {
        'recursive-nested-collapse': RecursiveNestedCollapse,
    },
    computed: {
        ...mapGetters(['currentMonitor']),
    },
    created() {
        this.fetchMonitorById(this.$route.params.id)
    },
    methods: {
        ...mapActions(['fetchMonitorById']),
    },
}
</script>

<style lang="scss" scoped>
h5 {
    text-align: center;
    margin-bottom: 20px;
}
</style>
