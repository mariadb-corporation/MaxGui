<template>
    <base-dialog
        v-model="computeShowDialog"
        :onCancel="closeModal"
        :onClose="closeModal"
        :onSave="handleSave"
        maxWidth="760px"
        :title="`${$t('createANew')}...`"
    >
        <template v-slot:body>
            <v-select
                id="resource-select"
                v-model="selectedResource"
                :items="resourcesList"
                name="resourceName"
                outlined
                dense
                class="std mariadb-select-input error--text__bottom"
                :menu-props="{ contentClass: 'mariadb-select-v-menu' }"
                height="36px"
                hide-details
                required
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
                    height="36px"
                    dense
                    outlined
                    :placeholder="$t('nameYour', { resourceName: selectedResource.toLowerCase() })"
                />
            </div>

            <div v-if="selectedResource === 'Service'" class="mb-0">
                <service-form-input
                    :resourceId="resourceId"
                    :resourceModules="resourceModules"
                    :createService="createService"
                />
            </div>
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
import ServiceFormInput from './ServiceFormInput'

export default {
    name: 'create-wizard-dialog',
    components: {
        ServiceFormInput,
    },
    props: {
        value: Boolean,
        closeModal: Function,
    },
    data: function() {
        return {
            show: false,
            selectedResource: 'Service',
            resourcesList: ['Service', 'Server', 'Monitor', 'Filter', 'Listener'],
            //COMMON
            resourceId: '', // resourceId is the name of resource being created
            rules: {
                resourceId: [val => this.validateResourceId(val)],
            },

            // module for monitor, service, and filter
            resourceModules: [],
        }
    },

    computed: {
        ...mapGetters({
            allModules: 'maxscale/allModules',
            // allServicesInfo: 'service/allServicesInfo',
            // allServicesMap: 'service/allServicesMap',
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
        // when dialog is open, fetchAllModules for Monitor, Service and Filter
        value: async function(val) {
            if (val) {
                await this.fetchAllModules()
                if (this.selectedResource === 'Service')
                    this.resourceModules = this.getModuleType('Router')
            }
        },
        selectedResource: async function(val) {
            switch (val) {
                case 'Service':
                    this.resourceModules = this.getModuleType('Router')
                    break
                case 'Server':
                    break
                case 'Monitor':
                    this.resourceModules = this.getModuleType('Monitor')
                    break
                case 'Filter':
                    this.resourceModules = this.getModuleType('Filter')
                    break
                case 'Listener':
                    break
            }
        },
    },

    methods: {
        ...mapActions({
            fetchAllModules: 'maxscale/fetchAllModules',
            createService: 'service/createService',
        }),
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
                    // this.createService({
                    //     id: this.resourceId,

                    //     router: this.router,
                    //     relationships: this.relationships,
                    //     parameters: this.parameters,
                    // })
                    break
            }

            this.closeModal()
        },
        validateResourceId(val) {
            if (!val) {
                return 'id is required'
            }
            //  else if (this.allServicesInfo.idArr.includes(val)) {
            //     return 'id is already registered'
            // }
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
