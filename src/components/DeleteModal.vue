<template>
    <span>
        <!-- Dialog activator -->
        <v-tooltip top>
            <template v-slot:activator="{ on }">
                <v-btn color="#eb5757" icon v-on="on" @click="deleteDialog = true">
                    <v-icon size="16" color="#eb5757">
                        $vuetify.icons.delete
                    </v-icon>
                </v-btn>
            </template>
            <span>Delete</span>
        </v-tooltip>
        <base-dialog
            v-model="deleteDialog"
            :onCancel="() => (deleteDialog = false)"
            :onSave="handleDelete"
            maxWidth="470px"
        >
            <template v-slot:title>
                <h3 style="font-weight:350" class="color text-navigation ">{{ title }}</h3>
            </template>

            <template v-slot:body>
                <fragment>
                    <p>Are you sure you want to destroy {{ item.id }} ?</p>
                    <small>
                        {{ smallInfo }}
                    </small>
                </fragment>
            </template>

            <template v-slot:actions="{ cancel, save }">
                <v-btn
                    small
                    color="primary"
                    class="px-5 text-capitalize"
                    rounded
                    outlined
                    depressed
                    @click="cancel"
                >
                    Cancel
                </v-btn>
                <v-btn
                    small
                    color="primary"
                    class="px-5 text-capitalize"
                    rounded
                    depressed
                    @click="save"
                >
                    Delete
                </v-btn>
            </template>
        </base-dialog>
    </span>
</template>

<script>
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
        }
    },
    methods: {
        handleDelete() {
            this.deleteDialog = false
            this.dispatchDelete(this.item.id)
        },
    },
}
</script>
