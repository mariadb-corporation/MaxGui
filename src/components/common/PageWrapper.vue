<template>
    <div class="wrapper-container fill-height">
        <div class="d-flex ml-n1">
            <portal-target name="page-header" />
            <v-spacer />
            <div class="d-flex flex-wrap ">
                <portal-target name="page-search" />
                <portal-target name="create-resource" />
            </div>
        </div>
        <slot></slot>
    </div>
</template>
