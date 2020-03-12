<template>
    <div>
        <v-sheet max-width="90%">
            <v-slide-group v-model="model" center-active>
                <v-slide-item v-for="route in tabRoutes" :key="route.name" class="slide-nav-item">
                    <v-card
                        class="v-card-custom"
                        outlined
                        height="85"
                        width="145"
                        @click="navigate(route.path)"
                    >
                        <v-row class="fill-height" align="center" justify="center">
                            <p class="caption text-uppercase color text-primary">
                                {{ route.name }}
                            </p>
                        </v-row>
                    </v-card>
                </v-slide-item>
            </v-slide-group>
        </v-sheet>

        <v-sheet style="margin-top:35px">
            <p class="font-weight-bold title text-uppercase color text-navigation">
                MAXSCALE DETAILS
            </p>
            <v-card class="v-card-custom px-6 py-3" outlined height="180" maxWidth="380">
                <div v-for="(value, name) in maxscaleDetails" :key="name" class="">
                    <span v-if="name !== 'parameters'" class="d-flex ">
                        <b class="text-capitalize" style="width:45%">
                            {{ name.split('_').join(' ') }}</b
                        >
                        <div style="width:55%;max-width:180px" class="d-inline-block text-truncate">
                            {{ value }}
                        </div>
                    </span>
                </div>
                <router-link
                    :to="{ name: 'maxscale', params: { parameters: maxscaleDetails.parameters } }"
                    class="no-underline"
                >
                    <span class="text-capitalize" style="width:45%"> Parameters</span>
                </router-link>
            </v-card>
        </v-sheet>
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import tabRoutes from 'router/tabRoutes'

export default {
    name: 'dashboard',
    data() {
        return {
            model: null,
            tabRoutes: tabRoutes,
        }
    },
    computed: {
        ...mapGetters(['maxscaleDetails']),
    },
    created() {
        this.fetchMaxScaleDetails()
    },
    methods: {
        ...mapActions(['fetchMaxScaleDetails']),
        navigate(path) {
            this.$router.push(path)
        },
    },
}
</script>

<style scoped lang="scss">
.slide-nav-item {
    margin: 0px 5px;
    &:first-of-type {
        margin-left: 0px;
    }
}
</style>
