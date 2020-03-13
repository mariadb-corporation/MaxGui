<style lang="scss" scoped>
@import 'styles/constants';

.welcome-txt {
    color: $text-subtle;
    text-align: center;
    font-size: 30px;
}
</style>

<template>
    <div class="welcome-txt">
        <div>
            {{ $t('welcomeTo') }}
        </div>
        <div style="font-weight:600">
            {{ $t('mariaDbMaxScale') }}
        </div>
    </div>
</template>
