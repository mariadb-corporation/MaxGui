<template>
    <v-container fluid class="page-padding">
        <v-row justify="center">
            <v-col :xs="12" :xl="6" align="center" justify="center" class="pt-0">
                <v-card :outlined="darkTheme" :dark="darkTheme" width="100%" class="pa-6">
                    <h2 style="text-align:center">Last two second threads</h2>
                    <br />
                    <ThreadsChartContainer v-if="chartdata.datasets.length" />
                    <div v-else>
                        <p>Loading threads data</p>
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
    </v-container>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from 'vuex';
import ThreadsChartContainer from './ThreadsChartContainer';

export default {
    name: 'Statistics',
    components: {
        ThreadsChartContainer,
    },
    computed: {
        ...mapGetters(['chartdata', 'darkTheme']),
    },
    created() {
        this.resetDestroyState();
        this.fetchThreadsAsync();
    },
    methods: {
        ...mapActions([
            'fetchThreadsAsync', // map `this.fetchThreadsAsync()` to `this.$store.dispatch('fetchThreadsAsync')`
        ]),
        ...mapMutations(['resetDestroyState']),
    },
};
</script>
