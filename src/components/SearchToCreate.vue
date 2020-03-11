<template>
    <fragment>
        <div class="d-flex flex-wrap" style="margin-bottom: 25px">
            <v-text-field
                id="search"
                v-model="search"
                class="search-restyle"
                name="search"
                dense
                outlined
                required
                placeholder="Search"
                label="Search"
                single-line
                hide-details
                rounded
                @click.native.stop
            >
                <v-icon slot="append" size="16">$vuetify.icons.search</v-icon>
            </v-text-field>
            <v-spacer />
            <v-btn outlined rounded color="accent" class="text-capitalize" :disabled="isBtnDisabled" depressed @click.stop="create">
                + Create New
            </v-btn>
        </div>
        <service-create v-model="serviceDialog" mode="create" :close-modal="() => (serviceDialog = false)" />
        <server-create v-model="serverDialog" :close-modal="() => (serverDialog = false)" />
    </fragment>
</template>

<script>
import { mapMutations, mapGetters } from 'vuex';
import ServiceCreate from 'pages/Services/ServiceCreate';
import ServerCreate from 'pages/Servers/ServerCreate';

export default {
    name: 'SearchToCreate',
    components: {
        ServiceCreate,
        ServerCreate,
    },
    props: {
        tabRoutes: { type: Array, default: () => [] },
        currentRoute: { type: String, default: '' },
        isTabRoute: { type: Boolean, default: false },
    },

    data() {
        return {
            search: '',
            isBtnDisabled: true,
            serviceDialog: false,
            serverDialog: false,
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
                this.createType(this.searchKeyWord);
            } else {
                this.createType(this.currentRoute);
            }
        },
        createType(type) {
            switch (type) {
                case 'services':
                    this.serviceDialog = true;
                    break;
                case 'servers':
                    this.serverDialog = true;
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
