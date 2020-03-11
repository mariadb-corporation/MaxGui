<template>
    <base-dialog v-model="computeShowDialog" :onCancel="closeModal" :onSave="handleCreate" maxWidth="800px">
        <template v-slot:title>
            <h3>Add a server</h3>
        </template>
        <template v-slot:body>
            <v-card-text>
                <v-container>
                    <v-form ref="form" v-model="isValid" @keyup.native.enter="isValid && handleCreate()">
                        <v-row>
                            <v-col xs="12" sm="6">
                                <v-text-field
                                    id="id"
                                    v-model="serverId"
                                    label="Name of the server*"
                                    :rules="serverObjRules.id"
                                    name="id"
                                    autofocus
                                    required
                                ></v-text-field>
                            </v-col>
                        </v-row>

                        <v-row>
                            <v-col cols="12">
                                <h5>Parameters configurations</h5>
                            </v-col>
                            <v-col xs="12" sm="6">
                                <span>Use either address or socket</span>
                                <v-radio-group v-model="radioGroup">
                                    <v-radio label="Use address" value="address" />
                                    <v-radio label="Use socket" value="socket" />
                                </v-radio-group>
                            </v-col>
                            <v-col xs="12" sm="6">
                                <span>ssl_verify_peer_certificate</span>
                                <v-radio-group v-model="parameters.ssl_verify_peer_certificate">
                                    <v-radio label="True" :value="true" />
                                    <v-radio label="False" :value="false" />
                                </v-radio-group>
                            </v-col>
                            <v-col v-if="radioGroup === 'address'" id="addressCol" sm="6" md="4">
                                <v-text-field
                                    id="address"
                                    v-model="parameters.address"
                                    label="address: 127.0.0.1 *"
                                    :rules="serverObjRules.address"
                                    name="address"
                                    required
                                />
                            </v-col>
                            <v-col v-else id="socketCol" sm="6" md="4">
                                <v-text-field
                                    id="socket"
                                    v-model.trim="parameters.socket"
                                    label="socket *"
                                    :rules="serverObjRules.socket"
                                    name="socket"
                                    required
                                />
                            </v-col>
                            <v-col v-if="radioGroup === 'address'" sm="6" md="4">
                                <v-text-field
                                    id="port"
                                    v-model.number="parameters.port"
                                    label="port*"
                                    type="number"
                                    min="1000"
                                    max="9999"
                                    :rules="serverObjRules.port"
                                    name="port"
                                    required
                                />
                            </v-col>

                            <v-col sm="6" md="4">
                                <v-text-field id="ssl_cert" v-model.trim="parameters.ssl_cert" label="ssl_cert" name="ssl_cert" />
                            </v-col>
                            <v-col sm="6" md="4">
                                <v-text-field
                                    id="ssl_ca_cert"
                                    v-model.trim="parameters.ssl_ca_cert"
                                    label="ssl_ca_cert"
                                    name="ssl_ca_cert"
                                />
                            </v-col>
                            <v-col sm="6" md="4">
                                <v-select
                                    id="ssl_version"
                                    v-model="parameters.ssl_version"
                                    :items="ssl_versionItems"
                                    name="ssl_version"
                                    label="ssl_version"
                                />
                            </v-col>

                            <v-col sm="6" md="4">
                                <v-text-field
                                    id="ssl_cert_verify_depth"
                                    v-model.number="parameters.ssl_cert_verify_depth"
                                    label="ssl_cert_verify_depth"
                                    type="number"
                                    min="1"
                                    name="ssl_cert_verify_depth"
                                />
                            </v-col>
                        </v-row>

                        <v-row>
                            <v-col xs="12" sm="12">
                                <h5>Relationships configurations</h5>
                            </v-col>
                            <v-col xs="12" sm="6">
                                <v-btn color="primary" x-small @click="addRelationship('services')">
                                    Add Service
                                </v-btn>
                                <div v-if="relationships.services.data.length" class="scrollable-input-div">
                                    <div v-for="(item, i) in relationships.services.data" :key="i">
                                        <v-btn class="delete" right icon x-small @click="deleteRelationship('services', item.id)">
                                            <v-icon color="red" size="16">close</v-icon>
                                        </v-btn>
                                        <v-text-field
                                            id="service_id"
                                            v-model="item.id"
                                            class="input_height_prefix"
                                            label="Service id"
                                            name="service_id"
                                            dense
                                            outlined
                                            :rules="serverObjRules.service_id"
                                            required
                                        />
                                    </div>
                                </div>
                            </v-col>
                            <v-col xs="12" sm="6">
                                <v-btn
                                    v-if="relationships.monitors.data.length == 0"
                                    color="primary"
                                    x-small
                                    @click="addRelationship('monitors')"
                                >
                                    Add Monitor
                                </v-btn>
                                <div v-else style="height:20px" />
                                <div v-if="relationships.monitors.data.length" class="scrollable-input-div">
                                    <div v-for="(item, i) in relationships.monitors.data" :key="i">
                                        <v-btn class="delete" icon x-small @click="deleteRelationship('monitors', item.id)">
                                            <v-icon color="red" size="16">close</v-icon>
                                        </v-btn>
                                        <v-text-field
                                            id="monitor_id"
                                            v-model="item.id"
                                            class="input_height_prefix"
                                            dense
                                            label="Monitor id"
                                            name="monitor_id"
                                            outlined
                                            :rules="serverObjRules.monitor_id"
                                            required
                                        />
                                    </div>
                                </div>
                            </v-col>
                        </v-row>
                    </v-form>
                </v-container>
                <small>Empty value in non-required fileds will be treated as null. *indicates required field. </small>
            </v-card-text>
        </template>
        <template v-slot:actions="{ cancel, save }">
            <v-btn color="blue darken-1" text depressed @click="cancel">
                Cancel
            </v-btn>
            <v-btn color="red" text depressed @click="save">
                Add
            </v-btn>
        </template>
    </base-dialog>
