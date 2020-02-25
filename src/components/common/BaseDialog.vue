<template>
    <v-dialog v-model="computeShowDialog" :max-width="maxWidth">
        <v-card :outlined="darkTheme" :dark="darkTheme">
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
import { mapGetters } from 'vuex';

export default {
    name: 'base-dialog',
    props: {
        maxWidth: String,
        value: Boolean,
        onCancel: Function,
        onSave: Function,
    },
    computed: {
        ...mapGetters(['darkTheme']),
        computeShowDialog: {
            // get value from props
            get() {
                return this.value;
            },
            // set the value to show property in data
            set(value) {
                this.show = value;
                if (value === false) {
                    this.cancel();
                }
            },
        },
    },
    data() {
        return {
            show: false,
        };
    },
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
