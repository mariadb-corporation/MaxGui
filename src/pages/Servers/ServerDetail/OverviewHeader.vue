<template>
    <v-sheet class="d-flex mb-2">
        <outline-small-card
            v-for="(value, name, index) in getTopOverviewInfo"
            :key="name"
            cardWrapper="detail-overview mt-5"
            cardClass="detail-overview__card px-10"
        >
            <template v-if="index === 0" v-slot:title>
                {{ $t('overview') }}
            </template>
            <template v-slot:card-body>
                <span class="caption text-uppercase font-weight-bold color text-deep-ocean">
                    {{ name.replace('_', ' ') }}
                </span>
                <router-link
                    v-if="name === 'monitor' && value !== 'undefined'"
                    :key="index"
                    :to="`/dashboard/monitors/${value}`"
                    class="body-2 no-underline"
                >
                    <span>{{ value }} </span>
                </router-link>
                <!--  TODO: Determine server healthy to display correct text color -->
                <span v-else-if="name === 'state'" class="text-no-wrap body-2">
                    <fragment v-if="value.indexOf(',') > 0">
                        <span class="color text-success font-weight-bold">
                            {{ value.slice(0, value.indexOf(',')) }}
                        </span>
                        /
                        <span class="color text-success font-weight-bold">
                            {{ value.slice(value.indexOf(',') + 1) }}
                        </span>
                    </fragment>
                    <span v-else class="color text-success font-weight-bold">
                        {{ value }}
                    </span>
                </span>
                <span v-else class="text-no-wrap body-2">
                    <span v-if="value !== 'undefined'">
                        {{
                            name === 'triggered_at' && value !== 'undefined'
                                ? $help.formatValue(value, 'DATE_RFC2822')
                                : value
                        }}
                    </span>
                </span>
            </template>
        </outline-small-card>
    </v-sheet>
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

export default {
    name: 'overview-header',

    props: {
        currentServer: { type: Object, required: true },
    },

    computed: {
        getTopOverviewInfo: function() {
            let self = this
            let currentServer = self.$help.cloneDeep(self.currentServer)
            let overviewInfo = {}
            if (!self.$help.isEmpty(currentServer)) {
                // Set fallback undefined value if properties doesnt exist
                const {
                    attributes: {
                        state,
                        last_event = undefined,
                        triggered_at = undefined,

                        parameters: {
                            address = undefined,
                            socket = undefined,
                            port = undefined,
                        } = {},
                    } = {},
                    relationships: { monitors = undefined } = {},
                } = currentServer

                overviewInfo = {
                    address: address,
                    socket: socket,
                    port: port,
                    state: state,
                    last_event: last_event,
                    triggered_at: triggered_at,
                    monitor: monitors ? monitors.data[0].id : undefined,
                }

                if (socket) {
                    delete overviewInfo.address
                    delete overviewInfo.port
                } else delete overviewInfo.socket
                Object.keys(overviewInfo).forEach(
                    key => (overviewInfo[key] = self.$help.handleValue(overviewInfo[key]))
                )
            }
            return overviewInfo
        },
    },
}
</script>
