<template>
    <v-dialog v-model="dialog" max-width="600px">
        <template v-slot:activator="{ on }">
            <v-card
                v-on="on"
                hover
                :class="`server-card-add ${show ? 'server-card-add__hovered' : ''}`"
                ripple
                min-height="180px"
                height="100%"
                width="100%"
                :outlined="show"
                @mouseover="show = true"
                @mouseleave="show = false"
            >
                <v-card-actions>
                    <v-tooltip v-model="show" top>
                        <template v-slot:activator="{ on }">
                            <v-btn v-on="on" dark color="primary" depressed>
                                <v-icon x-large>{{ mdiPlus }}</v-icon>
                            </v-btn>
                        </template>
                        <span>Add Server</span>
                    </v-tooltip>
                </v-card-actions>
            </v-card>
        </template>
        <v-card>
            <v-card-title>
                <span class="headline">Add a server</span>
            </v-card-title>
            <v-card-text>
                <v-container>
                    <v-form ref="form" v-model="isValid" @keyup.native.enter="isValid && handleCreate()">
                        <v-row>
                            <v-col cols="12" xs="12" sm="6">
                                <v-text-field
                                    label="Id of the server*"
                                    id="id"
                                    v-model="serverId"
                                    :rules="serverObjRules.id"
                                    name="id"
                                    autofocus
                                    required
                                ></v-text-field>
                            </v-col>
                        </v-row>
                        <h3>Parameters configurations</h3>
                        <v-row>
                            <v-col cols="12" xs="12" sm="6">
                                <span>Use either address or socket</span>
                                <v-radio-group v-model="radioGroup">
                                    <v-radio label="Use address" value="address" />
                                    <v-radio label="Use socket" value="socket" />
                                </v-radio-group>
                            </v-col>
                            <v-col cols="12" xs="12" sm="6">
                                <span>ssl_verify_peer_certificate</span>
                                <v-radio-group v-model="parameters.ssl_verify_peer_certificate">
                                    <v-radio label="True" :value="true" />
                                    <v-radio label="False" :value="false" />
                                </v-radio-group>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col id="addressCol" v-if="radioGroup === 'address'" cols="12" sm="6" md="4">
                                <v-text-field
                                    label="address: 127.0.0.1 *"
                                    id="address"
                                    v-model="parameters.address"
                                    :rules="serverObjRules.address"
                                    name="address"
                                    required
                                />
                            </v-col>
                            <v-col id="socketCol" v-else cols="12" sm="6" md="4">
                                <v-text-field
                                    label="socket *"
                                    id="socket"
                                    v-model.trim="parameters.socket"
                                    :rules="serverObjRules.socket"
                                    name="socket"
                                    required
                                />
                            </v-col>
                            <v-col cols="12" sm="6" md="4">
                                <v-text-field
                                    label="port*"
                                    type="number"
                                    min="1000"
                                    max="9999"
                                    id="port"
                                    v-model.number="parameters.port"
                                    :rules="serverObjRules.port"
                                    name="port"
                                    required
                                />
                            </v-col>
                            <v-col cols="12" sm="6" md="4">
                                <v-select
                                    :items="protocolItems"
                                    v-model="parameters.protocol"
                                    name="protocol"
                                    label="protocol"
                                    id="protocol"
                                />
                            </v-col>
                            <v-col cols="12" sm="6" md="4">
                                <v-text-field
                                    label="authenticator"
                                    id="authenticator"
                                    v-model.trim="parameters.authenticator"
                                    name="authenticator"
                                />
                            </v-col>
                            <v-col cols="12" sm="6" md="4">
                                <v-text-field
                                    label="ssl_key"
                                    id="ssl_key"
                                    v-model.trim="parameters.ssl_key"
                                    name="ssl_key"
                                />
                            </v-col>
                            <v-col cols="12" sm="6" md="4">
                                <v-text-field
                                    label="ssl_cert"
                                    id="ssl_cert"
                                    v-model.trim="parameters.ssl_cert"
                                    name="ssl_cert"
                                />
                            </v-col>
                            <v-col cols="12" sm="6" md="4">
                                <v-text-field
                                    label="ssl_ca_cert"
                                    id="ssl_ca_cert"
                                    v-model.trim="parameters.ssl_ca_cert"
                                    name="ssl_ca_cert"
                                />
                            </v-col>
                            <v-col cols="12" sm="6" md="4">
                                <v-select
                                    :items="ssl_versionItems"
                                    v-model="parameters.ssl_version"
                                    name="ssl_version"
                                    label="ssl_version"
                                    id="ssl_version"
                                />
                            </v-col>

                            <v-col cols="12" sm="6" md="4">
                                <v-text-field
                                    label="ssl_cert_verify_depth"
                                    type="number"
                                    min="1"
                                    id="ssl_cert_verify_depth"
                                    v-model.number="parameters.ssl_cert_verify_depth"
                                    name="ssl_cert_verify_depth"
                                />
                            </v-col>
                        </v-row>
                    </v-form>
                </v-container>
                <small>Empty value in non-required fileds will be treated as null. *indicates required field. </small>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="dialog = false">Close</v-btn>
                <v-btn color="blue darken-1" :disabled="!isValid" text @click="handleCreate">Save</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
