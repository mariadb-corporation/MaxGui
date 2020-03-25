<style lang="scss" scoped>
.welcome-txt {
    font-size: 30px;
}
</style>

<template>
    <div class="welcome-txt text-center color text-text-subtle">
        <div>{{ greeting }}</div>
        <div class="font-weight-medium">
            {{ $t('mariaDbMaxScale') }}
        </div>
    </div>
</template>

<script>
export default {
    props: {
        greeting: String,
    },
}
</script>
