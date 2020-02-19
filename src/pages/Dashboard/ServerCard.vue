<template>
    <v-card width="100%">
        <v-list-item three-line>
            <v-list-item-content>
                <div class="overline mb-4">{{ overline }}</div>
                <v-list-item-title class="headline mb-1">
                    {{ headline }}
                </v-list-item-title>
                <v-list-item-subtitle>
                    State: {{ attributes.state }}
                </v-list-item-subtitle>
                <v-list-item-subtitle>
                    Url:
                    <a target="_blank" rel="noopener" :href="link">
                        {{ link }}</a
                    >
                </v-list-item-subtitle>
            </v-list-item-content>

            <v-icon x-large>{{ mdiServer }}</v-icon>
        </v-list-item>

        <v-card-actions
            ><router-link :to="path">
                <v-btn dark color="primary" depressed>{{ btnText }} </v-btn>
            </router-link>
        </v-card-actions>
    </v-card>
</template>

<script>
import { mdiViewDashboard, mdiServer } from "@mdi/js";

export default {
    name: "server-card",
    props: {
        overline: String,
        headline: String,
        attributes: Object,
        link: String,
        icon: String,
        path: String,
        btnText: String
    },
    data() {
        return {
            mdiServer: mdiServer
        };
    }
};
</script>
