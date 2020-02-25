<template>
    <v-card>
        <v-card-title>
            <h3>Servers</h3>
            <v-spacer />
            <v-text-field v-model="search" :append-icon="mdiMagnify" label="Search" single-line hide-details />
            <server-add />
        </v-card-title>

        <v-data-table
            :search="search"
            :loading="!generateTableRows.length"
            loading-text="Loading... Please wait"
            :headers="tableHeaders"
            :items="generateTableRows"
            class="data-table-full"
            sort-by="id"
            :single-expand="false"
            :expanded.sync="expanded"
            show-expand
        >
            <!-- <template v-slot:item.action="{ item }">
                <v-tooltip top>
                    <template v-slot:activator="{ on }">
                        <v-btn v-on="on" @click="$router.push(`/dashboard/${item.id}`)" text color="primary">
                            <v-icon medium>{{ mdiDotsHorizontal }}</v-icon>
                        </v-btn>
                    </template>
                    <span>View More</span>
                </v-tooltip>
            </template> -->
            <template v-slot:expanded-item="{ headers, item }">
                <td :colspan="headers.length"><server-info :id="item.id" /></td>
            </template>
            <template v-slot:item.data-table-expand="{ expand, isExpanded, item }">
                <div style="display:flex">
                    <server-update :item="item" />
                    <v-tooltip top>
                        <template v-slot:activator="{ on }">
                            <v-btn v-on="on" color="red" text @click="openDeleteDialog(item)">
                                <v-icon color="red" medium>{{ mdiDelete }}</v-icon>
                            </v-btn>
                        </template>
                        <span>Delete</span>
                    </v-tooltip>
                    <base-dialog
                        v-model="deleteDialog"
                        :onCancel="() => (deleteDialog = false)"
                        :onSave="handleDelete"
                        maxWidth="400px"
                    >
                        <template v-slot:body>
                            <v-card-title>
                                <span class="headline">Delete server</span>
                            </v-card-title>
                            <v-card-text>
                                <p>Are you sure you want to destroy {{ chosenId }} ?</p>
                                <small>
                                    Make sure it is not used by any services or monitors.
                                </small>
                            </v-card-text>
                        </template>
                        <template v-slot:actions="{ cancel, save }">
                            <v-btn color="blue " text @click="cancel" depressed>
                                Cancel
                            </v-btn>
                            <v-btn color="red" text @click="save" depressed>
                                Delete
                            </v-btn>
                        </template>
                    </base-dialog>
                    <v-tooltip top>
                        <template v-slot:activator="{ on }">
                            <v-btn v-on="on" v-if="!isExpanded" @click="expand(!isExpanded)" text color="primary">
                                <v-icon medium>{{ mdiChevronDown }}</v-icon>
                            </v-btn>
                            <v-btn v-else v-on="on" @click="expand(!isExpanded)" text color="primary">
                                <v-icon medium>{{ mdiChevronUp }}</v-icon>
                            </v-btn>
                        </template>
                        <span>View More</span>
                    </v-tooltip>
                </div>
            </template>
        </v-data-table>
    </v-card>
</template>

<script>
import { mdiDotsHorizontal, mdiChevronUp, mdiChevronDown, mdiMagnify, mdiDelete } from '@mdi/js';
import { mapActions } from 'vuex';
import ServerAdd from './ServerAdd';
import ServerUpdate from './ServerUpdate';
import ServerInfo from './ServerInfo';

export default {
    name: 'servers-table',
    components: {
        ServerAdd,
        ServerUpdate,
        ServerInfo,
    },
    props: {
        generateTableRows: Array,
    },
    data() {
        return {
            search: '',
            deleteDialog: false,
            mdiDotsHorizontal: mdiDotsHorizontal,
            mdiDelete: mdiDelete,
            mdiMagnify: mdiMagnify,
            mdiChevronUp: mdiChevronUp,
            mdiChevronDown: mdiChevronDown,
            chosenId: null,
            expanded: [],
            tableHeaders: [
                { text: 'Server', value: 'id' },
                { text: 'Address', value: 'address' },
                { text: 'Port', value: 'port' },
                { text: 'Connections', value: 'connections' },
                { text: 'State', value: 'state' },

                { text: 'Actions', align: 'center', value: 'data-table-expand', sortable: false },
            ],
        };
    },
    methods: {
        ...mapActions(['deleteServerById']),
        openDeleteDialog(item) {
            console.log('item', item);
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
};
</script>

<style lang="scss" scoped></style>
