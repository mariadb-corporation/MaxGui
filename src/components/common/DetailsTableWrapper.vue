<template>
    <fragment>
        <div class="mb-1 d-flex align-center">
            <div class="d-flex align-center">
                <v-btn icon class="arrow-toggle" @click="toggleOnClick">
                    <v-icon :class="[!toggleVal ? 'arrow-down' : 'arrow-up']" size="32">
                        $expand
                    </v-icon>
                </v-btn>
                <p class="mb-0 body-2 font-weight-bold color text-navigation text-uppercase">
                    {{ $t(title) }}
                    <span v-if="titleInfo" class="ml-1 color text-field-text">
                        ({{ titleInfo }})
                    </span>
                </p>
            </div>
            <v-spacer />
            <v-btn
                v-if="onAddClick"
                color="primary"
                text
                x-small
                class="text-capitalize"
                @click="onAddClick"
            >
                + {{ $t(addBtnText) }}
            </v-btn>
        </div>
        <v-expand-transition>
            <div v-show="toggleVal">
                <slot name="table"></slot>
            </div>
        </v-expand-transition>
    </fragment>
</template>

<script>
/* eslint-disable no-console */
export default {
    /* SLOTS available for details-table-wrapper */
    // name="table"
    props: {
        // props for the toggle
        toggleOnClick: { type: Function, required: true },
        toggleVal: { type: Boolean, required: true },
        // props for the Title
        title: { type: String, required: true },
        titleInfo: [String, Number], // option
        // optional props for the + Add ... button
        onAddClick: Function,
        addBtnText: String,
    },
    watch: {
        onAddClick: {
            handler(value) {
                if (value && typeof this.addBtnText === 'undefined') {
                    console.error("property 'addBtnText' is required. ")
                }
            },
            immediate: true,
        },
    },
}
</script>

<style></style>
