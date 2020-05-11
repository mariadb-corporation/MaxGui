<template>
    <fragment>
        <details-page-title>
            <template v-slot:setting-menu>
                <details-icon-group-wrapper multiIcons>
                    <template v-slot:body>
                        <v-tooltip bottom>
                            <template v-slot:activator="{ on }">
                                <v-btn text v-on="on">
                                    <v-icon size="22" color="primary">
                                        $vuetify.icons.paused
                                    </v-icon>
                                </v-btn>
                            </template>
                            <span></span>
                        </v-tooltip>
                        <v-tooltip bottom>
                            <template v-slot:activator="{ on }">
                                <v-btn text v-on="on">
                                    <v-icon size="22" color="primary">
                                        $vuetify.icons.restart
                                    </v-icon>
                                </v-btn>
                            </template>
                            <span></span>
                        </v-tooltip>
                    </template>
                </details-icon-group-wrapper>
                <details-icon-group-wrapper>
                    <template v-slot:body>
                        <v-tooltip bottom>
                            <template v-slot:activator="{ on }">
                                <v-btn text v-on="on">
                                    <v-icon size="22" color="primary">
                                        $vuetify.icons.drain
                                    </v-icon>
                                </v-btn>
                            </template>
                            <span></span>
                        </v-tooltip>
                    </template>
                </details-icon-group-wrapper>
                <details-icon-group-wrapper>
                    <template v-slot:body>
                        <v-tooltip bottom>
                            <template v-slot:activator="{ on }">
                                <v-btn text v-on="on" @click="handleDelete">
                                    <v-icon size="22" color="error">
                                        $vuetify.icons.unlink
                                    </v-icon>
                                </v-btn>
                            </template>
                            <span>{{ $t('unlink') }} {{ $tc('servers', 1) }}</span>
                        </v-tooltip>
                    </template>
                </details-icon-group-wrapper>
            </template>
        </details-page-title>
        <confirm-dialog
            v-model="showConfirmDialog"
            :title="dialogTitle"
            :type="dialogType"
            :smallInfo="smallInfo ? $t(`info.${smallInfo}`) : ''"
            :item="currentServer"
            :onSave="confirmSave"
            :onClose="() => (showConfirmDialog = false)"
            :onCancel="() => (showConfirmDialog = false)"
        />

        <icon-sprite-sheet
            size="13"
            class="status-icon mr-1"
            :frame="$help.serverStateIcon(currentServer.attributes.state)"
        >
            status
        </icon-sprite-sheet>
        <span class="color text-navigation body-2">
            {{ serverHealthy }}
        </span>
        <span class="color text-field-text body-2">
            {{ !$help.isEmpty(currentServer.attributes.version_string) ? '|' : '' }}
            <span>{{ $t('version') }} {{ currentServer.attributes.version_string }}</span>
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

import { mapActions } from 'vuex'

export default {
    name: 'page-header',
    props: {
        currentServer: { type: Object, required: true },
    },
    data() {
        return {
            showConfirmDialog: false,
            dialogTitle: '',
            dialogType: 'unlink',
            smallInfo: 'serviceDelete',
        }
    },
    computed: {
        // TODO: Determine server healthy
        serverHealthy: function() {
            if (
                this.currentServer.attributes.state === 'Master, Running' ||
                this.currentServer.attributes.state === 'Slave, Running'
            ) {
                return 'Healthy'
            } else if (this.currentServer.attributes.state === 'Maintenance, Running') {
                return 'Maintenance'
            } else return 'Unhealthy'
        },
    },
    methods: {
        ...mapActions('server', ['destroyServer']),
        handleDelete() {
            this.dialogType = 'unlink'
            this.dialogTitle = `${this.$t('unlink')} ${this.$tc('servers', 1)}`
            this.smallInfo = 'serverUnlink'
            this.showConfirmDialog = true
        },

        async confirmSave() {
            await this.performAsyncLoadingAction(this.dialogType)
        },
        async performAsyncLoadingAction(type) {
            let self = this
            if (type === 'unlink') {
                await self.destroyServer(self.currentServer.id)
                self.showConfirmDialog = false
                self.$router.go(-1)
            } /* else {
                await self.stopOrStartService({
                    id: self.currentService.id,
                    mode: type,
                    callback: self.onEditSucceeded,
                })
                self.showConfirmDialog = false
            }*/
        },
    },
}
</script>
