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
            {{ 'welcomeTo' }}
        </div>
        <div class="font-weight-medium">
            {{ 'monitoringServices' }}
        </div>
    </div>
</template>
