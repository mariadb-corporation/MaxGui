<template>
    <Push
        @openMenu="oneMenuOpen"
        @closeMenu="oneMenuClose"
        :isOpen="open"
        class="sidebar"
        :burgerIcon="isVisible"
        width="200"
    >
        <div class="sidebar-wrap-bg" :style="`background-color: ${darkTheme ? '#1E1E1E' : '#fff'}`">
            <div class="nav-username" :style="`color: ${darkTheme ? '#fff' : '#424f62'}`">
                {{ user && user.username }}
            </div>
            <div class="nav-username_divider" :style="`background-color: ${darkTheme ? '#fff' : '#424f62'}`" />
            <ul>
                <li v-for="route in renderNavRoute" v-bind:key="route.path">
                    <router-link class="router-link" :to="route.path" @click.native="onItemClickHandle">
                        <v-icon medium :color="`${darkTheme ? '#fff' : '#424f62'}`">{{ route.icon }}</v-icon>
                        <p :style="`color: ${darkTheme ? '#fff' : '#424f62'}`">{{ route.name }}</p>
                    </router-link>
                </li>
            </ul>
            <div class="nav-footer" :style="`border-top: 1px solid ${darkTheme ? 'rgba(255,255,255,0.5)' : '#fff'}`">
                <v-tooltip top>
                    <template v-slot:activator="{ on }">
                        <v-btn v-on="on" icon class="logout-btn " @click="logoutHandle">
                            <v-icon color="#eb5757">{{ mdiLogout }}</v-icon>
                        </v-btn>
                    </template>
                    <span>Sign out</span>
                </v-tooltip>
                <v-tooltip top>
                    <template v-slot:activator="{ on }">
                        <v-btn v-on="on" icon class=" " @click="toggleDarkTheme()">
                            <v-icon color="primary">{{ darkTheme ? mdiBrightness4 : mdiBrightness7 }}</v-icon>
                        </v-btn>
                    </template>
                    <span>{{ darkTheme ? 'Disable dark mode' : 'Enable dark mode' }}</span>
                </v-tooltip>
            </div>
        </div>
    </Push>
</template>
<script>
import { Push } from 'vue-burger-menu';
import { mapMutations } from 'vuex';
import { routes } from '../router/routes';
import { mdiLogout, mdiBrightness4, mdiBrightness7 } from '@mdi/js';

export default {
    components: {
        Push,
    },
    props: {
        darkTheme: Boolean,
        user: Object,
    },
    data() {
        return {
            // icons
            mdiLogout: mdiLogout,
            mdiBrightness4: mdiBrightness4,
            mdiBrightness7: mdiBrightness7,
            // states
            routes: routes,
            open: false,
            isVisible: true,
        };
    },
    computed: {
        renderNavRoute: function() {
            let navRoute = routes.filter(route => route.isSideBar);
            return navRoute;
        },
    },
    watch: {
        user: function(newVal, oldVal) {
            this.isVisible = newVal && newVal.token ? true : false;
        },
        darkTheme: function(newVal, oldVal) {
            document.querySelectorAll('.bm-cross').forEach(function(ele) {
                ele.style.background = newVal ? '#fff' : '#424f62';
            });
        },
    },
    mounted() {
        this.isVisible = this.user && this.user.token ? true : false;
        // toggle background color of the cross button in sidebar
        const ele = document.querySelectorAll('.bm-cross');
        let darkTheme = this.darkTheme;
        document.querySelectorAll('.bm-cross').forEach(function(ele) {
            ele.style.background = darkTheme ? '#fff' : '#424f62';
        });
    },
    methods: {
        ...mapMutations(['logout', 'toggleDarkTheme']),
        logoutHandle() {
            this.open = false;
            this.logout();
            this.$router.push('login');
        },
        // catch on menu open when burger button is pressed
        oneMenuOpen() {
            this.open = true;
        },
        oneMenuClose() {
            this.open = false;
        },
        onItemClickHandle(e) {
            e.preventDefault();
            e.stopPropagation();
            this.open = !this.open;
        },
    },
};
</script>

<style lang="scss">
/* styling nav-username */
.sidebar {
    .sidebar-wrap-bg {
        display: inline-block;
        width: 100%;
        height: 100vh;
        padding: 0;
    }
    .nav-username {
        font-size: 18px;
        text-align: center;
        padding: 10px 0px;
        display: flex;
        justify-content: center;
        text-transform: capitalize;
        &_divider {
            width: 80%;
            margin-left: 10%;
            opacity: 0.5;
            height: 1px;
            padding: 0px;
        }
    }

    /* Position and sizing of burger button in the Appbar*/
    .bm-burger-button {
        position: fixed !important;
        top: 14px !important;
        left: 16px !important;
        width: 20px !important;
        height: 20px !important;
        z-index: 6 !important; // appbar z-index is 5
        .bm-burger-bars {
            opacity: 0.8 !important;
            background-color: rgb(255, 255, 255) !important;
            margin: auto !important;
        }
        &:hover {
            .bm-burger-bars {
                opacity: 1 !important;
                background-color: rgb(255, 255, 255) !important;
            }
        }
    }

    .cross-style {
        position: absolute !important;
        top: 12px !important;
        right: 2px !important;
        cursor: pointer !important;
    }

    .bm-cross-button {
        height: 24px !important;
        width: 24px !important;
    }
    .bm-menu {
        box-shadow: 0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14),
            0px 1px 5px 0px rgba(0, 0, 0, 0.12) !important;
        height: 100% !important; /* 100% Full-height */
        position: fixed !important; /* Stay in place */
        z-index: 1000 !important; /* Stay on top */
        top: 0 !important;
        left: 0 !important;
        padding-top: 0px !important;
        // background-color: $background !important;
        overflow-x: hidden !important; /* Disable horizontal scroll */
        transition: 0.5s !important; /*0.5 second transition effect to slide in the sidenav*/
    }
    // Remove default style from vue-burger-menu lib
    .bm-item-list > * > span {
        margin-left: unset !important;
        font-weight: unset !important;
        color: unset !important;
    }
    .bm-item-list {
        margin-left: 0px !important;

        ul {
            margin: 0px;
            padding: 20px 0px;
            display: flex;
            justify-content: center;
            flex-direction: column;
            li {
                text-align: left;
                position: relative;
                display: block;
                padding: 0px;

                .router-link {
                    margin: 5px 18px;
                    border-radius: 0px;
                    padding: 8px 16px;
                    transition: 0.5s;
                    display: flex;
                    text-decoration: none;

                    &-exact-active {
                        background-color: #e7eef1;
                        & > * {
                            color: black !important ; // overwrite inline color style
                        }
                    }
                    &:hover {
                        background-color: #e7eef1;
                        // all elements include i and p
                        & > * {
                            color: black !important ; // overwrite inline color style
                        }
                    }
                    i {
                        display: flex;
                        justify-content: flex-start;
                        align-items: center;
                        font-size: 32px;
                    }

                    p {
                        display: flex;
                        align-items: center;
                        margin: 0px 0px 0px 10px;
                        font-weight: 600;
                        font-size: 18px;
                        padding: 0px;
                    }
                }
            }
        }
    }
    .nav-footer {
        position: absolute;
        bottom: 0px;
        display: block;
        width: 100%;
        padding: 10px 0px;
        .logout-btn {
            // bottom: 50px;
            margin-left: 50%;
            transform: translateX(-50%);
        }
    }
}
</style>
