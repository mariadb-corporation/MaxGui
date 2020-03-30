<template>
    <v-row justify="center">
        <v-col :xs="12" :md="8" align="center" justify="center" class="pt-0">
            <v-card width="100%" class="v-card-custom pa-6">
                <h2 style="text-align:center">{{ $t('lastTwoSecondsThreads') }}</h2>
                <br />
                <threads-chart v-if="threadsChartData.datasets.length" />
                <div v-else>
                    <p>{{ $t('loading.threadsData') }}</p>
                    <v-progress-linear color="primary accent-4" indeterminate rounded height="6" />
                </div>
            </v-card>
        </v-col>
    </v-row>
</template>

<script>
import { mapGetters, mapState, mapActions, mapMutations } from 'vuex'
import ThreadsChart from './ThreadsChart'

export default {
    components: {
        ThreadsChart,
    },
    computed: {
        ...mapGetters(['threadsChartData']),
    },
    async created() {
        await this.fetchThreads()
    },
    methods: {
        ...mapActions(['fetchThreads']),
    },
}
</script>
