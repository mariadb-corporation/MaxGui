<template>
    <th>
        <v-select :items="headers" v-model="selectItem" name="header" label="SORT BY" id="header">
            <template v-slot:selection="{ item }">
                <v-chip small class="text-capitalize" :class="[item.sortable !== false ? 'sortable' : '']">
                    <span>{{ item.text }}</span>
                    <v-icon size="12" class="ml-2 fa fa-chevron-up" />
                </v-chip>
            </template>
        </v-select>
    </th>
</template>

<script>
export default {
    name: 'data-table-header-mobile',
    props: {
        items: Array,
    },

    data() {
        return {
            pagination: {},
            selectItem: {},
        };
    },
    computed: {
        headers() {
            return this.items.filter(item => item.sortable !== false && { text: item.text, value: item.value });
        },
    },
    watch: {
        selectItem: function(newVal) {
            this.$emit('sort', newVal);
        },
    },
};
</script>

<style lang="scss" scoped></style>
