<template>
    <base-dialog
        v-model="computeShowDialog"
        :onCancel="closeModal"
        :onSave="handleSave"
        maxWidth="890px"
        :title="`${modalTitle} ${$t('server')}`"
    >
        <template v-slot:body>
            <v-container class="pa-0">
                <v-form ref="form" v-model="isValid" @keyup.native.enter="isValid && handleSave()">
                    <v-row>
                        <v-col xs="12" sm="6">
                            <v-text-field
                                id="id"
                                v-model="serverId"
                                :rules="serverObjRules.id"
                                label="Name of the server*"
                                name="id"
                                autofocus
                                :disabled="mode === 'patch' ? true : false"
                                required
                            ></v-text-field>
                        </v-col>
                    </v-row>

                    <v-row>
                        <v-col cols="12">
                            <h5>{{ $t('parametersConfig') }}</h5>
                        </v-col>
                        <fragment v-if="mode === 'post' ? true : false">
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
                                    <v-radio :value="true" label="True" />
                                    <v-radio :value="false" label="False" />
                                </v-radio-group>
                            </v-col>
                        </fragment>
                        <!-- radioGroup need to have corresponding value from the item props -->
                        <v-col v-if="radioGroup === 'address'" id="addressCol" sm="6" md="4">
                            <v-text-field
                                id="address"
                                v-model="parameters.address"
                                :rules="serverObjRules.address"
                                label="address: 127.0.0.1 *"
                                name="address"
                                required
                            />
                        </v-col>
                        <v-col v-else id="socketCol" sm="6" md="4">
                            <v-text-field
                                id="socket"
                                v-model.trim="parameters.socket"
                                :rules="serverObjRules.socket"
                                label="socket *"
                                name="socket"
                                required
                            />
                        </v-col>
                        <v-col v-if="radioGroup === 'address'" sm="6" md="4">
                            <v-text-field
                                id="port"
                                v-model.number="parameters.port"
                                :rules="serverObjRules.port"
                                label="port*"
                                type="number"
                                min="1000"
                                max="9999"
                                name="port"
                                required
                            />
                        </v-col>
                        <fragment v-if="mode === 'post' ? true : false">
                            <v-col sm="6" md="4">
                                <v-text-field
                                    id="ssl_cert"
                                    v-model.trim="parameters.ssl_cert"
                                    label="ssl_cert"
                                    name="ssl_cert"
                                />
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
                        </fragment>
                    </v-row>

                    <v-row>
                        <v-col xs="12" sm="12">
                            <h5>{{ $t('relationshipsConfig') }}</h5>
                        </v-col>
                        <v-col xs="12" sm="6">
                            <v-btn color="primary" x-small @click="addRelationship('services')">
                                {{ $t('add') }} Service
                            </v-btn>
                            <div
                                v-if="relationships.services.data.length"
                                class="input-div-wrapper"
                            >
                                <div v-for="(item, i) in relationships.services.data" :key="i">
                                    <v-btn
                                        class="delete"
                                        right
                                        icon
                                        x-small
                                        @click="deleteRelationship('services', item.id)"
                                    >
                                        <v-icon color="red" size="16">close</v-icon>
                                    </v-btn>
                                    <v-text-field
                                        :id="`service_id-${i}`"
                                        v-model="item.id"
                                        :rules="serverObjRules.service_id"
                                        class="input_height_prefix"
                                        label="Service id"
                                        name="service_id"
                                        dense
                                        outlined
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
                                {{ $t('add') }} Monitor
                            </v-btn>
                            <div v-else style="height:20px" />
                            <div
                                v-if="relationships.monitors.data.length"
                                class="input-div-wrapper"
                            >
                                <div v-for="(item, i) in relationships.monitors.data" :key="i">
                                    <v-btn
                                        class="delete"
                                        icon
                                        x-small
                                        @click="deleteRelationship('monitors', item.id)"
                                    >
                                        <v-icon color="red" size="16">close</v-icon>
                                    </v-btn>
                                    <v-text-field
                                        :id="`monitor_id-${i}`"
                                        v-model="item.id"
                                        :rules="serverObjRules.monitor_id"
                                        class="input_height_prefix"
                                        dense
                                        label="Monitor id"
                                        name="monitor_id"
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

