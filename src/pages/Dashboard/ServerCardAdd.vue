<template>
    <v-dialog v-model="dialog" max-width="600px">
        <template v-slot:activator="{ on }">
            <v-card
                v-on="on"
                hover
                :class="
                    `server-card-add ${show ? 'server-card-add__hovered' : ''}`
                "
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
                    <v-row>
                        <v-col cols="12" sm="6" md="4">
                            <v-text-field
                                label="Legal first name*"
                                required
                            ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                            <v-text-field
                                label="Legal middle name"
                                hint="example of helper text only on focus"
                            ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                            <v-text-field
                                label="Legal last name*"
                                hint="example of persistent helper text"
                                persistent-hint
                                required
                            ></v-text-field>
                        </v-col>
                        <v-col cols="12">
                            <v-text-field
                                label="Email*"
                                required
                            ></v-text-field>
                        </v-col>
                        <v-col cols="12">
                            <v-text-field
                                label="Password*"
                                type="password"
                                required
                            ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6">
                            <v-select
                                :items="['0-17', '18-29', '30-54', '54+']"
                                label="Age*"
                                required
                            ></v-select>
                        </v-col>
                        <v-col cols="12" sm="6">
                            <v-autocomplete
                                :items="[
                                    'Skiing',
                                    'Ice hockey',
                                    'Soccer',
                                    'Basketball',
                                    'Hockey',
                                    'Reading',
                                    'Writing',
                                    'Coding',
                                    'Basejump'
                                ]"
                                label="Interests"
                                multiple
                            ></v-autocomplete>
                        </v-col>
                    </v-row>
                </v-container>
                <small>*indicates required field</small>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="dialog = false"
                    >Close</v-btn
                >
                <v-btn color="blue darken-1" text @click="handleCreate"
                    >Save</v-btn
                >
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
import { mdiPlus } from "@mdi/js";
import { mapActions } from "vuex";

export default {
    name: "server-card-add",
    data: function() {
        return {
            mdiPlus: mdiPlus,
            show: false,
            dialog: false
        };
    },
    methods: {
        ...mapActions(["createServer"]),
        handleCreate() {
            this.dialog = false;
            this.createServer();
        }
    }
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
