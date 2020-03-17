<template>
    <div></div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
    created() {
        this.fetchCurrentNetworkUser()
    },
    methods: {
        ...mapActions(['fetchCurrentNetworkUser']),
    },
}
</script>

<style lang="scss" scoped></style>
