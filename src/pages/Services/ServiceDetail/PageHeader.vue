<template>
    <fragment>
        <details-page-title>
            <template v-slot:setting-menu>
                <icon-group-wrapper multiIcons>
                    <template v-slot:body>
                        <v-btn text>
                            <v-icon size="18" color="primary">
                                $vuetify.icons.paused
                            </v-icon>
                        </v-btn>
                        <v-btn text>
                            <v-icon size="18" color="primary">
                                $vuetify.icons.reload
                            </v-icon>
                        </v-btn>
                    </template>
                </icon-group-wrapper>
                <icon-group-wrapper>
                    <template v-slot:body>
                        <v-btn text @click="() => (serviceDeleteDialog = true)">
                            <v-icon size="18" color="error">
                                $vuetify.icons.delete
                            </v-icon>
                        </v-btn>
                    </template>
                </icon-group-wrapper>
            </template>
        </details-page-title>
        <delete-dialog
            v-model="serviceDeleteDialog"
            :title="`${$t('destroy')} ${$t('service')}`"
            :smallInfo="$t('info.serviceDeleteModal')"
            type="destroy"
            :item="currentService"
            :dispatchDelete="
                id => {
                    destroyService(id)
                    $router.go(-1)
                }
            "
            :onClose="() => (serviceDeleteDialog = false)"
            :onCancel="() => (serviceDeleteDialog = false)"
        />
        <icon-sprite-sheet
            size="13"
            class="status-icon mr-1"
            :frame="$help.serviceStateIcon(currentService.attributes.state)"
        >
            status
        </icon-sprite-sheet>
        <span class="color text-navigation body-2">
            {{ currentService.attributes.state === 'Started' ? 'Healthy' : 'Unhealthy' }}
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
 * Change Date: 2024-07-01
 *
 * On the date above, in accordance with the Business Source License, use
 * of this software will be governed by version 2 or later of the General
 * Public License.
 */

import { mapGetters, mapActions } from 'vuex'

export default {
    name: 'page-header',
    props: {
        currentService: { type: Object, required: true },
    },
    data() {
        return {
            serviceDeleteDialog: false,
        }
    },

    methods: {
        ...mapActions('service', ['destroyService']),
    },
}
</script>
