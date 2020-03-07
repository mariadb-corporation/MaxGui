<template>
    <v-dialog content-class="base-dialog" v-model="computeShowDialog" :max-width="maxWidth">
        <v-card :outlined="darkTheme" :dark="darkTheme">
            <v-card-title>
                <v-btn class="close" @click="cancel" large icon>
                    <v-icon color="#eb5757" class="fa fa-times-circle" medium />
                </v-btn>
                <slot name="title"> </slot>
            </v-card-title>
            <slot name="body"> </slot>
            <v-card-actions>
                <v-spacer></v-spacer>
                <slot name="actions" :cancel="cancel" :save="save">
                    <v-btn class="cancel" color="blue darken-1" text @click="cancel" depressed>
                        Cancel
                    </v-btn>
                    <v-btn class="save" color="red" text @click="save" depressed>
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
    data() {
        return {
            show: false,
        };
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

    methods: {
        cancel() {
            this.onCancel && this.onCancel();

            // unit event testing
            this.$emit('cancelClick', false);
        },
        save() {
            this.onSave && this.onSave();
        },
    },
};
</script>

<style lang="scss" scoped>
.base-dialog {
    .close {
        position: absolute;
        top: 15px;
        right: 15px;
    }
}
</style>
