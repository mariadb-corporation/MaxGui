<template>
    <v-row class="mt-5">
        <portal to="page-title">
            <h4
                style="margin-bottom: 0px; line-height: 10px;"
                class="color text-navigation text-navigation display-1 text-capitalize page-title"
            >
                {{ $route.name }}
            </h4>
        </portal>
    </v-row>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
    name: 'settings',
}
</script>
