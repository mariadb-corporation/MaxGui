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
            <v-icon size="16" slot="append">$vuetify.icons.search</v-icon>
        </v-text-field>
        <v-spacer />
        <v-btn
            outlined
            rounded
            dark
            color="accent"
            class="text-capitalize"
            :disabled="isBtnDisabled"
            @click="create"
            depressed
        >
            + Create New
        </v-btn>
    </div>
</template>

<script>
import { mapMutations, mapGetters } from 'vuex';

export default {
    name: 'search-to-create',
    props: {
        tabRoutes: Array,
        currentRoute: String,
        isTabRoute: Boolean,
    },
    data() {
        return {
            search: '',
            isBtnDisabled: true,
        };
    },
    computed: {
        ...mapGetters(['searchKeyWord']),
    },
    watch: {
        search: function(newVal) {
            let keyword = newVal.toLowerCase();
            this.setSearchKeyWord(keyword);
        },
        searchKeyWord: function(newVal) {
            // Display create button when the current route belongs to tabRoute, when search keyword is empty, currentRoute is
            if (newVal === '' && this.isTabRoute) {
                this.isBtnDisabled = false;
            } else {
                this.isBtnDisabled = this.isKeyWordMatchTabRoutes(newVal);
            }
        },
        currentRoute: function(newRoute) {
            this.isBtnDisabled = this.isKeyWordMatchTabRoutes(newRoute);
        },
    },
    created() {
        this.isBtnDisabled = this.isKeyWordMatchTabRoutes(this.currentRoute);
    },
    methods: {
        ...mapMutations(['setSearchKeyWord']),
        create() {
            if (this.searchKeyWord && !this.isBtnDisabled) {
                // console.log('Create based on search keyword', this.searchKeyWord);
            } else {
                // console.log('Create based on curent route', this.currentRoute);
            }
        },
        isKeyWordMatchTabRoutes(keyword) {
            let arr = this.tabRoutes.slice();
            let match = false;
            for (let i = 0; i < arr.length; i++) {
                if (arr[i].name === keyword) {
                    match = false;
                    break;
                } else {
                    match = true;
                }
            }
            return match;
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
