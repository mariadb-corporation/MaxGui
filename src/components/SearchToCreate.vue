<template>
    <fragment>
        <div class="d-flex flex-wrap ">
            <v-text-field
                id="search"
                v-model="search"
                class="search-restyle mr-4"
                name="search"
                height="39"
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

            <v-btn
                :disabled="isBtnDisabled"
                width="160"
                outlined
                height="36"
                rounded
                class="color text-accent-dark text-capitalize px-8 font-weight-medium"
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
            // let keyword = newVal.toLowerCase()
            this.setSearchKeyWord(newVal)
            /*Display create button when the current route belongs to tabRoute, 
            when search keyword is empty, currentRoute is */
            if (newVal === '') {
                this.isBtnDisabled = false
            } else {
                this.isBtnDisabled = this.isMatchTabRoutes(newVal.toLowerCase())
            }
        },
        currentRoute: function(newRoute) {
            this.isBtnDisabled = this.isMatchTabRoutes(newRoute)
        },
        $route: function(to, from) {
            // Clear local search and global search state when route changes
            this.search = ''
            this.setSearchKeyWord('')
        },
    },
    created() {
        this.isBtnDisabled = this.isMatchTabRoutes(this.currentRoute)
    },

    methods: {
        ...mapMutations(['setSearchKeyWord']),
        create() {
            if (this.search && !this.isBtnDisabled) {
                this.createType(this.search.toLowerCase())
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
        isMatchTabRoutes(keyword) {
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

<style lang="scss">
.search-restyle {
    max-width: 175px;

    .v-input__slot {
        min-height: 0 !important;
        padding: 0px 10px 0px 15px !important;
    }
    input {
        font-size: 12px !important;
    }
    .v-input__append-inner {
        margin-top: 12px !important;
    }
}
.search-restyle.primary--text {
    svg {
        color: $primary;
    }
}
</style>
