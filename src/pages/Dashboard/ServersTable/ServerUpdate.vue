<template>
    <span>
        <v-tooltip top>
            <!-- Dialog activator -->
            <template v-slot:activator="{ on }">
                <v-btn v-on="on" @click="dialog = true" icon color="primary">
                    <v-icon medium>{{ mdiTableEdit }}</v-icon>
                </v-btn>
            </template>
            <span>Update</span>
        </v-tooltip>
        <base-dialog v-model="dialog" :onCancel="() => (dialog = false)" :onSave="handleUpdate" maxWidth="800px">
            <template v-slot:title>
                <span class="headline">Update server</span>
            </template>
            <template v-slot:body>
                <v-card-text>
                    <v-container>
                        <v-form ref="form" v-model="isValid" @keyup.native.enter="isValid && handleUpdate()">
                            <v-row>
                                <v-col xs="12" sm="6">
                                    <v-text-field
                                        label="Id of the server*"
                                        id="id"
                                        v-model="item.id"
                                        name="id"
                                        required
                                        disabled
                                    />
                                </v-col>
                            </v-row>
                            <h3>Parameters Update</h3>

                            <v-row>
                                <v-col id="addressCol" v-if="parameters.address" sm="6" md="4">
                                    <v-text-field
                                        label="address: 127.0.0.1 *"
                                        id="address"
                                        autofocus
                                        v-model="parameters.address"
                                        :rules="serverObjRules.address"
                                        name="address"
                                        required
                                    />
                                </v-col>
                                <v-col id="socketCol" v-else sm="6" md="4">
                                    <v-text-field
                                        disabled
                                        label="socket *"
                                        id="socket"
                                        v-model.trim="parameters.socket"
                                        :rules="serverObjRules.socket"
                                        name="socket"
                                        required
                                    />
                                </v-col>
                                <v-col v-if="parameters.address" sm="6" md="4">
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
                            </v-row>
                            <v-row>
                                <v-col cols="12">
                                    <h3>Relationships configurations</h3>
                                </v-col>
                                <v-col xs="12" sm="6">
                                    <v-btn color="primary" x-small @click="addRelationship('services')">
                                        Add Service
                                    </v-btn>
                                    <div class="scrollable-input-div" v-if="relationships.services.data.length">
                                        <div v-for="(item, i) in relationships.services.data" :key="i">
                                            <v-btn
                                                class="delete"
                                                right
                                                icon
                                                x-small
                                                @click="deleteRelationship('services', item)"
                                            >
                                                <v-icon color="red">{{ mdiClose }} </v-icon>
                                            </v-btn>
                                            <v-text-field
                                                class="input_height_prefix"
                                                label="Service id"
                                                id="service_id"
                                                v-model="item.id"
                                                name="service_id"
                                                dense
                                                outlined
                                                :rules="serverObjRules.service_id"
                                            />
                                        </div>
                                    </div>
                                </v-col>
                                <v-col xs="12" sm="6">
                                    <v-btn color="primary" x-small @click="addRelationship('monitors')">
                                        Add Monitor
                                    </v-btn>
                                    <div class="scrollable-input-div" v-if="relationships.monitors.data.length">
                                        <div v-for="(item, i) in relationships.monitors.data" :key="i">
                                            <v-btn
                                                class="delete"
                                                icon
                                                x-small
                                                @click="deleteRelationship('monitors', item)"
                                            >
                                                <v-icon color="red">{{ mdiClose }} </v-icon>
                                            </v-btn>
                                            <v-text-field
                                                class="input_height_prefix"
                                                dense
                                                label="Monitor id"
                                                id="monitor_id"
                                                v-model="item.id"
                                                name="monitor_id"
                                                outlined
                                                :rules="serverObjRules.monitor_id"
                                            />
                                        </div>
                                    </div>
                                </v-col>
                            </v-row>
                        </v-form>
                    </v-container>
                </v-card-text>
            </template>
            <template v-slot:actions="{ cancel, save }">
                <v-btn color="blue darken-1" text @click="cancel" depressed>
                    Cancel
                </v-btn>
                <v-btn color="red" :disabled="!isValid" text @click="save" depressed>
                    Update
                </v-btn>
            </template>
        </base-dialog>
    </span>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import { mdiTableEdit, mdiClose } from '@mdi/js';
import { cloneDeep } from 'lodash';

export default {
    name: 'server-update',
    props: {
        item: Object,
    },
    data() {
        return {
            // icons
            mdiTableEdit: mdiTableEdit,
            mdiClose: mdiClose,
            // state
            dialog: false,
            isValid: false,
            serverObjRules: {
                address: [val => !!val || 'Address is required'],
                socket: [val => !!val || 'Socket is required'],
                port: [val => this.validatePortNumber(val)],
                service_id: [val => !!val || 'Id of service is required'],
                monitor_id: [val => !!val || 'Id of monitor is required'],
            },
            parameters: {},
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
        ...mapGetters(['serversDataMap', 'allServersInfo']),
        /**
         * @returns {Object} A deep clone object from vuex state
         */
        getCurrentServer: function() {
            return this.serversDataMap.get(this.item.id);
        },
    },

    watch: {
        /**
         * A watch on dialog to trigger deep clone object from vuex state for local state modification purpose
         */
        dialog: function(newVal, oldVal) {
            if (newVal === true) {
                // deep object copy or using cloneDeep from lodash
                this.parameters = cloneDeep(this.getCurrentServer.attributes.parameters);
                this.relationships = cloneDeep(this.getCurrentServer.relationships);
                if (this.relationships.services === undefined) {
                    this.$set(this.relationships, 'services', { data: [] });
                }
                if (this.relationships.monitors === undefined) {
                    this.$set(this.relationships, 'monitors', { data: [] });
                }
            }
        },
    },
    methods: {
        ...mapActions(['createOrUpdateServer']),
        cloneDeep() {
            return cloneDeep();
        },
        validatePortNumber(val) {
            if (!val) {
                return 'port number is required';
            } else if (this.allServersInfo.portNumArr.includes(val) && val !== this.item.port) {
                return 'port number is already in use';
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
         * @param {Object} target Object to be filterd out
         */
        deleteRelationship(type, target) {
            switch (type) {
                case 'services':
                    this.relationships.services.data = this.relationships.services.data.filter(
                        item => item.id !== target.id
                    );
                    break;
                case 'monitors':
                    this.relationships.monitors.data = this.relationships.monitors.data.filter(
                        item => item.id !== target.id
                    );

                    break;
            }
        },
        handleUpdate() {
            this.$refs.form.validate();
            if (this.isValid) {
                this.dialog = false;
                this.createOrUpdateServer({
                    mode: 'patch',
                    id: this.item.id,
                    relationships: this.relationships,
                    parameters: this.parameters,
                });
            }
        },
    },
};
</script>
