<template>
    <v-container fluid class="server-padding">
        <v-row class="server-add" justify="center">
            <v-col cols="12" class="pt-0" :xs="12" :xl="7">
                <servers-table :generateTableRows="generateTableRows" />
            </v-col>
            <v-col cols="12" :xs="12" :xl="5" align="center" justify="center" class="pt-0">
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
import ServersTable from './ServersTable';

export default {
    name: 'Dashboard',
    components: {
        ThreadsChartContainer,
        ServersTable,
    },
    computed: {
        ...mapGetters(['serversData', 'chartdata', 'darkTheme']),
        /**
         * @return {Array} An array of objects
         */
        generateTableRows: function() {
            /**
             * @param {Array} itemsArr
             *  Elements are {Object} row
             */
            if (this.serversData) {
                let itemsArr = [];
                for (let n = 0; n < this.serversData.length; n++) {
                    /**
                     * @typedef {Object} row
                     * @property {String} id - Id of the server
                     * @property {String} address - Server's address
                     * @property {Number} port - Server's port
                     * @property {Number} connections - Number of connections to the server
                     * @property {String} state - Server's state
                     */
                    const {
                        id,
                        attributes: { state, parameters, statistics },
                    } = this.serversData[n];
                    let row = {
                        id: id,
                        address: parameters.address,
                        port: parameters.port,
                        connections: statistics.connections,
                        state: state,
                    };
                    itemsArr.push(row);
                }
                return itemsArr;
            }
            return [];
        },
    },
    created() {
        this.resetDestroyState();
        this.fetchServers();
        this.fetchThreadsAsync();
    },
    methods: {
        ...mapActions([
            'fetchServers',
            'fetchThreadsAsync', // map `this.fetchThreadsAsync()` to `this.$store.dispatch('fetchThreadsAsync')`
        ]),
        ...mapMutations(['resetDestroyState']),
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
