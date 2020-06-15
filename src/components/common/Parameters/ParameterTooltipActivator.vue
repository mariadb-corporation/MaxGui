<template>
    <fragment>
        <span
            v-if="
                'type' in item || 'description' in item || 'unit' in item || 'default_value' in item
            "
            :id="`param-${item.id}_${componentId}`"
            class="pointer"
        >
            {{ item.id }}
        </span>
        <span v-else>
            {{ item.id }}
        </span>
    </fragment>
</template>

<script>
/*
 * Copyright (c) 2020 MariaDB Corporation Ab
 *
 * Use of this software is governed by the Business Source License included
 * in the LICENSE.TXT file and at www.mariadb.com/bsl11.
 *
 * Change Date: 2024-06-15
 *
 * On the date above, in accordance with the Business Source License, use
 * of this software will be governed by version 2 or later of the General
 * Public License.
 */

/*
This component allows to edit parameters taken from parameters array that must have similar format to
module parameters. All default_values will be returned as string regardless of type
The component is meant to be used for creating resource

PROPS:
_requiredParams: accepts array of string , it simply enables required attribute in parameter-input dynamically
_usePortOrSocket: accepts boolean , if true, get portValue, addressValue, and socketValue, 
passing them to parameter-input for handling special input field when editting server or listener. 
If editing listener, addressValue will be null
_isListener: accepts boolean , if true, address won't be required
*/
export default {
    name: 'parameter-tooltip-activator',
    props: {
        item: { type: Object, required: true },
        componentId: { type: String, required: true },
    },
}
</script>
