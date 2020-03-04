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
            <v-card outlined height="180" width="330">
                <v-row class="fill-height" align="center" justify="center"> </v-row>
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
        slideRoute: function() {
            return routes.filter(route => route.isSlideNav);
        },
    },
    methods: {
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
