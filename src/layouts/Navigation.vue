<template>
    <div>
        <v-navigation-drawer
            :mini-variant.sync="isMini"
            color="#424F62"
            class="main-nav"
            width="200"
            mini-variant-width="50"
            fixed
            left
            clipped
            app
            permanent
            @mouseover.native="isMini = false"
            @mouseout.native="isMini = true"
        >
            <v-list>
                <template v-for="item in items">
                    <v-list-item
                        :key="item.title"
                        :class="{ navitem: true, active: currentPath.includes(item.route) }"
                        @click="navigate(item)"
                    >
                        <v-list-item-icon class="mx-0">
                            <v-icon :size="item.size" color="white">{{ item.icon }}</v-icon>
                        </v-list-item-icon>
                        <v-list-item-content>
                            <v-list-item-title style=" font-size: 0.875rem; color: white;">{{
                                item.title
                            }}</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                    <v-divider :key="`divider-${item.title}`"></v-divider>
                </template>
            </v-list>
            <div class="version caption text-center font-weight-bold white--text">
                {{ version }}
            </div>
        </v-navigation-drawer>
    </div>
</template>

<script>
import { APP_CONFIG } from 'utils/constants';

export default {
    name: 'Navigation',
    data() {
        return {
            isMini: true,
            items: APP_CONFIG.navigation.maxscale,
            version: process.env.VUE_APP_VERSION || '',
        };
    },
    computed: {
        currentPath() {
            return this.$route.path;
        },
        currentRoute() {
            return this.$route.name;
        },
    },
    methods: {
        navigate({ route, url }) {
            if (url) {
                return window.open(url);
            }

            if (route && route !== this.currentRoute) {
                this.$router.push({ name: route });
            }
        },
    },
};
</script>
<style lang="scss">
.main-nav {
    .v-navigation-drawer__border {
        background-color: transparent !important;
    }

    .navitem {
        transition: 0.2s cubic-bezier(0.4, 0, 0.2, 1) !important; // same easing as the nav drawer open/close animation
        height: 52px;
        &:hover {
            background: rgba(0, 0, 0, 0.14) !important;
        }
        .v-list-item__icon {
            min-width: 50px;
            height: 100%;
            margin: 0;
            align-items: center;
            justify-content: center;
        }
    }
}

.v-navigation-drawer--mini-variant .navitem .v-list-item__content {
    display: flex;
    opacity: 0;
}
</style>

<style lang="scss" scoped>
@import 'styles/constants';

.main-nav {
    z-index: 7;
    background: $navigation;

    .v-list {
        padding: 0;
        background: transparent;

        .navitem {
            position: relative;
            &::before {
                content: '';
                position: absolute;
                bottom: 10%;
                top: auto;
                width: 3px;
                height: 80%;
                max-height: 42px;
            }
            &.active::before {
                opacity: 1;
                background-color: #2c9cdb;
            }
        }
    }
}

.main-nav {
    hr.v-divider {
        border-color: #556072;
        display: block !important;
    }
    .version {
        position: absolute;
        bottom: 10px;
        width: 100%;
    }
}
</style>