export default {
    name: 'monitor-create-or-update',
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
            serverId: null, // patch mode need to set when get the item props
            parameters: {
                user: 'maxuser',
                password: 'maxpwd',
                monitor_interval: null,
                backend_connect_timeout: null,
                backend_write_timeout: null,
                backend_read_timeout: 'MAX',
                ssl_cert_verify_depth: 9,
                backend_connect_attempts: false,
            },
            relationships: {
                services: {
                    data: [],
                },
                monitors: {
                    data: [],
                },
            },
        }
    },
    computed: {
        ...mapGetters(['allServersInfo', 'allServersMap']),
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
         * @returns {Object} Return object server
         */
        getCurrentServer: function() {
            return this.allServersMap.get(this.item.id) //ONLY AVAILABLE FOR PATCH MODE
        },
    },
    watch: {
        /**
         * ONLY AVAILABLE FOR POST MODE
         */
        serverId: function(newVal, oldVal) {
            if (this.mode === 'post') {
                // add hyphens when ever input have whitespace
                this.serverId = newVal.split(' ').join('-')
            }
        },
        /**
         * ONLY AVAILABLE FOR POST MODE
         */
        radioGroup: function(newVal, oldVal) {
            if (this.mode === 'post') {
                if (newVal === 'address') {
                    this.parameters.socket = null
                } else {
                    this.parameters.address = '127.0.0.1'
                }
            }
        },
        /**
         * A watch on show to trigger deep clone object from vuex state for local state modification purpose
         * ONLY AVAILABLE FOR PATCH MODE
         */
        computeShowDialog: function(newVal, oldVal) {
            if (this.mode === 'patch' && newVal === true) {
                const {
                    attributes: { parameters },
                    relationships,
                } = this.getCurrentServer
                //First set serverId from item props
                this.serverId = this.item.id
                this.radioGroup = parameters.address ? 'address' : 'socket'
                // deep object copy or using this.$_.cloneDeep from lodash
                this.parameters = this.$_.cloneDeep(parameters)
                this.relationships = this.$_.cloneDeep(relationships)
                if (this.relationships.services === undefined) {
                    this.$set(this.relationships, 'services', { data: [] })
                }
                if (this.relationships.monitors === undefined) {
                    this.$set(this.relationships, 'monitors', { data: [] })
                }
            }
        },
    },
    methods: {
        ...mapActions(['createOrUpdateServer']),
        //ONLY AVAILABLE FOR POST MODE
        validatePortNumber(val) {
            if (!val) {
                return 'port number is required'
            } else if (this.allServersInfo.portNumArr.includes(val) && this.mode !== 'patch') {
                return 'port number is already in use'
            }
            return true
        },
        //ONLY AVAILABLE FOR POST MODE
        validateServerId(val) {
            if (!val) {
                return 'id is required'
            } else if (this.allServersInfo.idArr.includes(val) && this.mode !== 'patch') {
                return 'id is already registered'
            }
            return true
        },
        addRelationship(type) {
            switch (type) {
                case 'services':
                    this.relationships.services.data.push({ type: 'services', id: '' })
                    break
                case 'monitors':
                    this.relationships.monitors.data.push({ type: 'monitors', id: '' })
                    break
            }
        },
        /**
         * @param {String} type Type either services or monitors
         * @param {String} targetId targetId to be filterd out
         */
        deleteRelationship(type, targetId) {
            switch (type) {
                case 'services':
                    this.relationships.services.data = this.relationships.services.data.filter(
                        item => item.id !== targetId
                    )
                    break
                case 'monitors':
                    this.relationships.monitors.data = this.relationships.monitors.data.filter(
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
                        this.parameters.socket = this.$help.treatEmptyStringAsNull(
                            this.parameters.socket
                        )
                        this.parameters.ssl_cert = this.$help.treatEmptyStringAsNull(
                            this.parameters.ssl_cert
                        )
                        this.parameters.ssl_ca_cert = this.$help.treatEmptyStringAsNull(
                            this.parameters.ssl_ca_cert
                        )
                        break
                    case 'patch':
                    // console.log('update')
                }

                this.createOrUpdateServer({
                    mode: this.mode,
                    id: this.serverId,
                    relationships: this.relationships,
                    parameters: this.parameters,
                })
                this.closeModal()
            }
        },
    },
}
</script>

<style lang="scss">
.server-card-add {
    display: flex;
    justify-content: center;
    &__hovered {
        box-shadow: 20px 20px #e1e1e1 !important;
    }
}
.input-div-wrapper {
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
