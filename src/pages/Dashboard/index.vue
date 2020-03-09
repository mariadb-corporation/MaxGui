<template>
    <div>
        <v-sheet max-width="90%">
            <v-slide-group v-model="model" center-active>
                <v-slide-item class="slide-nav-item" v-for="route in slideRoute" :key="route.name">
                    <v-card outlined height="85" width="145" @click="navigate(route.path)">
                        <v-row class="fill-height" align="center" justify="center">
                            <p class="caption text-uppercase color text-primary">{{ route.name }}</p>
                        </v-row>
                    </v-card>
                </v-slide-item>
            </v-slide-group>
        </v-sheet>
        <v-sheet style="margin-top:35px">
            <p class="font-weight-bold title text-uppercase color text-navigation">MAXSCALE DETAILS</p>
            <v-card class="px-6 py-3" outlined height="180" maxWidth="360">
                <div class="" v-for="(value, name) in maxscaleDetails" :key="name">
                    <span class="d-flex " v-if="name !== 'parameters'">
                        <b class="text-capitalize" style="width:45%"> {{ name.split('_').join(' ') }}</b>
                        <div style="width:55%;max-width:150px" class="d-inline-block text-truncate">{{ value }}</div>
                    </span>
                </div>
                <router-link
                    class="no-underline"
                    :to="{ name: 'maxscale', params: { parameters: maxscaleDetails.parameters } }"
                >
                    <span class="text-capitalize" style="width:45%"> Parameters</span>
                </router-link>
            </v-card>
        </v-sheet>
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { routes } from 'router/routes';

export default {
    name: 'Dashboard',
    data() {
        return {
            model: null,
        };
    },
    computed: {
        ...mapGetters(['maxscaleDetails']),
        slideRoute: function() {
            return routes.filter(route => route.isSlideNav);
        },
    },
    created() {
        this.fetchMaxScaleDetails();
    },
    methods: {
        ...mapActions(['fetchMaxScaleDetails']),
        navigate(path) {
            this.$router.push(path);
        },
    },
};
</script>

<style scoped lang="scss">
.slide-nav-item {
    margin: 0px 5px;
    &:first-of-type {
        margin-left: 0px;
    }
}
</style>
