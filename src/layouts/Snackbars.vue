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
        <v-btn dark class="mr-0" text icon @click="message.status = false">
            <v-icon size="16">
                close
            </v-icon>
        </v-btn>
    </v-snackbar>
</template>

<script>
export default {
    name: 'snackbars',
    data() {
        return {
            timeout: 6000,
        }
    },
    computed: {
        message() {
            return this.$store.state.message
        },
    },
}
</script>
