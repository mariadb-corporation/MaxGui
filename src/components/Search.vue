<template>
    <v-text-field
        style="margin-bottom: 25px"
        class="search-restyle"
        name="search"
        id="search"
        dense
        outlined
        required
        placeholder="Search"
        v-model="search"
        label="Search"
        single-line
        hide-details
        rounded
    >
        <v-icon size="16" slot="append" class="fa fa-search" />
    </v-text-field>
</template>

<script>
export default {
    name: 'search',
    data() {
        return {
            search: '',
        };
    },
};
</script>

<style scoped lang="scss">
.search-restyle {
    max-width: 460px;
    height: 30px;
}
</style>
