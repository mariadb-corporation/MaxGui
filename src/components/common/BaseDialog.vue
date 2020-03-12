<template>
    <v-dialog v-model="computeShowDialog" :max-width="maxWidth" content-class="base-dialog">
        <v-card :outlined="darkTheme" :dark="darkTheme" class="v-card-custom">
            <v-card-title class="px-12 pt-10 pb-7">
                <v-btn class="close" icon @click="cancel">
                    <v-icon size="18"> $vuetify.icons.close</v-icon>
                </v-btn>
                <slot name="title"> </slot>
            </v-card-title>
            <v-card-text class="px-12 pb-7">
                <slot name="body"></slot>
            </v-card-text>
            <v-card-actions class="px-12 pt-7 pb-8 color border-top-reflection">
                <v-spacer></v-spacer>
                <slot :cancel="cancel" :save="save" name="actions">
                    <v-btn class="cancel" color="primary" outlined depressed @click="cancel">
                        Cancel
                    </v-btn>
                    <v-btn class="save" color="primary" depressed @click="save">
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
    name: 'BaseDialog',
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
        top: 12px;
        right: 18px;
    }
}
</style>
