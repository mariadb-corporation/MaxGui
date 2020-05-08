<template>
    <collapse
        wrapperClass="mt-4"
        titleWrapperClass="mx-n9"
        :toggleOnClick="() => (showSelect = !showSelect)"
        :toggleVal="showSelect"
        :title="`${$tc(relationshipsType, 2)}`"
    >
        <template v-slot:content>
            <v-select
                v-model="selectedItems"
                :items="items"
                item-text="id"
                return-object
                multiple
                :name="relationshipsType"
                outlined
                dense
                class="std mariadb-select-input"
                :menu-props="{ contentClass: 'mariadb-select-v-menu' }"
                height="36px"
                :placeholder="$tc('select', 2, { entityName: $tc(relationshipsType, 2) })"
                :no-data-text="$t('noEntityAvailable', { entityName: $tc(relationshipsType, 2) })"
                hide-details
            />
        </template>
    </collapse>
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
/* 
This component takes items array props to render v-select component for selecting relationship data. 
Eg : items=[{id:'row_server_1', type:'servers'}]
relationshipsType props is to defined to render correct text, display what relationship type is being target
When getSelectedItems is called by parent component, it returns selectedItems
*/
export default {
    name: 'resource-relationships',

    props: {
        relationshipsType: { type: String, required: true },
        items: { type: Array, required: true },
    },

    data: function() {
        return {
            showSelect: true,
            selectedItems: [],
        }
    },
    methods: {
        getSelectedItems() {
            return this.selectedItems
        },
    },
}
</script>
