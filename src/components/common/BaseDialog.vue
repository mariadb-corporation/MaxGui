<template>
    <v-dialog v-model="computeShowDialog" :max-width="maxWidth" content-class="base-dialog">
        <v-card class="v-card-custom">
            <v-card-title class="px-12 pt-10 pb-5">
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
import { mapMutations } from 'vuex'
import { OVERLAY_TRANSPARENT_LOADING } from 'store/overlayTypes'

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
        }
    },
    computed: {
        computeShowDialog: {
            // get value from props
            get() {
                return this.value
            },
            // set the value to show property in data
            set(value) {
                this.show = value
                if (value === false) {
                    this.cancel()
                }
            },
        },
    },

    methods: {
        ...mapMutations(['showMessage', 'showOverlay', 'hideOverlay']),
        cancel() {
            this.onCancel && this.onCancel()

            // unit event testing
            this.$emit('cancelClick', false)
        },
        async save() {
            if (this.onSave) {
                this.showOverlay(OVERLAY_TRANSPARENT_LOADING)
                await this.onSave()
                this.hideOverlay()
            }
        },
    },
}
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
