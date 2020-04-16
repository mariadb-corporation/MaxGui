<template>
    <span>
        <base-dialog
            v-model="computeShowDialog"
            :onCancel="closeModal"
            :onSave="handleDelete"
            :title="title"
            :saveText="type"
        >
            <template v-slot:body>
                <fragment>
                    <p>{{ $t(`confirmations.${type}`, { name: item.id }) }}</p>
                    <small>
                        {{ smallInfo }}
                    </small>
                </fragment>
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
        value: Boolean,
        type: String, // delete or destroy
        title: String,
        item: Object,
        dispatchDelete: Function,
        smallInfo: String,
        closeModal: Function,
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
        async handleDelete() {
            await this.dispatchDelete(this.item.id)
            this.closeModal()
        },
    },
}
</script>
