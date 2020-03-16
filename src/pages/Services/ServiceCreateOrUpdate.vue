<template>
    <base-dialog
        v-model="computeShowDialog"
        :onCancel="closeModal"
        :onSave="handleSave"
        maxWidth="890px"
    >
        <template v-slot:title>
            <h3>{{ modalTitle }}{{ $t('service') }}</h3>
        </template>
        <template v-slot:body>
            <fragment>
                <v-container class="pa-0">
                    <v-form
                        ref="form"
                        v-model="isValid"
                        @keyup.native.enter="isValid && handleSave()"
                    >
                        <v-row>
                            <v-col xs="12" sm="6">
                                <v-text-field
                                    id="id"
                                    v-model="serviceId"
                                    :rules="serviceObjRules.id"
                                    label="Name of the service*"
                                    name="id"
                                    autofocus
                                    :disabled="mode === 'patch' ? true : false"
                                    required
                                ></v-text-field>
                            </v-col>
                        </v-row>

                        <v-row>
                            <v-col id="router" sm="6" md="4">
                                <v-select
                                    id="router"
                                    v-model="router"
                                    :items="routing_module"
                                    :rules="serviceObjRules.router"
                                    name="router"
                                    label="The router module to use*"
                                    :disabled="mode === 'patch' ? true : false"
                                    required
                                />
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="12">
                                <h5>{{ $t('paramtersConfig') }}</h5>
                            </v-col>
                            <v-col sm="6" md="4">
                                <v-text-field
                                    id="user"
                                    v-model.trim="parameters.user"
                                    :rules="serviceObjRules.user"
                                    label="The user to be*"
                                    name="user"
                                    required
                                />
                            </v-col>
                            <v-col sm="6" md="4">
                                <v-text-field
                                    id="password"
                                    v-model.trim="parameters.password"
                                    :rules="serviceObjRules.password"
                                    label="The password to use*"
                                    name="password"
                                    required
                                />
                            </v-col>
                            <!-- parameters show only for post mode -->
                            <fragment v-if="mode === 'post' ? true : false">
                                <v-col sm="6" md="4">
                                    <v-text-field
                                        id="version_string"
                                        v-model.trim="parameters.version_string"
                                        label="version_string"
                                        name="version_string"
                                    />
                                </v-col>
                                <v-col
                                    v-for="(param, name) in parameters"
                                    :key="name"
                                    :style="
                                        `display:${typeof param === 'boolean' ? 'block' : 'none'}`
                                    "
                                    cols="12"
                                    sm="12"
                                    md="6"
                                >
                                    <v-checkbox
                                        v-if="typeof param === 'boolean'"
                                        v-model="parameters[name]"
                                        :label="`${$t('enable')} ${name}`"
                                        dense
                                    />
                                </v-col>
                                <v-col sm="6" md="4">
                                    <v-text-field
                                        id="connection_timeout"
                                        v-model.number.trim="parameters.connection_timeout"
                                        label="connection_timeout"
                                        type="number"
                                        min="0"
                                        name="connection_timeout"
                                    />
                                </v-col>
                                <v-col sm="6" md="4">
                                    <v-text-field
                                        id="max_connections"
                                        v-model.number.trim="parameters.max_connections"
                                        label="max_connections"
                                        type="number"
                                        min="0"
                                        name="max_connections"
                                    />
                                </v-col>
                                <v-col sm="6" md="4">
                                    <v-text-field
                                        id="retain_last_statements"
                                        v-model.number.trim="parameters.retain_last_statements"
                                        label="retain_last_statements"
                                        type="number"
                                        name="retain_last_statements"
                                    />
                                </v-col>
                                <v-col sm="6" md="4">
                                    <v-text-field
                                        id="connection_keepalive"
                                        v-model.number.trim="parameters.connection_keepalive"
                                        label="connection_keepalive"
                                        type="number"
                                        name="connection_keepalive"
                                    />
                                </v-col>
                                <v-col sm="6" md="4">
                                    <v-text-field
                                        id="net_write_timeout"
                                        v-model.number.trim="parameters.net_write_timeout"
                                        label="net_write_timeout"
                                        type="number"
                                        name="net_write_timeout"
                                    />
                                </v-col>
                            </fragment>
                        </v-row>
                        <v-row>
                            <v-col cols="12">
                                <h5>{{ $t('relationshipsConfig') }}</h5>
                            </v-col>
                            <v-col xs="12" sm="6">
                                <v-btn
                                    color="primary"
                                    x-small
                                    @click="addRelationshipType('filters')"
                                >
                                    {{ $t('add') }} filter
                                </v-btn>
                                <div
                                    v-if="relationships.filters.data.length"
                                    class="input-div-wrapper"
                                >
                                    <div v-for="(item, i) in relationships.filters.data" :key="i">
                                        <v-btn
                                            class="delete"
                                            right
                                            icon
                                            x-small
                                            @click="deleteRelationshipType('filters', item.id)"
                                        >
                                            <v-icon color="red" size="16">
                                                close
                                            </v-icon>
                                        </v-btn>
                                        <v-text-field
                                            :id="`filter_id-${i}`"
                                            v-model="item.id"
                                            :rules="serviceObjRules.filter_id"
                                            class="input_height_prefix"
                                            label="filter name"
                                            name="filter_id"
                                            dense
                                            outlined
                                            required
                                        />
                                    </div>
                                </div>
                            </v-col>
                            <v-col xs="12" sm="6">
                                <v-btn
                                    color="primary"
                                    x-small
                                    @click="addRelationshipType('servers')"
                                >
                                    {{ $t('add') }} Server
                                </v-btn>
                                <div
                                    v-if="relationships.servers.data.length"
                                    class="input-div-wrapper"
                                >
                                    <div v-for="(item, i) in relationships.servers.data" :key="i">
                                        <v-btn
                                            class="delete"
                                            icon
                                            x-small
                                            @click="deleteRelationshipType('servers', item.id)"
                                        >
                                            <v-icon color="red" size="16">close</v-icon>
                                        </v-btn>
                                        <v-text-field
                                            :id="`server_id-${i}`"
                                            v-model="item.id"
                                            :rules="serviceObjRules.server_id"
                                            class="input_height_prefix"
                                            dense
                                            label="server name"
                                            name="server_id"
                                            outlined
                                            required
                                        />
                                    </div>
                                </div>
                            </v-col>
                        </v-row>
                    </v-form>
                    <b>
                        <small>
                            {{ $t('info.createOrUpdateForm') }}
                        </small>
                    </b>
                </v-container>
            </fragment>
        </template>
        <template v-slot:actions="{ cancel, save }">
            <v-btn
                small
                color="primary"
                class="px-5 text-capitalize"
                rounded
                outlined
                depressed
                @click="cancel"
            >
                {{ $t('cancel') }}
            </v-btn>
            <v-btn
                small
                color="primary"
                class="px-5 text-capitalize"
                rounded
                depressed
                @click="save"
            >
                {{ `${mode === 'post' ? $t('add') : $t('update')}` }}
            </v-btn>
        </template>
    </base-dialog>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
    name: 'service-create-or-update',
    props: {
        value: Boolean,
        closeModal: Function,
        mode: {
            type: String,
            default: 'post', // post||patch
        },
        // only mode patch will need this props
        item: {
            type: Object,
            default: () => {},
        },
    },
    data: function() {
        return {
            isValid: false,
            show: false,
            serviceObjRules: {
                id: [val => this.validateServiceId(val)],
                router: [val => !!val || 'Router is required'],
                password: [val => !!val || 'Password is required'],
                user: [val => !!val || 'User is required'],
                server_id: [val => !!val || 'Server name is required'],
                filter_id: [val => !!val || 'Filter name is required'],
            },
            // service object input values below here
            routing_module: ['readconnroute', 'readwritesplit', 'schemarouter', 'binlogrouter'],
            serviceId: null, // patch mode need to set when get the item props
            router: '',
            parameters: {
                user: 'maxuser',
                password: 'maxpwd',
                enable_root_user: false,
                localhost_match_wildcard_host: true,
                version_string: '',
                auth_all_servers: false,
                strip_db_esc: true,
                log_auth_warnings: true,
                connection_timeout: 0,
                max_connections: 0,
                session_track_trx_state: false,
                retain_last_statements: -1,
                connection_keepalive: 300,
                net_write_timeout: 0,
            },
            relationships: {
                filters: {
                    data: [],
                },
                servers: {
                    data: [],
                },
            },
        }
    },
    computed: {
        ...mapGetters(['allServicesInfo', 'servicesDataMap']),
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
        modalTitle: function() {
            let title = ''
            switch (this.mode) {
                case 'post':
                    title = 'Add a '
                    break
                case 'patch':
                    title = 'Update '
            }
            return title
        },

        /**
         * @returns {Object} Return object service
         */
        getCurrentService: function() {
            return this.servicesDataMap.get(this.item.id) //ONLY AVAILABLE FOR PATCH MODE
        },
    },
    watch: {
        /**
         * ONLY AVAILABLE FOR POST MODE
         */
        serviceId: function(newVal, oldVal) {
            if (this.mode === 'post') {
                // add hyphens when ever input have whitespace
                this.serviceId = newVal.split(' ').join('-')
            }
        },
        /**
         * A watch on show to trigger deep clone object from vuex state for local state modification purpose
         * ONLY AVAILABLE FOR PATCH MODE
         */
        computeShowDialog: function(newVal, oldVal) {
            if (this.mode === 'patch' && newVal === true) {
                const {
                    attributes: { parameters, router },
                    relationships,
                } = this.getCurrentService
                //First set serviceID from item props
                this.serviceId = this.item.id
                // deep object copy or using this.$help.deepClone from lodash
                this.parameters = this.$help.deepClone(parameters)
                this.relationships = this.$help.deepClone(relationships)
                this.router = this.$help.deepClone(router)
                if (this.relationships.filters === undefined) {
                    this.$set(this.relationships, 'filters', { data: [] })
                }
                if (this.relationships.servers === undefined) {
                    this.$set(this.relationships, 'servers', { data: [] })
                }
            }
        },
    },
    methods: {
        ...mapActions(['createOrUpdateService']),
        //ONLY AVAILABLE FOR POST MODE
        validateServiceId(val) {
            if (!val) {
                return 'Service name is required'
            } else if (this.allServicesInfo.idArr.includes(val) && this.mode !== 'patch') {
                return 'Service name is already registered'
            }
            return true
        },
        addRelationshipType(type) {
            switch (type) {
                case 'filters':
                    this.relationships.filters.data.push({ type: 'filters', id: '' })
                    break
                case 'servers':
                    this.relationships.servers.data.push({ type: 'servers', id: '' })
                    break
            }
        },
        /**
         * @param {String} type Type either services or monitors
         * @param {String} targetId targetId to be filterd out
         */
        deleteRelationshipType(type, targetId) {
            switch (type) {
                case 'filters':
                    this.relationships.filters.data = this.relationships.filters.data.filter(
                        item => item.id !== targetId
                    )
                    break
                case 'servers':
                    this.relationships.servers.data = this.relationships.servers.data.filter(
                        item => item.id !== targetId
                    )
                    break
            }
        },

        handleSave() {
            this.$refs.form.validate()
            if (this.isValid) {
                switch (this.mode) {
                    case 'post':
                        // these parameters need to have null value if it is not set
                        this.parameters.version_string = this.$help.treatEmptyStringAsNull(
                            this.parameters.version_string
                        )
                        break
                    case 'patch':
                    // console.log('update')
                }

                this.createOrUpdateService({
                    mode: this.mode,
                    id: this.serviceId,
                    router: this.router,
                    relationships: this.relationships,
                    parameters: this.parameters,
                })
                this.closeModal()
            }
        },
    },
}
</script>
