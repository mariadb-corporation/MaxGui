<template>
    <fragment>
        <div class="d-flex flex-wrap ">
            <v-text-field
                id="search"
                v-model.trim="search"
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
                :disabled="handleShowCreateBtn"
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
        <create-wizard-dialog
            v-if="createDialog"
            v-model="createDialog"
            :closeModal="() => (createDialog = false)"
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
import { mapMutations, mapActions } from 'vuex'
import CreateWizardDialog from './CreateWizardDialog'
export default {
    name: 'search-to-create',
    components: {
        CreateWizardDialog,
    },

    data() {
        return {
            search: '',
            createDialog: false,
        }
    },
    computed: {
        currentRouteName: function() {
            return this.$route.name
        },
        handleShowCreateBtn: function() {
            const matchArr = [
                'monitor',
                'monitors',
                'server',
                'servers',
                'service',
                'services',
                'session',
                'sessions',
                'filter',
                'filters',
            ]
            if (matchArr.includes(this.currentRouteName)) return false
            return true
        },
    },
    watch: {
        search: function(newVal) {
            this.setSearchKeyWord(newVal)
        },

        $route: function(to, from) {
            // Clear local search and global search state when route changes
            this.search = ''
            this.setSearchKeyWord('')
        },
    },

    methods: {
        ...mapMutations(['setSearchKeyWord']),
        ...mapActions({
            fetchAllModules: 'maxscale/fetchAllModules',
        }),
        async create() {
            await this.fetchAllModules()
            this.createDialog = true
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
