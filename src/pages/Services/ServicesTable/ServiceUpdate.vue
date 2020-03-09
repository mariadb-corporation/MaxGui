<template>
    <span>
        <!-- Dialog activator -->
        <v-tooltip top>
            <template v-slot:activator="{ on }">
                <v-btn v-on="on" @click="dialog = true" icon color="primary">
                    <v-icon size="16" class="fa fa-edit" medium />
                </v-btn>
            </template>
            <span>Service Update</span>
        </v-tooltip>

        <base-dialog v-model="dialog" :onCancel="() => (dialog = false)" :onSave="handleUpdate" maxWidth="800px">
            <template v-slot:title>
                <span class="headline">Add a service</span>
            </template>
            <template v-slot:body>
                <v-card-text>
                    <v-container>
                        <v-form ref="form" v-model="isValid" @keyup.native.enter="isValid && handleUpdate()">
                            <v-row>
                                <v-col xs="12" sm="6">
                                    <v-text-field
                                        label="Name of the service*"
                                        id="id"
                                        v-model="item.id"
                                        name="id"
                                        disabled
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
                                        disabled
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
                            </v-row>

                            <v-row>
                                <v-col xs="12">
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
                                                <v-icon color="red" size="16" class="fa fa-times-circle" medium />
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
                    <small
                        >Empty value in non-required fileds will be treated as null. *indicates required field.
                    </small>
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
export default {
    name: 'service-update',
    props: {
        item: Object,
    },
    data: function() {
        return {
            isValid: false,
            dialog: false,
            serviceObjRules: {
                password: [val => !!val || 'Password is required'],
                user: [val => !!val || 'User is required'],
                server_id: [val => !!val || 'Server name is required'],
                filter_id: [val => !!val || 'Filter name is required'],
            },
            // service object input values below here
            routing_module: ['readconnroute', 'readwritesplit', 'schemarouter', 'binlogrouter'],
            router: '',
            parameters: {
                user: 'maxuser',
                password: 'maxpwd',
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
        ...mapGetters(['allServicesInfo', 'servicesDataMap']),
        /**
         * @returns {Object} A deep clone object from vuex state
         */
        getCurrentServer: function() {
            return this.servicesDataMap.get(this.item.id);
        },
    },
    watch: {
        /**
         * A watch on dialog to trigger deep clone object from vuex state for local state modification purpose
         */
        dialog: function(newVal, oldVal) {
            if (newVal === true) {
                const {
                    attributes: { parameters, router },
                    relationships,
                } = this.getCurrentServer;
                // deep object copy or using this.$help.deepClone from lodash
                this.parameters = this.$help.deepClone(parameters);
                this.relationships = this.$help.deepClone(relationships);
                this.router = this.$help.deepClone(router);
                if (this.relationships.filters === undefined) {
                    this.$set(this.relationships, 'filters', { data: [] });
                }
                if (this.relationships.servers === undefined) {
                    this.$set(this.relationships, 'servers', { data: [] });
                }
            }
        },
    },
    methods: {
        ...mapActions(['createOrUpdateService']),
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

        handleUpdate() {
            this.$refs.form.validate();
            if (this.isValid) {
                this.dialog = false;

                this.createOrUpdateService({
                    mode: 'patch',
                    id: this.item.id,
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
