<template>
    <v-row>
        <v-col class="py-0 my-0" cols="3">
            <v-row class="pa-0 ma-0">
                <!-- SERVER TABLE -->
                <v-col cols="12" class="pa-0 ma-0">
                    <details-table-wrapper
                        :toggleOnClick="() => (showServers = !showServers)"
                        :toggleVal="showServers"
                        title="servers"
                        :titleInfo="serversLinked.length"
                        :onAddClick="() => (addServerDialog = true)"
                        addBtnText="addServer"
                    >
                        <template v-slot:table>
                            <data-table
                                :headers="serversTableHeader"
                                :data="serversLinked"
                                :sortDesc="false"
                                :noDataText="$t('noServer')"
                                sortBy="id"
                                :search="searchKeyWord"
                                :loading="loading"
                            >
                                <template v-slot:id="{ data: { item: { id } } }">
                                    <router-link
                                        :key="id"
                                        :to="`/dashboard/servers/${id}`"
                                        class="no-underline"
                                    >
                                        <span> {{ id }} </span>
                                    </router-link>
                                </template>
                                <template v-slot:state="{ data: { item: { state } } }">
                                    <icon-sprite-sheet
                                        size="13"
                                        class="status-icon"
                                        :frame="$help.serverStateIcon(state)"
                                    >
                                        status
                                    </icon-sprite-sheet>
                                </template>
                            </data-table>
                        </template>
                    </details-table-wrapper>
                </v-col>
                <!-- Filter TABLE -->
                <v-col cols="12" class="pa-0 mt-4">
                    <details-table-wrapper
                        :toggleOnClick="() => (showFilter = !showFilter)"
                        :toggleVal="showFilter"
                        title="filters"
                        :titleInfo="filtersLinked.length"
                        :onAddClick="() => (addFilterDialog = true)"
                        addBtnText="addFilter"
                    >
                        <template v-slot:table>
                            <data-table
                                :headers="filterTableHeader"
                                :data="filtersLinked"
                                :sortDesc="false"
                                :noDataText="$t('noFilter')"
                                :search="searchKeyWord"
                                :draggable="true"
                                :dragReorder="filterDragReorder"
                                :loading="loading"
                            >
                                <template v-slot:id="{ data: { item: { id } } }">
                                    <router-link
                                        :key="id"
                                        :to="`/dashboard/filters/${id}`"
                                        class="no-underline"
                                    >
                                        <span> {{ id }} </span>
                                    </router-link>
                                </template>
                                <!-- <template v-slot:actions="{ data: { item: { id } } }">
                                    <router-link
                                        :key="id"
                                        :to="`/dashboard/filters/${id}`"
                                        class="no-underline"
                                    >
                                        <span> {{ id }} </span>
                                    </router-link>
                                </template> -->
                            </data-table>
                        </template>
                    </details-table-wrapper>
                </v-col>
            </v-row>
        </v-col>
        <v-col class="pa-0 ma-0" cols="9"> </v-col>
    </v-row>
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

import { mapGetters, mapActions, mapMutations } from 'vuex'
import { OVERLAY_TRANSPARENT_LOADING } from 'store/overlayTypes'

export default {
    name: 'server-session-tab',
    props: {
        currentService: { type: Object, required: true },
        searchKeyWord: { type: String, required: true },
        createOrUpdateService: { type: Function, required: true },
        loading: { type: Boolean, required: true },
    },
    data() {
        return {
            serversLinked: [],
            showServers: true,
            addServerDialog: false,
            serversTableHeader: [
                { text: 'Server', value: 'id' },
                { text: 'Status', value: 'state', align: 'center' },
            ],
            showFilter: true,
            addFilterDialog: false,
            filterTableHeader: [{ text: 'Filter', value: 'id', sortable: false }],
        }
    },
    computed: {
        fetch: function() {
            let servers = this.currentService.relationships.servers.data
            let serversIdArr = servers ? servers.map(item => `${item.id}`) : []
            // Get array of obj linked servers based on linkedServers array of IDs
            return this.fetchServerFieldsets(serversIdArr)
        },
        filtersLinked: function() {
            const {
                filters: { data: filtersLinkedData = [] } = {},
            } = this.currentService.relationships

            return filtersLinkedData
                ? filtersLinkedData.map(item => ({ id: item.id, type: item.type }))
                : []
        },
    },
    async created() {
        if (!this.$help.isEmpty(this.currentService.relationships)) {
            await this.fetch
        }
    },
    methods: {
        ...mapMutations(['showOverlay', 'hideOverlay']),
        processServersLinked(arr) {
            this.serversLinked = arr
        },
        async fetchServerFieldsets(idArray) {
            try {
                let arr = []
                for (let i = 0; i < idArray.length; ++i) {
                    let res = await this.axios.get(`/servers/${idArray[i]}?fields[servers]=state`)
                    if (res.status === 200) {
                        const {
                            id,
                            attributes: { state },
                        } = res.data.data
                        arr.push({ id: id, state: state })
                    }
                }
                return this.processServersLinked(arr)
            } catch (e) {
                return e
            }
        },

        async filterDragReorder({ oldIndex, newIndex }) {
            let self = this

            if (oldIndex !== newIndex) {
                const moved = self.filtersLinked.splice(oldIndex, 1)[0]
                self.filtersLinked.splice(newIndex, 0, moved)
                self.showOverlay(OVERLAY_TRANSPARENT_LOADING)
                await self.createOrUpdateService({
                    mode: 'patch',
                    id: self.currentService.id,
                    relationships: {
                        filters: {
                            data: self.filtersLinked,
                        },
                    },
                })
                // wait time out for loading animation
                await setTimeout(() => {
                    self.hideOverlay()
                }, 600)
            }
        },
    },
}
</script>
