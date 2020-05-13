<template>
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
                    :key="item.name"
                    :class="{ navitem: true, active: currentPath.includes(item.name) }"
                    @click="navigate(item)"
                >
                    <v-list-item-icon class="mx-0">
                        <v-icon :size="item.meta.size" color="white">{{ item.meta.icon }}</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                        <v-list-item-title class="text-capitalize">
                            {{
                                item.path === '/settings'
                                    ? $tc(`${item.name}`, 2)
                                    : $tc(`${item.name}`, 1)
                            }}
                        </v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
                <v-divider :key="`divider-${item.name}`"></v-divider>
            </template>
        </v-list>
        <div class="version caption text-center font-weight-bold white--text">
            {{ version }}
        </div>
    </v-navigation-drawer>
</template>

<script>
/*
 * Copyright (c) 2020 MariaDB Corporation Ab
 *
 * Use of this software is governed by the Business Source License included
 * in the LICENSE.TXT file and at www.mariadb.com/bsl11.
 *
 * Change Date: 2024-07-01
 *
 * On the date above, in accordance with the Business Source License, use
 * of this software will be governed by version 2 or later of the General
 * Public License.
 */
import sideBarRoutes from 'router/sideBarRoutes'
export default {
    name: 'navigation',
    data() {
        return {
            isMini: true,
            items: sideBarRoutes,
            version: process.env.VUE_APP_VERSION || '',
        }
    },
    computed: {
        currentPath: function() {
            return this.$route.path
        },
    },
    methods: {
        navigate({ path, url }) {
            if (url) {
                return window.open(url)
            }

            if (path && path !== this.currentPath) {
                this.$router.push(path)
            }
        },
    },
}
</script>
<style lang="scss">
.main-nav {
    .v-navigation-drawer__border {
        background-color: transparent !important;
    }

    .navitem {
        // transition: 0.2s cubic-bezier(0.4, 0, 0.2, 1) !important; // same easing as the nav drawer open/close animation

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
        .v-list-item__title {
            color: white;
            font-size: 0.875rem;
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
