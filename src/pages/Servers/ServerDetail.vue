<template>
    <v-sheet v-if="!$_.isEmpty(currentServer)" class="px-6">
        <details-page-title />
        <icon-sprite-sheet
            size="13"
            class="status-icon mr-1"
            :frame="$help.serverStateIcon(currentServer.attributes.state)"
        >
            status
        </icon-sprite-sheet>
        <span class="color text-navigation body-2">
            {{ currentServer.attributes.state.includes('Running') ? 'Running' : 'Down' }}
        </span>
        <span class="color text-field-text body-2">
            {{ !$_.isEmpty(currentServer.attributes.version_string) ? '|' : '' }}
            <span>{{ currentServer.attributes.version_string }}</span>
        </span>
        <v-slide-group :show-arrows="false" class="mb-5" center-active>
            <v-slide-item>
                <fragment>
                    <template v-for="(value, name, index) in getTopOverviewInfo">
                        <outline-small-card
                            :key="name"
                            cardWrapper="detail-overview mt-6"
                            cardClass="detail-overview__card px-10"
                        >
                            <template v-if="index === 0" v-slot:title>
                                {{ $t('overview') }}
                            </template>
                            <template v-slot:card-body>
                                <span
                                    class="caption text-uppercase font-weight-bold color text-deep-ocean"
                                >
                                    {{ name.replace('_', ' ') }}
                                </span>
                                <span class="text-no-wrap">
                                    {{
                                        name === 'triggered_at'
                                            ? $help.formatValue(value, 'DATE_RFC2822')
                                            : value
                                    }}
                                </span>
                            </template>
                        </outline-small-card>
                    </template>
                </fragment>
            </v-slide-item>
        </v-slide-group>

        <v-row>
            <v-col cols="6">
                <p class="body-2 font-weight-bold color text-navigation text-uppercase">
                    {{ $t('statistics') }}
                </p>
                <recursive-nested-collapse
                    v-for="(value, propertyName) in currentServer.attributes.statistics"
                    :key="propertyName"
                    :hasChild="$help.hasChild(value)"
                    :propertyName="propertyName"
                    :value="$help.handleNull(value)"
                    :child="$help.hasChild(value) ? value : {}"
                />
            </v-col>
            <v-col v-if="!$_.isEmpty(currentServer.relationships)" cols="3">
                <p class="body-2 font-weight-bold color text-navigation text-uppercase">
                    {{ $t('services') }}
                    <span class="ml-1 color text-field-text"
                        >({{ currentServer.relationships.services.data.length }})
                    </span>
                </p>
                <data-table
                    :headers="servicesTableHeader"
                    :data="servicesLinked"
                    :sortDesc="false"
                    sortBy="id"
                    class="table-fluid"
                >
                    <template v-slot:state="{ data: { item: { state } } }">
                        <icon-sprite-sheet
                            size="13"
                            class="status-icon"
                            :frame="$help.serviceStateIcon(state)"
                        >
                            status
                        </icon-sprite-sheet>
                    </template>
                </data-table>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="6">
                <p class="body-2 font-weight-bold color text-navigation text-uppercase">
                    {{ $t('parameters') }}
                </p>
                <recursive-nested-collapse
                    v-for="(value, propertyName) in currentServer.attributes.parameters"
                    :key="propertyName"
                    :hasChild="$help.hasChild(value)"
                    :propertyName="propertyName"
                    :value="$help.handleNull(value)"
                    :child="$help.hasChild(value) ? value : {}"
                />
            </v-col>
        </v-row>
    </v-sheet>
</template>

<script>
import RecursiveNestedCollapse from 'components/RecursiveNestedCollapse'
import { mapGetters, mapActions } from 'vuex'

export default {
    name: 'server-detail',
    components: {
        'recursive-nested-collapse': RecursiveNestedCollapse,
    },
    props: {
        id: String,
    },
    data() {
        return {
            servicesLinked: [],
            servicesTableHeader: [
                { text: 'Service', value: 'id' },
                { text: 'Status', value: 'state' },
            ],
        }
    },
    computed: {
        ...mapGetters({
            currentServer: 'server/currentServer',
            allServicesMap: 'service/allServicesMap',
        }),
        getTopOverviewInfo: function() {
            let currentServer = this.$_.cloneDeep(this.currentServer)
            let overviewInfo = {}
            if (!this.$_.isEmpty(currentServer)) {
                // Set fallback null value if properties doesnt exist
                const {
                    attributes: {
                        state,
                        last_event = null,
                        triggered_at = null,
                        node_id = null,
                        parameters: { address = null, socket = null, port = null } = {},
                    } = {},
                    relationships: { monitors = null } = {},
                } = currentServer

                overviewInfo = {
                    address: address,
                    socket: socket,
                    port: port,
                    state: state,
                    last_event: last_event,
                    triggered_at: triggered_at,
                    monitor: monitors ? monitors.data[0].id : null,
                    node_id: node_id,
                }

                Object.keys(overviewInfo).forEach(
                    key => overviewInfo[key] == null && delete overviewInfo[key]
                )
            }
            return overviewInfo
        },
    },
    async created() {
        await this.fetchServerById(this.$route.params.id)
        if (!this.$_.isEmpty(this.currentServer.relationships)) {
            let services = this.currentServer.relationships.services.data
            let servicesIdArr = services ? services.map(item => `${item.id}`) : []
            // Get array of obj linked servers based on linkedServers array of IDs
            await this.fetchServiceFieldsets(servicesIdArr)
        }
    },
    methods: {
        ...mapActions('server', ['fetchServerById']),
        processData(arr) {
            this.servicesLinked = arr
        },
        async fetchServiceFieldsets(idArray) {
            try {
                let arr = []
                for (let i = 0; i < idArray.length; ++i) {
                    let res = await this.axios.get(`/services/${idArray[i]}?fields[services]=state`)
                    if (res.status === 200) {
                        const {
                            id,
                            attributes: { state },
                        } = res.data.data
                        arr.push({ id: id, state: state })
                    }
                }
                return this.processData(arr)
            } catch (e) {
                return e
            }
        },
    },
}
</script>

<style lang="scss" scoped>
h5 {
    text-align: center;
    margin-bottom: 20px;
}
.detail-overview {
    width: 100%;
    ::v-deep &__card {
        border-radius: 0px !important;
        display: flex;
        align-items: center;
        flex-direction: column;
        justify-content: center;
    }

    &:not(:first-of-type) {
        ::v-deep .detail-overview__card {
            border-left: none !important;
        }
    }
}
</style>
