<template>
    <v-snackbar
        v-model="message.status"
        :color="message.type"
        :bottom="true"
        :right="true"
        :timeout="timeout"
        multi-line
    >
        <span v-for="(item, i) in message.text" :key="i">{{ item }}</span>
        <v-btn dark class="mr-0" @click="message.status = false" text icon>
            <v-icon class="fa fa-times-circle" />
        </v-btn>
    </v-snackbar>
</template>

<script>
export default {
    name: 'Snackbars',
    data() {
        return {
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
