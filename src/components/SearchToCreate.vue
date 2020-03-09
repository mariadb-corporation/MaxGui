<template>
    <div class="d-flex flex-wrap" style="margin-bottom: 25px">
        <v-text-field
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
            @click.native.stop
        >
            <v-icon size="16" slot="append" class="fa fa-search" />
        </v-text-field>
        <v-spacer />
        <v-btn outlined rounded color="accent" dark class="text-capitalize" @click="create" depressed>
            + Create New
        </v-btn>
    </div>
</template>

<script>
export default {
    name: 'search-to-create',
    data() {
        return {
            search: '',
        };
    },
    methods: {
        create() {
            // console.log('Create based on search keyword');
        },
    },
};
</script>

<style scoped lang="scss">
.search-restyle {
    max-width: 460px;
    height: 30px;
}
</style>