</template>

<script>
    import { mapActions, mapGetters } from 'vuex';

    export default {
        name: 'ServiceCreate',
        props: {
            value: Boolean,
            closeModal: Function,
        },
        data: function() {
            return {
                isValid: false,
                show: false,
                radioGroup: 'address',
                serverObjRules: {
                    id: [val => this.validateServerId(val)],
                    address: [val => !!val || 'Address is required'],
                    socket: [val => !!val || 'Socket is required'],
                    port: [val => this.validatePortNumber(val)],
                    service_id: [val => !!val || 'Service name is required'],
                    monitor_id: [val => !!val || 'Monitor name is required'],
                },
                ssl_versionItems: ['TLSv10', 'TLSv11', 'TLSv12', 'TLSv13', 'MAX'],
                // server object attributes input values below here
                serverId: null,
                parameters: {
                    address: '127.0.0.1',
                    socket: null,
                    port: null,
                    ssl_cert: null,
                    ssl_ca_cert: null,
                    ssl_version: 'MAX',
                    ssl_cert_verify_depth: 9,
                    ssl_verify_peer_certificate: false,
                },
                relationships: {
                    services: {
                        data: [],
                    },
                    monitors: {
                        data: [],
                    },
                },
            };
        },
        computed: {
            ...mapGetters(['allServersInfo']),
            computeShowDialog: {
                // get value from props
                get() {
                    return this.value;
                },
                // set the value to show property in data
                set(value) {
                    this.show = value;
                },
            },
        },
        watch: {
            serverId: function(newVal, oldVal) {
                // add hyphens when ever input have whitespace
                this.serverId = newVal.split(' ').join('-');
            },
            radioGroup: function(newVal, oldVal) {
                if (newVal === 'address') {
                    this.parameters.socket = null;
                } else {
                    this.parameters.address = '127.0.0.1';
                }
            },
        },
        methods: {
            ...mapActions(['createOrUpdateServer']),
            validatePortNumber(val) {
                if (!val) {
                    return 'port number is required';
                } else if (this.allServersInfo.portNumArr.includes(val)) {
                    return 'port number is already in use';
                }
                return true;
            },
            validateServerId(val) {
                if (!val) {
                    return 'id is required';
                } else if (this.allServersInfo.idArr.includes(val)) {
                    return 'id is already registered';
                }
                return true;
            },
            addRelationship(type) {
                switch (type) {
                    case 'services':
                        this.relationships.services.data.push({ type: 'services', id: '' });
                        break;
                    case 'monitors':
                        this.relationships.monitors.data.push({ type: 'monitors', id: '' });
                        break;
                }
            },
            /**
             * @param {String} type Type either services or monitors
             * @param {String} targetId targetId to be filterd out
             */
            deleteRelationship(type, targetId) {
                switch (type) {
                    case 'services':
                        this.relationships.services.data = this.relationships.services.data.filter(item => item.id !== targetId);
                        break;
                    case 'monitors':
                        this.relationships.monitors.data = this.relationships.monitors.data.filter(item => item.id !== targetId);
                        break;
                }
            },

            handleCreate() {
                this.$refs.form.validate();
                if (this.isValid) {
                    this.closeModal();

                    // these parameters need to have null value if it is not set
                    this.parameters.socket = this.$help.treatEmptyStringAsNull(this.parameters.socket);
                    this.parameters.authenticator = this.$help.treatEmptyStringAsNull(this.parameters.authenticator);
                    this.parameters.ssl_key = this.$help.treatEmptyStringAsNull(this.parameters.ssl_key);
                    this.parameters.ssl_cert = this.$help.treatEmptyStringAsNull(this.parameters.ssl_cert);
                    this.parameters.ssl_ca_cert = this.$help.treatEmptyStringAsNull(this.parameters.ssl_ca_cert);

                    this.createOrUpdateServer({
                        mode: 'post',
                        id: this.serverId,
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
