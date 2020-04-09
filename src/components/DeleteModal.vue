<template>
    <span>
        <!-- Dialog activator -->
        <v-tooltip top>
            <template v-slot:activator="{ on }">
                <v-btn color="#eb5757" icon v-on="on" @click.stop="deleteDialog = true">
                    <v-icon size="16" color="#eb5757">
                        $vuetify.icons.delete
                    </v-icon>
                </v-btn>
            </template>
            <span> {{ $t(`${type}`) }}</span>
        </v-tooltip>
        <base-dialog
            v-model="deleteDialog"
            :onCancel="() => (deleteDialog = false)"
            :onSave="handleDelete"
            :title="title"
        >
            <template v-slot:body>
                <fragment>
                    <p>{{ $t(`confirmations.${type}`, { name: item.id }) }}</p>
                    <small>
                        {{ smallInfo }}
                    </small>
                </fragment>
            </template>

            <template v-slot:actions="{ cancel, save }">
                <v-btn
                    small
                    height="36"
                    color="primary"
                    class="font-weight-regular px-7 text-capitalize"
                    rounded
                    outlined
                    depressed
                    @click="cancel"
                >
                    {{ $t('cancel') }}
                </v-btn>
                <v-btn
                    small
                    height="36"
                    color="primary"
                    class="font-weight-regular px-7 text-capitalize"
                    rounded
                    depressed
                    @click="save"
                >
                    {{ $t(`${type}`) }}
                </v-btn>
            </template>
        </base-dialog>
    </span>
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
export default {
    name: 'delete-modal',
    props: {
        type: String, // delete or destroy
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
