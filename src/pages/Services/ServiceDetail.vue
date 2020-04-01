<template>
    <v-container v-if="currentService" fluid>
        <details-page-title />
        <v-row>
            <v-col cols="6">
                <h5>Attributes</h5>
                <recursive-nested-collapse
                    v-for="(value, propertyName) in currentService.attributes"
                    :key="propertyName"
                    :hasChild="$help.hasChild(value)"
                    :propertyName="propertyName"
                    :value="$help.handleNull(value)"
                    :child="$help.hasChild(value) ? value : {}"
                />
            </v-col>
            <v-col v-if="!$_.isEmpty(currentService.relationships)" cols="6">
                <h5>Relationships</h5>
                <fragment
                    v-for="(value, propertyName) in currentService.relationships"
                    :key="propertyName"
                >
                    <recursive-nested-collapse
                        v-if="propertyName !== 'services'"
                        :hasChild="$help.hasChild(value)"
                        :propertyName="propertyName"
                        :value="$help.handleNull(value)"
                        :child="$help.hasChild(value) ? value : {}"
                    />
                </fragment>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
/*
 * Copyright (c) 2020 MariaDB Corporation Ab
 *
 * Use of this software is governed by the Business Source License included
 * in the LICENSE.TXT file and at www.mariadb.com/bsl11.
 *
 * Change Date: 2024-07-01
 *
 * On the date above, in accordance with the Business Source License, use
 * of this software will be governed by version 2 or later of the General
 * Public License.
 */
import RecursiveNestedCollapse from 'components/RecursiveNestedCollapse'
import { mapGetters, mapActions } from 'vuex'

export default {
    name: 'service-detail',
    components: {
        'recursive-nested-collapse': RecursiveNestedCollapse,
    },

    computed: {
        ...mapGetters(['currentService']),
        // /**
        //  * @returns {Object} A deep clone object from vuex state
        //  */
        // getCurrentService: function() {
        //     console.log('this.$route.params.id', this.$route.params.id)
        //     return this.$_.cloneDeep(this.allServicesMap.get(this.$route.params.id))
        // },
    },
    created() {
        this.fetchServiceById(this.$route.params.id)
    },
    methods: {
        ...mapActions(['fetchServiceById']),
    },
}
</script>

<style lang="scss" scoped>
h5 {
    text-align: center;
    margin-bottom: 20px;
}
</style>
