<template>
    <v-dialog v-model="value" persistent :max-width="maxWidth">
        <v-card>
            <slot name="body"> </slot>
            <v-card-actions>
                <v-spacer></v-spacer>
                <slot name="actions" :cancel="cancel" :save="save">
                    <v-btn color="blue darken-1" text @click="cancel" depressed>
                        Cancel
                    </v-btn>
                    <v-btn color="red" text @click="save" depressed>
                        Save
                    </v-btn>
                </slot>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
export default {
    name: 'base-dialog',
    props: {
        maxWidth: String,
        value: Boolean,
        onCancel: Function,
        onSave: Function,
    },
    // computed: {
    //     computeShowDialog: function() {
    //         return this.value;
    //     },
    // },
    methods: {
        cancel() {
            this.onCancel && this.onCancel();
        },
        save() {
            this.onSave && this.onSave();
        },
    },
};
</script>

<style lang="scss" scoped></style>
