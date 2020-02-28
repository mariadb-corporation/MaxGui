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
                <span class="headline">{{ title }}</span>
            </template>
            <template v-slot:body>
                <v-card-text>
                    <p>Are you sure you want to destroy {{ item.id }} ?</p>
                    <small style="color: #eb5757">
                        {{ smallInfo }}
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

export default {
    name: 'delete-modal',
    props: {
        title: String,
        item: Object,
        dispatchDelete: Function,
        smallInfo: String,
    },
    data() {
        return {
            deleteDialog: false,
            mdiDelete: mdiDelete,
        };
    },
    methods: {
        handleDelete() {
            this.deleteDialog = false;
            this.dispatchDelete(this.item.id);
        },
    },
};
</script>
