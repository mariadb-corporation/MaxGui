<template>
    <v-card elevation="2" width="100%">
        <v-list-item three-line>
            <v-list-item-content>
                <div class="overline mb-4">{{ item.type }}</div>
                <v-list-item-title class="headline mb-1">
                    {{ item.id }}
                </v-list-item-title>
                <v-list-item-subtitle>
                    State: {{ item.attributes.state }}
                </v-list-item-subtitle>
                <v-list-item-subtitle>
                    Url:
                    <a target="_blank" rel="noopener" :href="item.links.self">
                        {{ item.links.self }}</a
                    >
                </v-list-item-subtitle>
            </v-list-item-content>

            <v-icon x-large>{{ mdiServer }}</v-icon>
        </v-list-item>

        <v-card-actions>
            <v-spacer></v-spacer>
            <router-link :to="`/dashboard/${item.id}`">
                <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                        <v-hover v-slot:default="{ hover }" open-delay="200">
                            <v-icon
                                v-on="on"
                                :class="{ iconHovered: hover }"
                                :color="hover ? '#074e61' : 'primary'"
                                large
                                >{{ mdiMore }}</v-icon
                            >
                        </v-hover>
                    </template>
                    <span>View More</span>
                </v-tooltip>
            </router-link>
        </v-card-actions>
    </v-card>
</template>

<script>
import { mdiServer, mdiMore } from "@mdi/js";

export default {
    name: "server-card",
    props: {
        item: Object
    },
    data() {
        return {
            mdiServer: mdiServer,
            mdiMore: mdiMore
        };
    }
};
</script>

<style lang="scss" scoped></style>
