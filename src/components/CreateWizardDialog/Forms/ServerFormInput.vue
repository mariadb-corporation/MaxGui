<template>
    <div class="mb-2">
        <editable-parameters-collapse
            ref="parametersTable"
            :parameters="parameters"
            usePortOrSocket
            :parentForm="parentForm"
        />
    </div>
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
import EditableParametersCollapse from './common/EditableParametersCollapse'

export default {
    name: 'server-form-input',
    components: {
        EditableParametersCollapse,
    },
    props: {
        parentForm: { type: Object, required: true },
    },
    data() {
        return {
            // same format with module parameters, all default_value are returned as string
            parameters: [
                {
                    name: 'address',
                    type: 'string',
                },
                {
                    name: 'port',
                    type: 'count',
                },
                {
                    name: 'socket',
                    type: 'string',
                },
                {
                    name: 'monitoruser',
                    type: 'string',
                },
                {
                    name: 'monitorpw',
                    type: 'string',
                },
                {
                    name: 'extra_port',
                    type: 'count',
                },
                {
                    name: 'persistpoolmax',
                    type: 'int',
                    default_value: '0',
                },
                {
                    name: 'persistmaxtime',
                    type: 'duration',
                    default_value: '0s',
                },
                {
                    name: 'rank',
                    type: 'enum',
                    default_value: 'primary',
                    enum_values: ['primary', 'secondary'],
                },
            ],
        }
    },
    methods: {
        getValues() {
            return {
                parameters: this.$refs.parametersTable.getParameterObj(),
                relationships: {},
            }
        },
    },
}
</script>
