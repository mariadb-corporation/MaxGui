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
                @keyup.enter="create"
            >
                <v-icon slot="append" size="16">$vuetify.icons.search</v-icon>
            </v-text-field>
            <v-spacer />
            <v-btn
                :disabled="isBtnDisabled"
                outlined
                rounded
                color="accent"
                class="text-capitalize"
                depressed
                small
                @click.native="create"
            >
                + {{ $t('createNew') }}
            </v-btn>
        </div>
        <service-create-or-update
            v-model="serviceDialog"
            :close-modal="() => (serviceDialog = false)"
            mode="post"
        />
        <server-create-or-update
            v-model="serverDialog"
            :close-modal="() => (serverDialog = false)"
            mode="post"
        />
    </fragment>
</template>

<script>
import { mapMutations, mapGetters } from 'vuex'
import ServiceCreateOrUpdate from 'pages/Services/ServiceCreateOrUpdate'
import ServerCreateOrUpdate from 'pages/Servers/ServerCreateOrUpdate'

export default {
    name: 'search-to-create',
    components: {
        ServiceCreateOrUpdate,
        ServerCreateOrUpdate,
    },
    props: {
        tabRoutes: { type: Array, default: () => [], required: true },
        currentRoute: { type: String, default: '', required: true },
        isTabRoute: { type: Boolean, default: false, required: true },
    },

    data() {
        return {
            search: '',
            isBtnDisabled: true,
            serviceDialog: false,
            serverDialog: false,
        }
    },
    computed: {
        ...mapGetters(['searchKeyWord']),
    },
    watch: {
        search: function(newVal) {
            let keyword = newVal.toLowerCase()
            this.setSearchKeyWord(keyword)
        },
        searchKeyWord: function(newVal) {
            /*Display create button when the current route belongs to tabRoute, 
            when search keyword is empty, currentRoute is */
            if (newVal === '' && this.isTabRoute) {
                this.isBtnDisabled = false
            } else {
                this.isBtnDisabled = this.isKeyWordMatchTabRoutes(newVal)
            }
        },
        currentRoute: function(newRoute) {
            this.isBtnDisabled = this.isKeyWordMatchTabRoutes(newRoute)
        },
        $route: function(to, from) {
            // Clear local search and global search state when route changes
            this.search = ''
            this.setSearchKeyWord('')
        },
    },
    created() {
        this.isBtnDisabled = this.isKeyWordMatchTabRoutes(this.currentRoute)
    },

    methods: {
        ...mapMutations(['setSearchKeyWord']),
        create() {
            if (this.searchKeyWord && !this.isBtnDisabled) {
                this.createType(this.searchKeyWord)
            } else {
                this.createType(this.currentRoute)
            }
        },
        createType(type) {
            switch (type) {
                case 'services':
                    this.serviceDialog = true
                    break
                case 'servers':
                    this.serverDialog = true
            }
        },
        isKeyWordMatchTabRoutes(keyword) {
            let arr = this.tabRoutes.slice()
            let match = false
            for (let i = arr.length - 1; i >= 0; --i) {
                if (arr[i].name === keyword) {
                    match = false
                    break
                } else {
                    match = true
                }
            }
            return match
        },
    },
}
</script>

<style scoped lang="scss">
.search-restyle {
    max-width: 460px;
    height: 30px;
}
</style>
