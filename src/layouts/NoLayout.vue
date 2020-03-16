<template>
    <transition name="fade" mode="out-in">
        <router-view v-if="!$route.meta.requiresAuth" />
    </transition>
</template>

<script>
export default {
    name: 'no-layout',
}
</script>

<style lang="scss" scoped></style>
