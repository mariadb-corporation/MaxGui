<template>
    <span>
        <!-- Dialog activator -->
        <v-tooltip top>
            <template v-slot:activator="{ on }">
                <v-btn icon color="primary" v-on="on" @click="dialog = true">
                    <v-icon size="16">$vuetify.icons.edit</v-icon>
                </v-btn>
            </template>
            <span>Service Update</span>
        </v-tooltip>

        <base-dialog
            v-model="dialog"
            :onCancel="() => (dialog = false)"
            :onSave="handleUpdate"
            maxWidth="890px"
        >
            <template v-slot:title>
                <h3>Update service</h3>
            </template>
            <template v-slot:body>
                <fragment>
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
                                        label="Name of the service*"
                                        name="id"
                                        disabled
                                    ></v-text-field>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col id="router" sm="6" md="4">
                                    <v-select
                                        id="router"
                                        v-model="router"
                                        :items="routing_module"
                                        name="router"
                                        label="The router module to use*"
                                        disabled
                                    />
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col cols="12">
                                    <h5>Parameters configurations</h5>
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
                            </v-row>

                            <v-row>
                                <v-col cols="12">
                                    <h5>Relationships configurations</h5>
                                </v-col>
                                <v-col xs="12" sm="6">
                                    <v-btn
                                        color="primary"
                                        x-small
                                        @click="addRelationshipType('filters')"
                                    >
                                        Add filter
                                    </v-btn>
                                    <div
                                        v-if="relationships.filters.data.length"
                                        class="input-div-wrapper"
                                    >
                                        <div
                                            v-for="(filter, i) in relationships.filters.data"
                                            :key="i"
                                        >
                                            <v-btn
                                                class="delete"
                                                right
                                                icon
                                                x-small
                                                @click="
                                                    deleteRelationshipType('filters', filter.id)
                                                "
                                            >
                                                <v-icon color="red" size="16">close</v-icon>
                                            </v-btn>
                                            <v-text-field
                                                id="filter_id"
                                                v-model="filter.id"
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
                                        Add server
                                    </v-btn>
                                    <div
                                        v-if="relationships.servers.data.length"
                                        class="input-div-wrapper"
                                    >
                                        <div
                                            v-for="(server, i) in relationships.servers.data"
                                            :key="i"
                                        >
                                            <v-btn
                                                class="delete"
                                                icon
                                                x-small
                                                @click="
                                                    deleteRelationshipType('servers', server.id)
                                                "
                                            >
                                                <v-icon color="red" size="16">close</v-icon>
                                            </v-btn>
                                            <v-text-field
                                                id="server_id"
                                                v-model="server.id"
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
                    </v-container>
                    <small
                        >Empty value in non-required fileds will be treated as null. *indicates
                        required field.
                    </small>
                </fragment>
            </template>
            <template v-slot:actions="{ cancel, save }">
                <v-btn
                    color="primary"
                    class="px-5 text-capitalize"
                    rounded
                    outlined
                    depressed
                    @click="cancel"
                >
                    Cancel
                </v-btn>
                <v-btn color="primary" class="px-5 text-capitalize" rounded depressed @click="save">
                    Update
                </v-btn>
            </template>
        </base-dialog>
    </span>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
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
        }
    },
    computed: {
        ...mapGetters(['allServicesInfo', 'servicesDataMap']),
        /**
         * @returns {Object} A deep clone object from vuex state
         */
        getCurrentServer: function() {
            return this.servicesDataMap.get(this.item.id)
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
                } = this.getCurrentServer
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

        handleUpdate() {
            this.$refs.form.validate()
            if (this.isValid) {
                this.dialog = false

                this.createOrUpdateService({
                    mode: 'patch',
                    id: this.item.id,
                    router: this.router,
                    relationships: this.relationships,
                    parameters: this.parameters,
                })
            }
        },
    },
}
</script>
