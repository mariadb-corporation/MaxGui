<template>
    <span>
        <!-- Dialog activator -->
        <v-tooltip top>
            <template v-slot:activator="{ on }">
                <v-btn v-on="on" color="#eb5757" icon @click="deleteDialog = true">
                    <v-icon color="#eb5757" medium>{{ mdiDelete }}</v-icon>
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
                    <p>Are you sure you want to destroy {{ item.id }} ?</p>
                    <small style="color: #eb5757">
                        Make sure it is not used by any services or monitors.
                    </small>
                </v-card-text>
            </template>
            <template v-slot:actions="{ cancel, save }">
                <v-btn color="blue " text @click="cancel" depressed>
                    Cancel
                </v-btn>
                <v-btn color="#eb5757" text @click="save" depressed>
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
        };
    },
    methods: {
        ...mapActions(['deleteServerById']),

        handleDelete() {
            this.deleteDialog = false;
            this.deleteServerById(this.item.id);
        },
    },
};
</script>
