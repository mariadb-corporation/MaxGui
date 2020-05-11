<template>
    <!-- TODO: animation for dynamicWidth feature -->
    <base-dialog
        v-model="computeShowDialog"
        :onCancel="closeModal"
        :onClose="closeModal"
        :onSave="handleSave"
        :title="`${$t('createANew')}...`"
        dynamicWidth
        scrollable
    >
        <template v-slot:body>
            <fragment v-if="selectedResource">
                <v-select
                    id="resource-select"
                    v-model="selectedResource"
                    :items="resourcesList"
                    name="resourceName"
                    outlined
                    dense
                    class="std mariadb-select-input error--text__bottom"
                    :menu-props="{ contentClass: 'mariadb-select-v-menu' }"
                    hide-details
                    :rules="[v => !!v || 'This field is required']"
                    required
                    @input="handleResourceSelected"
                />
                <v-divider class="divider" />
                <div class="mb-0">
                    <label class="label color text-small-text d-block">
                        {{ `${selectedResource} name` }}
                    </label>
                    <v-text-field
                        id="id"
                        v-model="resourceId"
                        :rules="rules.resourceId"
                        name="id"
                        required
                        class="std error--text__bottom"
                        dense
                        outlined
                        :placeholder="
                            $t('nameYour', { resourceName: selectedResource.toLowerCase() })
                        "
                    />
                </div>

                <div v-if="selectedResource === 'Service'" class="mb-0">
                    <service-form-input
                        ref="serviceForm"
                        :resourceModules="resourceModules"
                        :allServers="allServers"
                        :allFilters="allFilters"
                    />
                </div>
                <div v-else-if="selectedResource === 'Monitor'" class="mb-0">
                    <monitor-form-input
                        ref="monitorForm"
                        :resourceModules="resourceModules"
                        :allServers="allServers"
                    />
                </div>
                <div v-else-if="selectedResource === 'Filter'" class="mb-0">
                    <filter-form-input ref="filterForm" :resourceModules="resourceModules" />
                </div>
                <div v-else-if="selectedResource === 'Listener'" class="mb-0">
                    <listener-form-input
                        ref="listenerForm"
                        :resourceModules="resourceModules"
                        :allServices="allServices"
                    />
                </div>
            </fragment>
        </template>
    </base-dialog>
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
import { mapActions, mapGetters } from 'vuex'
import ServiceFormInput from './Forms/ServiceFormInput'
import MonitorFormInput from './Forms/MonitorFormInput'
import FilterFormInput from './Forms/FilterFormInput'
import ListenerFormInput from './Forms/ListenerFormInput'