/* eslint-disable camelcase */
import { mdiPlus } from '@mdi/js';
import { mapActions, mapGetters } from 'vuex';

export default {
    name: 'server-card-add',
    computed: {
        ...mapGetters(['serversData']),
        allServersInfo: function() {
            let idArr = [];
            let portNumArr = [];
            return this.serversData.reduce((accumulator, _, index, array) => {
                idArr.push(array[index].id);
                portNumArr.push(array[index].attributes.parameters.port);

                return (accumulator = { idArr: idArr, portNumArr: portNumArr });
            }, []);
        },
    },
    data: function() {
        return {
            isValid: false,
            mdiPlus: mdiPlus,
            show: false,
            dialog: false,
            radioGroup: 'address',
            serverObjRules: {
                id: [val => this.validateServerId(val)],
                address: [val => !!val || 'Address is required'],
                socket: [val => !!val || 'Socket is required'],
                port: [val => this.validatePortNumber(val)],
            },
            protocolItems: ['mariadbclient', 'mariadbbackend'],
            ssl_versionItems: ['TLSv10', 'TLSv11', 'TLSv12', 'TLSv13', 'MAX'],
            // server object attributes input values below here
            serverId: null,
            parameters: {
                address: '127.0.0.1',
                socket: null,
                port: null,
                protocol: null,
                authenticator: null,
                ssl_key: null,
                ssl_cert: null,
                ssl_ca_cert: null,
                ssl_version: 'MAX',
                ssl_cert_verify_depth: 9,
                ssl_verify_peer_certificate: false,
            },
            relationships: {
                services: {
                    data: [
                        {
                            id: 'RW-Split-Router',
                            type: 'services',
                        },
                        {
                            id: 'Read-Connection-Router',
                            type: 'services',
                        },
                    ],
                },
                monitors: {
                    data: [
                        {
                            id: 'MySQL-Monitor',
                            type: 'monitors',
                        },
                    ],
                },
            },
        };
    },
    methods: {
        ...mapActions(['createServer']),
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
        handleCreate() {
            this.dialog = false;

            // these parameters need to have null value if it is not set
            this.parameters.socket = this.$help.treatEmptyStringAsNull(this.parameters.socket);
            this.parameters.authenticator = this.$help.treatEmptyStringAsNull(this.parameters.authenticator);
            this.parameters.ssl_key = this.$help.treatEmptyStringAsNull(this.parameters.ssl_key);
            this.parameters.ssl_cert = this.$help.treatEmptyStringAsNull(this.parameters.ssl_cert);
            this.parameters.ssl_ca_cert = this.$help.treatEmptyStringAsNull(this.parameters.ssl_ca_cert);

            this.createServer({ id: this.serverId, parameters: this.parameters });
        },
    },
    watch: {
        radioGroup: function(newVal, oldVal) {
            if (newVal === 'address') {
                this.parameters.socket = null;
            } else {
                this.parameters.address = '127.0.0.1';
            }
        },
    },
};
</script>

<style lang="scss" scoped>
.server-card-add {
    display: flex;
    justify-content: center;
    &__hovered {
        box-shadow: 20px 20px #e1e1e1 !important;
    }
}
</style>
