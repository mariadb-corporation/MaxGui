<template>
    <span>
        <!-- Dialog activator -->
        <v-tooltip top>
            <template v-slot:activator="{ on }">
                <v-btn v-on="on" class="ml-5 mr-4 mt-4" @click="dialog = true" color="primary" depressed>
                    <v-icon medium>{{ mdiPlus }}</v-icon>
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
                                <v-col cols="12" xs="12" sm="6">
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
                                <v-col id="router" cols="12" sm="6" md="4">
                                    <v-text-field
                                        label="The router module to use*"
                                        id="router"
                                        v-model="router"
                                        :rules="serviceObjRules.router"
                                        name="router"
                                        required
                                    />
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col cols="12" xs="12" sm="12">
                                    <h3>Parameters configurations</h3>
                                </v-col>
                                <v-col cols="12" sm="6" md="4">
                                    <v-text-field
                                        label="The user to be*"
                                        id="user"
                                        v-model.trim="parameters.user"
                                        :rules="serviceObjRules.user"
                                        name="user"
                                        required
                                    />
                                </v-col>
                                <v-col cols="12" sm="6" md="4">
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
                                <v-col cols="12" xs="12" sm="12">
                                    <h3>Relationships configurations</h3>
                                </v-col>
                                <v-col cols="12" xs="12" sm="6">
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
                                                @click="deleteRelationshipType('filters', item)"
                                            >
                                                <v-icon color="red">{{ mdiClose }} </v-icon>
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
                                <v-col cols="12" xs="12" sm="6">
                                    <v-btn color="primary" x-small @click="addRelationshipType('servers')">
                                        Add server
                                    </v-btn>
                                    <div class="scrollable-input-div" v-if="relationships.servers.data.length">
                                        <div v-for="(item, i) in relationships.servers.data" :key="i">
                                            <v-btn
                                                class="delete"
                                                icon
                                                x-small
                                                @click="deleteRelationshipType('servers', item)"
                                            >
                                                <v-icon color="red">{{ mdiClose }} </v-icon>
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
                <v-btn color="red" text @click="save" depressed>
                    Add
                </v-btn>
            </template>
        </base-dialog>
    </span>
</template>

<script>
import { mdiPlus, mdiClose } from '@mdi/js';
import { mapActions, mapGetters } from 'vuex';

export default {
    name: 'server-create',
    data: function() {
        return {
            isValid: false,
            mdiPlus: mdiPlus,
            mdiClose: mdiClose,
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
            serviceId: null,
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
         * @param {Object} target Object to be filterd out
         */
        deleteRelationshipType(type, target) {
            switch (type) {
                case 'filters':
                    this.relationships.filters.data = this.relationships.filters.data.filter(
                        item => item.id !== target.id
                    );
                    break;
                case 'servers':
                    this.relationships.servers.data = this.relationships.servers.data.filter(
                        item => item.id !== target.id
                    );
                    break;
            }
        },

        handleCreate() {
            this.$refs.form.validate();
            if (this.isValid) {
                this.dialog = false;

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
