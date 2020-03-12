<template>
    <v-row justify="center">
        <v-col :xs="12" :md="8" align="center" justify="center" class="pt-0">
            <v-card :outlined="darkTheme" :dark="darkTheme" width="100%" class="v-card-custom pa-6">
                <h2 style="text-align:center">{{ $t('lastTwoSecondsThreads') }}</h2>
                <br />
                <threads-chart-container v-if="chartdata.datasets.length" />
                <div v-else>
                    <p>{{ $t('loading.threadsData') }}</p>
                    <v-progress-linear
                        :dark="darkTheme"
                        color="primary accent-4"
                        indeterminate
                        rounded
                        height="6"
                    ></v-progress-linear>
                </div>
            </v-card>
        </v-col>
    </v-row>
</template>

<script>
import { mapGetters, mapState, mapActions, mapMutations } from 'vuex'
import ThreadsChartContainer from './ThreadsChartContainer'

export default {
    components: {
        ThreadsChartContainer,
    },
    computed: {
        ...mapGetters(['chartdata']),
        ...mapState(['darkTheme']),
    },
    created() {
        this.resetDestroyState()
        this.fetchThreadsAsync()
    },
    methods: {
        ...mapActions(['fetchThreadsAsync']),
        ...mapMutations(['resetDestroyState']),
    },
}
</script>
