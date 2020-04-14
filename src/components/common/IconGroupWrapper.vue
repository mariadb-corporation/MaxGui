<template>
    <div
        class="d-inline-flex justify-center align-center icon-group"
        :class="[multiIcons ? 'icon-group__multi' : '']"
    >
        <slot name="body"></slot>
    </div>
</template>
<script>
export default {
    props: {
        multiIcons: { type: Boolean, default: false },
    },
}
</script>
<style lang="scss" scoped>
.icon-group {
    min-height: 36px;
    // padding: 0px 12px;
    &:not(:last-of-type) {
        border-right: 1px solid $field-text;
    }
    button {
        min-width: unset !important;
        padding: 0px !important;
        width: 42px;

        border-radius: 0px !important;
        &:hover {
            border-radius: 0px !important;
        }
    }
    &__multi {
        button {
            width: 36px;
        }
    }
    svg {
        cursor: pointer;
    }
}
</style>
