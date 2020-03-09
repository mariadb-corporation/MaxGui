<template>
    <span>
        <!-- Dialog activator -->
        <v-tooltip top>
            <template v-slot:activator="{ on }">
                <v-btn v-on="on" class="ml-5 mr-4 mt-4" @click="dialog = true" color="primary" depressed>
                    <v-icon size="16" class="fa fa-plus" medium />
                </v-btn>
            </template>
            <span>Add Service</span>
        </v-tooltip>

        <base-dialog v-model="dialog" :onCancel="() => (dialog = false)" :onSave="handleCreate" maxWidth="800px">
            <template v-slot:title>
                <span class="headline">Add a service</span>
            </template>
            <template v-slot:body>
                <v-card-text>
                    <v-container>
                        <v-form ref="form" v-model="isValid" @keyup.native.enter="isValid && handleCreate()">
                            <v-row>
                                <v-col xs="12" sm="6">
                                    <v-text-field
                                        label="Name of the service*"
                                        id="id"
                                        v-model="serviceId"
                                        :rules="serviceObjRules.id"
                                        name="id"
                                        autofocus
                                        required
                                    ></v-text-field>
                                </v-col>
                            </v-row>

                            <v-row>
                                <v-col id="router" sm="6" md="4">
                                    <v-select
                                        :items="routing_module"
                                        v-model="router"
                                        name="router"
                                        label="The router module to use*"
                                        id="router"
                                        :rules="serviceObjRules.router"
                                        required
                                    />
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col cols="12">
                                    <h3>Parameters configurations</h3>
                                </v-col>
                                <v-col sm="6" md="4">
                                    <v-text-field
                                        label="The user to be*"
                                        id="user"
                                        v-model.trim="parameters.user"
                                        :rules="serviceObjRules.user"
                                        name="user"
                                        required
                                    />
                                </v-col>
                                <v-col sm="6" md="4">
                                    <v-text-field
                                        label="The password to use*"
                                        id="password"
                                        v-model.trim="parameters.password"
                                        :rules="serviceObjRules.password"
                                        name="password"
                                        required
                                    />
                                </v-col>
                                <v-col sm="6" md="4">
                                    <v-text-field
                                        label="version_string"
                                        id="version_string"
                                        v-model.trim="parameters.version_string"
                                        name="version_string"
                                    />
                                </v-col>
                                <v-col
                                    cols="12"
                                    sm="12"
                                    md="6"
                                    v-for="(value, name) in parameters"
                                    :key="name"
                                    :style="`display:${typeof value === 'boolean' ? 'block' : 'none'}`"
                                >
                                    <v-checkbox
                                        v-if="typeof value === 'boolean'"
                                        dense
                                        v-model="parameters[name]"
                                        :label="`Enable ${name}`"
                                    />
                                </v-col>
                                <v-col sm="6" md="4">
                                    <v-text-field
                                        label="connection_timeout"
                                        id="connection_timeout"
                                        type="number"
                                        min="0"
                                        v-model.number.trim="parameters.connection_timeout"
                                        name="connection_timeout"
                                    />
                                </v-col>
                                <v-col sm="6" md="4">
                                    <v-text-field
                                        label="max_connections"
                                        id="max_connections"
                                        type="number"
                                        min="0"
                                        v-model.number.trim="parameters.max_connections"
                                        name="max_connections"
                                    />
                                </v-col>
                                <v-col sm="6" md="4">
                                    <v-text-field
                                        label="retain_last_statements"
                                        id="retain_last_statements"
                                        type="number"
                                        v-model.number.trim="parameters.retain_last_statements"
                                        name="retain_last_statements"
                                    />
                                </v-col>
                                <v-col sm="6" md="4">
                                    <v-text-field
                                        label="connection_keepalive"
                                        id="connection_keepalive"
                                        type="number"
                                        v-model.number.trim="parameters.connection_keepalive"
                                        name="connection_keepalive"
                                    />
                                </v-col>

                                <v-col sm="6" md="4">
                                    <v-text-field
                                        label="net_write_timeout"
                                        id="net_write_timeout"
                                        type="number"
                                        v-model.number.trim="parameters.net_write_timeout"
                                        name="net_write_timeout"
                                    />
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col cols="12">
                                    <h3>Relationships configurations</h3>
                                </v-col>
                                <v-col xs="12" sm="6">
                                    <v-btn color="primary" x-small @click="addRelationshipType('filters')">
                                        Add filter
                                    </v-btn>
                                    <div class="scrollable-input-div" v-if="relationships.filters.data.length">
                                        <div v-for="(item, i) in relationships.filters.data" :key="i">
                                            <v-btn
                                                class="delete"
                                                right
                                                icon
                                                x-small
                                                @click="deleteRelationshipType('filters', item.id)"
                                            >
                                                <v-icon color="red" size="16" class="fa fa-times-circle" medium />
                                            </v-btn>
                                            <v-text-field
                                                class="input_height_prefix"
                                                label="filter name"
                                                id="filter_id"
                                                v-model="item.id"
                                                name="filter_id"
                                                dense
                                                outlined
                                                :rules="serviceObjRules.filter_id"
                                                required
                                            />
                                        </div>
                                    </div>
                                </v-col>
                                <v-col xs="12" sm="6">
                                    <v-btn color="primary" x-small @click="addRelationshipType('servers')">
                                        Add server
                                    </v-btn>
                                    <div class="scrollable-input-div" v-if="relationships.servers.data.length">
                                        <div v-for="(item, i) in relationships.servers.data" :key="i">
                                            <v-btn
                                                class="delete"
                                                icon
                                                x-small
                                                @click="deleteRelationshipType('servers', item.id)"
                                            >
                                                <v-text-field
                                                    v-model="search"
                                                    append-icon="fa fa-search"
                                                    label="Search"
                                                    single-line
                                                    hide-details
                                                />
                                            </v-btn>
                                            <v-text-field
                                                class="input_height_prefix"
                                                dense
                                                label="server name"
                                                id="server_id"
                                                v-model="item.id"
                                                name="server_id"
                                                :rules="serviceObjRules.server_id"
                                                outlined
                                                required
                                            />
                                        </div>
                                    </div>
                                </v-col>
                            </v-row>
                        </v-form>
                    </v-container>
                    <b>
                        <small>
                            Empty value in non-required fileds will be treated as null. *indicates required field.
                        </small>
                    </b>
                </v-card-text>
            </template>
            <template v-slot:actions="{ cancel, save }">
                <v-btn color="blue darken-1" text @click="cancel" depressed>
                    Cancel
                </v-btn>
                <v-btn color="red" text @click="save" depressed>
                    Add
                </v-btn>
            </template>
        </base-dialog>
    </span>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
    name: 'server-create',
    data: function() {
        return {
            isValid: false,
            dialog: false,
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
            serviceId: null,
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
        };
    },
    computed: {
        ...mapGetters(['allServicesInfo']),
    },
    watch: {
        serviceId: function(newVal, oldVal) {
            // add hyphens when ever input have whitespace
            this.serviceId = newVal.split(' ').join('-');
        },
    },
    methods: {
        ...mapActions(['createOrUpdateService']),

        validateServiceId(val) {
            if (!val) {
                return 'Service name is required';
            } else if (this.allServicesInfo.idArr.includes(val)) {
                return 'Service name is already registered';
            }
            return true;
        },
        addRelationshipType(type) {
            switch (type) {
                case 'filters':
                    this.relationships.filters.data.push({ type: 'filters', id: '' });
                    break;
                case 'servers':
                    this.relationships.servers.data.push({ type: 'servers', id: '' });
                    break;
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
                    );
                    break;
                case 'servers':
                    this.relationships.servers.data = this.relationships.servers.data.filter(
                        item => item.id !== targetId
                    );
                    break;
            }
        },

        handleCreate() {
            this.$refs.form.validate();
            if (this.isValid) {
                this.dialog = false;
                // these parameters need to have null value if it is not set
                this.parameters.version_string = this.$help.treatEmptyStringAsNull(this.parameters.version_string);
                this.createOrUpdateService({
                    mode: 'post',
                    id: this.serviceId,
                    router: this.router,
                    relationships: this.relationships,
                    parameters: this.parameters,
                });
            }
        },
    },
};
</script>

<style lang="scss">
.server-card-add {
    display: flex;
    justify-content: center;
    &__hovered {
        box-shadow: 20px 20px #e1e1e1 !important;
    }
}
.scrollable-input-div {
    padding: 10px 10px;
    border: 1px solid rgba(0, 0, 0, 0.2);
    .delete {
        left: 100%;
        transform: translateX(-100%);
    }
}
.input_height_prefix {
    padding: 0px 10px !important;
    .v-input__control {
        max-height: auto !important;
        .v-text-field__details {
            margin-bottom: 0px !important;
        }
    }
}
</style>
