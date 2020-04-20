<template>
    <v-dialog
        v-model="computeShowDialog"
        overlay-color="#424F62"
        overlay-opacity="0.6"
        :max-width="maxWidth"
        content-class="base-dialog"
        persistent
    >
        <v-card class="v-card-custom">
            <v-card-title class="v-card-title_padding">
                <h3 class="font-weight-light color text-navigation ">
                    {{ title }}
                </h3>
                <v-btn class="close" icon @click="close">
                    <v-icon size="18" color="#424F62"> $vuetify.icons.close</v-icon>
                </v-btn>
            </v-card-title>
            <v-card-text class="v-card-text_padding">
                <slot name="body"></slot>
            </v-card-text>
            <v-card-actions class="v-card-actions_padding color border-top-reflection">
                <v-spacer></v-spacer>
                <slot :cancel="cancel" :save="save" name="actions">
                    <v-btn
                        small
                        height="36"
                        color="primary"
                        class="cancel font-weight-medium px-7 text-capitalize"
                        rounded
                        outlined
                        depressed
                        @click="cancel"
                    >
                        {{ $t(cancelText) }}
                    </v-btn>
                    <v-btn
                        small
                        height="36"
                        color="primary"
                        class="save font-weight-medium px-7 text-capitalize"
                        rounded
                        depressed
                        @click="save"
                    >
                        {{ $t(saveText) }}
                    </v-btn>
                </slot>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
/*
 * Copyright (c) 2020 MariaDB Corporation Ab
 *
 * Use of this software is governed by the Business Source License included
 * in the LICENSE.TXT file and at www.mariadb.com/bsl11.
 *
 * Change Date: 2024-07-01
 *
 * On the date above, in accordance with the Business Source License, use
 * of this software will be governed by version 2 or later of the General
 * Public License.
 */
import { mapMutations } from 'vuex'
import { OVERLAY_TRANSPARENT_LOADING } from 'store/overlayTypes'

export default {
    name: 'base-dialog',
    props: {
        maxWidth: { type: String, default: '466px' },
        title: String,
        value: Boolean,
        onClose: Function,
        onCancel: Function,
        onSave: Function,
        cancelText: { type: String, default: 'cancel' },
        saveText: { type: String, default: 'save' },
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
        close() {
            this.onClose && this.onClose()
        },

        async save() {
            let self = this
            if (self.onSave) {
                self.showOverlay(OVERLAY_TRANSPARENT_LOADING)
                await self.onSave()
                // wait time out for loading animation
                await setTimeout(() => {
                    self.hideOverlay()
                }, 600)
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
        right: 12px;
        svg.v-icon {
            width: 18px;
        }
    }
    $paddingLeft: 62px;
    .v-card-title_padding {
        padding: 52px $paddingLeft 20px;
    }
    .v-card-text_padding {
        padding: 0px $paddingLeft 48px;
    }
    .v-card-actions_padding {
        padding: 30px $paddingLeft 36px;
    }
}
</style>
