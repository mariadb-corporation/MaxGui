<template>
    <v-snackbar
        v-model="message.status"
        :color="message.type"
        :bottom="true"
        :right="true"
        :timeout="timeout"
        multi-line
    >
        <span v-html="message.text"></span>
        <v-btn dark class="mr-0" @click="message.status = false" text icon>
            <v-icon>{{ mdiClose }}</v-icon>
        </v-btn>
    </v-snackbar>
</template>

<script>
import { mdiClose } from '@mdi/js';
export default {
    name: 'Snackbars',
    data() {
        return {
            mdiClose: mdiClose,
            timeout: 6000,
        };
    },
    computed: {
        message() {
            return this.$store.state.message;
        },
    },
};
</script>
