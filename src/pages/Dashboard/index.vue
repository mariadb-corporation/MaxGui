<template>
    <v-container fluid class="server-padding">
        <v-row class="server-add" align="center" justify="center">
            <v-col cols="12" class="pt-0" :xs="12" :xl="7">
                <v-card>
                    <v-card-title>
                        Servers
                        <v-spacer></v-spacer>
                        <v-text-field
                            v-model="search"
                            :append-icon="mdiMagnify"
                            label="Search"
                            single-line
                            hide-details
                        ></v-text-field>
                    </v-card-title>

                    <v-data-table
                        :search="search"
                        :loading="!generateTableRows.length"
                        loading-text="Loading... Please wait"
                        :headers="tableHeaders"
                        :items="generateTableRows"
                        class="data-table-full"
                    >
                        <template v-slot:top> </template>
                        <template v-slot:item.action="{ item }">
                            <v-tooltip top>
                                <template v-slot:activator="{ on }">
                                    <v-btn
                                        v-on="on"
                                        @click="$router.push(`/dashboard/${item.id}`)"
                                        text
                                        color="primary"
                                    >
                                        <v-icon medium>{{ mdiDotsHorizontal }}</v-icon>
                                    </v-btn>
                                </template>
                                <span>View More</span>
                            </v-tooltip>
                            <v-tooltip top>
                                <template v-slot:activator="{ on }">
                                    <v-btn
                                        v-on="on"
                                        @click="$router.push(`/dashboard/${item.id}`)"
                                        text
                                        color="primary"
                                    >
                                        <v-icon medium>{{ mdiTableEdit }}</v-icon>
                                    </v-btn>
                                </template>
                                <span>Edit</span>
                            </v-tooltip>
                            <v-tooltip top>
                                <template v-slot:activator="{ on }">
                                    <v-btn v-on="on" color="red" text @click="openDeleteDialog(item)">
                                        <v-icon color="red" medium>{{ mdiDelete }}</v-icon>
                                    </v-btn>
                                </template>
                                <span>Delete</span>
                            </v-tooltip>
                        </template>
                    </v-data-table>
                    <v-dialog v-model="deleteDialog" max-width="400px">
                        <v-card>
                            <v-card-title>
                                <span class="headline">Delete server</span>
                            </v-card-title>
                            <v-card-text
                                ><p>Are you sure you want to delete{{ chosenId }} ?</p>
                            </v-card-text>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn color="blue darken-1" text @click="deleteDialog = false">Cancel</v-btn>
                                <v-btn color="red" text @click="handleDelete()">Delete</v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
                </v-card>
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
import ServerCard from './ServerCard';
import ServerCardAdd from './ServerCardAdd';
import ThreadsChartContainer from './ThreadsChartContainer';
import { mdiDotsHorizontal, mdiMagnify, mdiDelete, mdiTableEdit } from '@mdi/js';

export default {
    name: 'Dashboard',
    components: {
        ServerCardAdd,
        ServerCard,
        ThreadsChartContainer,
    },
    data() {
        return {
            search: '',
            deleteDialog: false,
            mdiDotsHorizontal: mdiDotsHorizontal,
            mdiDelete: mdiDelete,
            mdiTableEdit: mdiTableEdit,
            mdiMagnify: mdiMagnify,
            chosenId: null,
            tableHeaders: [
                { text: 'ID', value: 'id' },
                { text: 'STATE', value: 'state' },
                { text: 'PORT', value: 'port' },
                { text: 'URL', value: 'url' },
                { text: 'Actions', value: 'action', align: 'center', sortable: false },
            ],
        };
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
                    url: this.serversData[n].links.self,
                };
                itemsArr.push(row);
            }
            return itemsArr;
        },
    },
    methods: {
        ...mapActions([
            'deleteServerById',
            'fetchServers',
            'fetchThreadsAsync', // map `this.fetchThreadsAsync()` to `this.$store.dispatch('fetchThreadsAsync')`
        ]),
        ...mapMutations(['resetDestroyState']),
        openDeleteDialog(item) {
            this.deleteDialog = true;
            this.chosenId = item.id;
        },
        handleDelete() {
            this.deleteDialog = false;
            this.deleteServerById(this.chosenId);
            //clear
            this.chosenId = null;
        },
    },
    updated() {},
    created() {
        this.resetDestroyState();
        this.fetchServers();
        this.fetchThreadsAsync();
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
