<template>
    <span>
        <!-- Dialog activator -->
        <v-tooltip top>
            <template v-slot:activator="{ on }">
                <v-btn v-on="on" color="red" icon @click="openDeleteDialog(item)">
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
            <template v-slot:title>
                <v-card-title>
                    <span class="headline">Delete server</span>
                </v-card-title>
            </template>
            <template v-slot:body>
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
    </span>
</template>

<script>
import { mdiDelete } from '@mdi/js';
import { mapActions } from 'vuex';
export default {
    name: 'server-delete',
    props: {
        item: Object,
    },
    data() {
        return {
            deleteDialog: false,
            mdiDelete: mdiDelete,
            chosenId: null,
        };
    },
    methods: {
        ...mapActions(['deleteServerById']),
        /**
         * @param {Object} item server object get from table row
         */
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
