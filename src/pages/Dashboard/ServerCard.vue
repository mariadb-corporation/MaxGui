<template>
    <v-card elevation="2" width="100%">
        <v-list-item three-line>
            <v-list-item-content>
                <div class="overline mb-4">{{ item.type }}</div>
                <v-list-item-title class="headline mb-1">
                    {{ item.id }}
                </v-list-item-title>
                <v-list-item-subtitle> State: {{ item.attributes.state }} </v-list-item-subtitle>
                <v-list-item-subtitle> Port: {{ item.attributes.parameters.port }} </v-list-item-subtitle>
                <v-list-item-subtitle>
                    Url:
                    <a target="_blank" rel="noopener" :href="item.links.self"> {{ item.links.self }}</a>
                </v-list-item-subtitle>
            </v-list-item-content>

            <v-icon x-large>{{ mdiServer }}</v-icon>
        </v-list-item>

        <v-card-actions>
            <v-spacer></v-spacer>

            <v-menu bottom origin="center center" transition="scale-transition">
                <template v-slot:activator="{ on }">
                    <v-hover v-slot:default="{ hover }" open-delay="200">
                        <v-icon
                            v-on="on"
                            :class="{ iconHovered: hover }"
                            :color="hover ? '#074e61' : 'primary'"
                            large
                            >{{ mdiDotsHorizontal }}</v-icon
                        >
                    </v-hover>
                </template>

                <v-list>
                    <v-list-item @click="$router.push(`/dashboard/${item.id}`)">
                        <v-list-item-title>
                            View Details
                        </v-list-item-title>
                    </v-list-item>
                    <v-list-item @click="$router.push(`/dashboard/${item.id}`)">
                        <v-list-item-title>
                            Edit
                        </v-list-item-title>
                    </v-list-item>
                    <v-dialog v-model="dialog" max-width="400px">
                        <template v-slot:activator="{ on }">
                            <v-list-item v-on="on">
                                <v-list-item-title>
                                    Delete
                                </v-list-item-title>
                            </v-list-item>
                        </template>
                        <v-card>
                            <v-card-title>
                                <span class="headline">Delete server</span>
                            </v-card-title>
                            <v-card-text>
                                <p>
                                    Are you sure you want to delete
                                    {{ item.id }} ?
                                </p>
                            </v-card-text>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn color="blue darken-1" text @click="dialog = false">Cancel</v-btn>
                                <v-btn color="red" text @click="handleDelete(item.id)">Delete</v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
                </v-list>
            </v-menu>
        </v-card-actions>
    </v-card>
</template>

<script>
import { mdiServer, mdiMore, mdiDotsHorizontal, mdiDelete } from '@mdi/js';
import { mapActions, mapMutations } from 'vuex';

export default {
    name: 'server-card',
    props: {
        item: Object,
    },
    data() {
        return {
            mdiServer: mdiServer,
            mdiMore: mdiMore,
            mdiDotsHorizontal: mdiDotsHorizontal,
            mdiDelete: mdiDelete,
            dialog: false,
        };
    },
    methods: {
        ...mapActions(['deleteServerById']),
        handleDelete(id) {
            this.deleteServerById(id);
        },
    },
};
</script>

<style lang="scss" scoped></style>
