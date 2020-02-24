<template>
    <v-container fluid class="server-padding">
        <v-row class="server-add" align="center" justify="center">
            <v-col cols="12" class="pt-0" :xs="12" :xl="7">
                <servers-table :generateTableRows="generateTableRows" />
            </v-col>

            <v-col cols="12" :xs="12" :xl="5" align="center" justify="center">
                <v-card width="100%" class="pa-6">
                    <h2 style="text-align:center">Last two second threads</h2>
                    <br />
                    <ThreadsChartContainer v-if="chartdata.datasets.length" />
                    <div v-else>
                        <p>Loading threads data</p>
                        <v-progress-linear
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
import ServersTable from './ServersTable';

export default {
    name: 'Dashboard',
    components: {
        ThreadsChartContainer,
        ServersTable,
    },
    computed: {
        ...mapGetters(['serversData', 'chartdata']),
        generateTableRows: function() {
            let itemsArr = [];
            for (let n = 0; n < this.serversData.length; n++) {
                let row = {
                    id: this.serversData[n].id,
                    state: this.serversData[n].attributes.state,
                    port: this.serversData[n].attributes.parameters.port,
                    address: this.serversData[n].attributes.parameters.address,
                };
                itemsArr.push(row);
            }
            return itemsArr;
        },
    },
    methods: {
        ...mapActions([
            'fetchServers',
            'fetchThreadsAsync', // map `this.fetchThreadsAsync()` to `this.$store.dispatch('fetchThreadsAsync')`
        ]),
        ...mapMutations(['resetDestroyState']),
    },
    created() {
        this.resetDestroyState();
        this.fetchServers();
        // this.fetchThreadsAsync();
    },
};
</script>

<style lang="scss" scoped>
.server-padding {
    padding: 40px 50px 0px;
}
.server-add {
    margin-bottom: 60px;
}
</style>