export default {
    name: 'create-wizard-dialog',
    components: {
        ServiceFormInput,
        MonitorFormInput,
        FilterFormInput,
        ListenerFormInput,
    },
    props: {
        value: Boolean,
        closeModal: Function,
    },
    data: function() {
        return {
            show: false,
            selectedResource: '',
            resourcesList: ['Service', 'Server', 'Monitor', 'Filter', 'Listener'],
            // module for monitor, service, and filter
            resourceModules: [],
            //COMMON
            isParametersTableShown: false,
            resourceId: '', // resourceId is the name of resource being created
            rules: {
                resourceId: [val => this.validateResourceId(val)],
            },
            validateInfo: {},
            // this is used to auto assign default selectedResource
            matchRoutes: [
                'monitor',
                'monitors',
                'server',
                'servers',
                'service',
                'services',
                'listener',
                'listeners',
                'filter',
                'filters',
            ],
            emittingFormValuesEvent: false,
            formValues: {},
        }
    },

    computed: {
        ...mapGetters({
            allModules: 'maxscale/allModules',
            allServices: 'service/allServices',
            allServicesInfo: 'service/allServicesInfo',
            allServers: 'server/allServers',
            allServersInfo: 'server/allServersInfo',
            allMonitorsInfo: 'monitor/allMonitorsInfo',
            allFiltersInfo: 'filter/allFiltersInfo',
            allFilters: 'filter/allFilters',
            allListenersInfo: 'listener/allListenersInfo',
        }),

        computeShowDialog: {
            // get value from props
            get() {
                return this.value
            },
            // set the value to show property in data
            set(value) {
                this.show = value
            },
        },
    },
    watch: {
        resourceId: function(val) {
            // add hyphens when ever input have whitespace
            this.resourceId = val ? val.split(' ').join('-') : val
        },

        $route: function(to) {
            this.setDefaultSelectedResource(to.name)
        },
    },
    mounted() {
        this.setDefaultSelectedResource(this.$route.name)
    },
    methods: {
        ...mapActions({
            createService: 'service/createService',
            createMonitor: 'monitor/createMonitor',
            createFilter: 'filter/createFilter',
            createListener: 'listener/createListener',
            fetchAllServices: 'service/fetchAllServices',
            fetchAllServers: 'server/fetchAllServers',
            fetchAllMonitors: 'monitor/fetchAllMonitors',
            fetchAllFilters: 'filter/fetchAllFilters',
            fetchAllListeners: 'listener/fetchAllListeners',
        }),

        async handleResourceSelected(val) {
            switch (val) {
                case 'Service':
                    {
                        this.resourceModules = this.getModuleType('Router')
                        await this.fetchAllServices()
                        this.validateInfo = this.allServicesInfo
                        await this.fetchAllServers()
                        await this.fetchAllFilters()
                    }
                    break
                case 'Server':
                    await this.fetchAllServers()
                    this.validateInfo = this.allServersInfo
                    break
                case 'Monitor':
                    this.resourceModules = this.getModuleType('Monitor')
                    await this.fetchAllMonitors()
                    this.validateInfo = this.allMonitorsInfo
                    await this.fetchAllServers()
                    break
                case 'Filter':
                    this.resourceModules = this.getModuleType('Filter')
                    await this.fetchAllFilters()
                    this.validateInfo = this.allFiltersInfo
                    break
                case 'Listener':
                    {
                        let authenticators = this.getModuleType('Authenticator')
                        let authenticatorId = authenticators.map(item => `${item.id}`)

                        let protocols = this.getModuleType('Protocol')
                        for (let i = 0; i < protocols.length; ++i) {
                            let protocol = protocols[i]
                            // add default_value for protocol param
                            let protocolParamObj = protocol.attributes.parameters.find(
                                o => o.name === 'protocol'
                            )
                            protocolParamObj.default_value = protocol.id
                            protocolParamObj.disabled = true
                            /*TODO: "Each protocol module defines a default authentication module", 
                            but the authenticator parameter receives from /maxscale/module doesnt have default_value
                            The type should be enum_mask
                            */
                            // add default_value for authenticator
                            let authenticatorParamObj = protocol.attributes.parameters.find(
                                o => o.name === 'authenticator'
                            )
                            authenticatorParamObj.type = 'enum'
                            authenticatorParamObj.enum_values = authenticatorId
                            authenticatorParamObj.default_value = ''
                        }

                        this.resourceModules = protocols
                        await this.fetchAllListeners()
                        this.validateInfo = this.allListenersInfo
                        await this.fetchAllServices()
                    }
                    break
            }
        },

        setDefaultSelectedResource(resource) {
            if (this.matchRoutes.includes(resource)) {
                this.selectedResource = this.textTransform(resource)
                this.handleResourceSelected(this.selectedResource)
            } else {
                this.selectedResource = 'Service'
                this.handleResourceSelected('Service')
            }
        },

        /**
         * @param {String} str Plural string to be processed
         * @return {String} return str that removed last char s and capitalized first char
         */
        textTransform(str) {
            const suffix = 's'
            const arr = str.split('')
            if (arr[arr.length - 1] === suffix) {
                str = this.$help.strReplaceAt(str, arr.length - 1, '')
            }
            return str.charAt(0).toUpperCase() + str.slice(1)
        },

        getModuleType(type) {
            let modules = []
            for (let i = 0; i < this.allModules.length; ++i) {
                let moduleObj = this.allModules[i]
                moduleObj.attributes.module_type === type && modules.push(moduleObj)
            }
            return modules
        },

        handleSave() {
            switch (this.selectedResource) {
                case 'Service':
                    {
                        const {
                            moduleId,
                            parameters,
                            relationships,
                        } = this.$refs.serviceForm.getValues()
                        const payload = {
                            id: this.resourceId,
                            router: moduleId,
                            parameters: parameters,
                            relationships: relationships,
                            callback: this.fetchAllServices,
                        }
                        this.createService(payload)
                    }
                    break
                case 'Monitor':
                    {
                        const {
                            moduleId,
                            parameters,
                            relationships,
                        } = this.$refs.monitorForm.getValues()
                        const payload = {
                            id: this.resourceId,
                            module: moduleId,
                            parameters: parameters,
                            relationships: relationships,
                            callback: this.fetchAllMonitors,
                        }
                        this.createMonitor(payload)
                    }
                    break
                case 'Filter':
                    {
                        const { moduleId, parameters } = this.$refs.filterForm.getValues()
                        const payload = {
                            id: this.resourceId,
                            module: moduleId,
                            parameters: parameters,
                            callback: this.fetchAllFilters,
                        }
                        this.createFilter(payload)
                    }
                    break
                case 'Listener':
                    {
                        const { parameters, relationships } = this.$refs.listenerForm.getValues()
                        const payload = {
                            id: this.resourceId,
                            parameters: parameters,
                            relationships: relationships,
                            callback: this.fetchAllFilters,
                        }
                        this.createListener(payload)
                    }
                    break
            }
            this.closeModal()
        },

        validateResourceId(val) {
            if (!val) {
                return 'id is required'
            } else if (this.validateInfo.idArr.includes(val)) {
                return 'id is already registered'
            }
            return true
        },
    },
}
</script>

<style lang="scss" scoped>
.divider {
    max-width: calc(100% + 124px);
    width: calc(100% + 124px);

    margin: 24px 0px 24px -62px;
}
.mariadb-select-input {
    ::v-deep .v-select__selection--comma {
        font-weight: bold !important;
    }
}
::v-deep .label {
    font-size: 0.625rem;
}
</style>
