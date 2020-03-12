<template>
    <span>
        <v-tooltip top>
            <!-- Dialog activator -->
            <template v-slot:activator="{ on }">
                <v-btn icon color="primary" v-on="on" @click="dialog = true">
                    <v-icon size="16">$vuetify.icons.edit</v-icon>
                </v-btn>
            </template>
            <span>Server Update</span>
        </v-tooltip>
        <base-dialog
            v-model="dialog"
            :onCancel="() => (dialog = false)"
            :onSave="handleUpdate"
            maxWidth="800px"
        >
            <template v-slot:title>
                <span class="headline">Update server</span>
            </template>
            <template v-slot:body>
                <v-card-text>
                    <v-container>
                        <v-form
                            ref="form"
                            v-model="isValid"
                            @keyup.native.enter="isValid && handleUpdate()"
                        >
                            <v-row>
                                <v-col xs="12" sm="6">
                                    <v-text-field
                                        id="id"
                                        v-model="item.id"
                                        label="Id of the server*"
                                        name="id"
                                        required
                                        disabled
                                    />
                                </v-col>
                            </v-row>
                            <h3>Parameters Update</h3>

                            <v-row>
                                <v-col v-if="parameters.address" id="addressCol" sm="6" md="4">
                                    <v-text-field
                                        id="address"
                                        v-model="parameters.address"
                                        :rules="serverObjRules.address"
                                        label="address: 127.0.0.1 *"
                                        autofocus
                                        name="address"
                                        required
                                    />
                                </v-col>
                                <v-col v-else id="socketCol" sm="6" md="4">
                                    <v-text-field
                                        id="socket"
                                        v-model.trim="parameters.socket"
                                        :rules="serverObjRules.socket"
                                        disabled
                                        label="socket *"
                                        name="socket"
                                        required
                                    />
                                </v-col>
                                <v-col v-if="parameters.address" sm="6" md="4">
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
                            </v-row>
                            <v-row>
                                <v-col cols="12">
                                    <h3>Relationships configurations</h3>
                                </v-col>
                                <v-col xs="12" sm="6">
                                    <v-btn
                                        color="primary"
                                        x-small
                                        @click="addRelationship('services')"
                                    >
                                        Add Service
                                    </v-btn>
                                    <div
                                        v-if="relationships.services.data.length"
                                        class="input-div-wrapper"
                                    >
                                        <div
                                            v-for="(service, i) in relationships.services.data"
                                            :key="i"
                                        >
                                            <v-btn
                                                class="delete"
                                                right
                                                icon
                                                x-small
                                                @click="deleteRelationship('services', service.id)"
                                            >
                                                <v-icon color="red" size="16">close</v-icon>
                                            </v-btn>
                                            <v-text-field
                                                id="service_id"
                                                v-model="service.id"
                                                :rules="serverObjRules.service_id"
                                                class="input_height_prefix"
                                                label="Service id"
                                                name="service_id"
                                                dense
                                                outlined
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
                                    <div
                                        v-if="relationships.monitors.data.length"
                                        class="input-div-wrapper"
                                    >
                                        <div
                                            v-for="(monitor, i) in relationships.monitors.data"
                                            :key="i"
                                        >
                                            <v-btn
                                                class="delete"
                                                icon
                                                x-small
                                                @click="deleteRelationship('monitors', monitor.id)"
                                            >
                                                <v-icon color="red" size="16">close</v-icon>
                                            </v-btn>
                                            <v-text-field
                                                id="monitor_id"
                                                v-model="monitor.id"
                                                :rules="serverObjRules.monitor_id"
                                                class="input_height_prefix"
                                                dense
                                                label="Monitor id"
                                                name="monitor_id"
                                                outlined
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
                <v-btn color="blue darken-1" text depressed @click="cancel">
                    Cancel
                </v-btn>
                <v-btn :disabled="!isValid" color="red" text depressed @click="save">
                    Update
                </v-btn>
            </template>
        </base-dialog>
    </span>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
    name: 'ServerUpdate',
    props: {
        item: Object,
    },
    data() {
        return {
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
                // deep object copy or using this.$help.deepClone from lodash
                this.parameters = this.$help.deepClone(this.getCurrentServer.attributes.parameters);
                this.relationships = this.$help.deepClone(this.getCurrentServer.relationships);
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
         * @param {String} targetId targetId to be filterd out
         */
        deleteRelationship(type, targetId) {
            switch (type) {
                case 'services':
                    this.relationships.services.data = this.relationships.services.data.filter(
                        item => item.id !== targetId
                    );
                    break;
                case 'monitors':
                    this.relationships.monitors.data = this.relationships.monitors.data.filter(
                        item => item.id !== targetId
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
