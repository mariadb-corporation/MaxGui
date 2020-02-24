<template>
    <v-card>
        <v-card-title>
            Servers
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
        >
            <template v-slot:item.action="{ item }">
                <v-tooltip top>
                    <template v-slot:activator="{ on }">
                        <v-btn v-on="on" @click="$router.push(`/dashboard/${item.id}`)" text color="primary">
                            <v-icon medium>{{ mdiDotsHorizontal }}</v-icon>
                        </v-btn>
                    </template>
                    <span>View More</span>
                </v-tooltip>

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
                            <p>Are you sure you want to delete{{ chosenId }} ?</p>
                        </v-card-text>
                    </template>
                    <template v-slot:actions="{ cancel, save }">
                        <v-btn color="blue darken-1" text @click="cancel" depressed>
                            Cancel
                        </v-btn>
                        <v-btn color="red" text @click="save" depressed>
                            Delete
                        </v-btn>
                    </template>
                </base-dialog>
            </template>
        </v-data-table>
    </v-card>
</template>

<script>
import { mdiDotsHorizontal, mdiMagnify, mdiDelete, mdiTableEdit } from '@mdi/js';
import { mapActions } from 'vuex';
import ServerAdd from './ServerAdd';
import ServerUpdate from './ServerUpdate';

export default {
    name: 'servers-table',
    components: {
        ServerAdd,
        ServerUpdate,
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
            mdiTableEdit: mdiTableEdit,
            mdiMagnify: mdiMagnify,
            chosenId: null,
            tableHeaders: [
                { text: 'ID', value: 'id' },
                { text: 'STATE', value: 'state' },
                { text: 'PORT', value: 'port' },
                { text: 'Address', value: 'address' },
                { text: 'Actions', value: 'action', align: 'center', sortable: false },
            ],
        };
    },
    methods: {
        ...mapActions(['deleteServerById']),
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
};
</script>

<style lang="scss" scoped></style>
