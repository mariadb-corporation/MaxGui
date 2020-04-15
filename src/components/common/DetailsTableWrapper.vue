<template>
    <fragment>
        <div class="mb-1 d-flex align-center">
            <div
                class="d-flex align-center"
                :class="{ pointer: $help.isFunction(onEdit) }"
                @mouseover="() => $help.isFunction(onEdit) && (showEdit = true)"
                @mouseleave="() => $help.isFunction(onEdit) && (showEdit = false)"
            >
                <v-btn icon class="arrow-toggle" @click="toggleOnClick">
                    <v-icon :class="[!toggleVal ? 'arrow-down' : 'arrow-up']" size="32">
                        $expand
                    </v-icon>
                </v-btn>
                <p class="mb-0 body-2 font-weight-bold color text-navigation text-uppercase">
                    {{ $t(title) }}
                    <span v-if="titleInfo" class="ml-1 color text-field-text">
                        ({{ titleInfo }})
                    </span>
                </p>
                <v-btn v-if="showEdit || editing" icon class="arrow-toggle" @click="onEdit">
                    <v-icon color="primary" size="18">
                        $vuetify.icons.edit
                    </v-icon>
                </v-btn>
            </div>
            <v-spacer />

            <v-btn
                v-if="editing"
                color="primary"
                rounded
                small
                class="text-capitalize"
                @click="doneEdit"
            >
                {{ $t('doneEditing') }}
            </v-btn>

            <v-btn
                v-if="onAddClick"
                color="primary"
                text
                x-small
                class="text-capitalize"
                @click="onAddClick"
            >
                + {{ $t(addBtnText) }}
            </v-btn>
        </div>
        <v-expand-transition>
            <div v-show="toggleVal">
                <slot name="table"></slot>
            </div>
        </v-expand-transition>
    </fragment>
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
/* eslint-disable no-console */
export default {
    /* SLOTS available for details-table-wrapper */
    // name="table"
    props: {
        // props for the toggle
        toggleOnClick: { type: Function, required: true },
        toggleVal: { type: Boolean, required: true },
        // props for the Title
        title: { type: String, required: true },
        titleInfo: [String, Number], // option
        // optional props for the + Add ... button
        onAddClick: Function,
        addBtnText: String,
        // props for editing
        onEdit: Function,
        editing: Boolean,
        doneEdit: Function,
    },
    data() {
        return {
            showEdit: false,
        }
    },
    watch: {
        onAddClick: {
            handler(value) {
                if (value && typeof this.addBtnText === 'undefined') {
                    console.error("property 'addBtnText' is required. ")
                }
            },
            immediate: true,
        },
    },
}
</script>

<style></style>
