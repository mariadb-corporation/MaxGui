<template>
    <Push class="sidebar" :burgerIcon="isVisible" width="200">
        <div class="nav-username">{{ user.username }}</div>
        <div class="nav-username_divider" />
        <ul>
            <li v-for="route in renderNavRoute" v-bind:key="route.path">
                <router-link :to="route.path">
                    <v-icon medium color="#424f62">{{ route.icon }}</v-icon>
                    <p>{{ route.name }}</p>
                </router-link>
            </li>
        </ul>
        <v-tooltip top>
            <template v-slot:activator="{ on }">
                <v-btn v-on="on" class="logout-btn white--text" @click="logoutHandle">
                    <v-icon color="red">{{ mdiLogout }}</v-icon>
                </v-btn>
            </template>
            <span>Sign out</span>
        </v-tooltip>
    </Push>
</template>
<script>
import { Push } from 'vue-burger-menu';
import { mapGetters, mapMutations } from 'vuex';
import { routes } from '../router/routes';
import { mdiLogout } from '@mdi/js';

export default {
    components: {
        Push,
    },
    computed: {
        ...mapGetters(['user']),
        renderNavRoute: function() {
            let navRoute = routes.filter(route => route.isSideBar);
            return navRoute;
        },
    },
    methods: {
        ...mapMutations(['logout']),
        logoutHandle() {
            this.logout();
            this.$router.push('login');
        },
    },
    data() {
        return {
            routes: routes,
            mdiLogout: mdiLogout,
            isVisible: true,
        };
    },
    mounted() {
        this.isVisible = this.user.token ? true : false;
    },
    watch: {
        user: function(newVal, oldVal) {
            this.isVisible = newVal.token ? true : false;
        },
    },
};
</script>

<style lang="scss">
.logout-btn {
    position: absolute;
    bottom: 50px;
    margin-left: 50%;
    transform: translateX(-50%);
}
/* styling nav-username */
.sidebar {
    .nav-username {
        color: $navigation;
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
            background-color: $navigation;
            padding: 0px;
        }
    }

    /* Position and sizing of burger button */
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
    .bm-cross {
        background: $navigation !important;
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
        background-color: $background !important;
        overflow-x: hidden !important; /* Disable horizontal scroll */
        transition: 0.5s !important; /*0.5 second transition effect to slide in the sidenav*/
    }

    .bm-overlay {
        background: rgba(0, 0, 0, 0.3) !important;
    }
    .bm-item-list > * > span {
        margin-left: unset !important;
    }
    .bm-item-list {
        color: #b8b7ad !important;
        margin-left: 0px !important;
        font-size: 20px !important;

        ul {
            margin: 0px !important;
            padding: 20px 0px !important;
            display: flex !important;
            justify-content: center !important;
            flex-direction: column !important;
            li {
                text-align: left !important;
                position: relative !important;
                display: block !important;
                padding: 0px !important;

                a {
                    margin: 5px 18px !important;
                    border-radius: 0px !important;
                    padding: 8px 16px !important;
                    transition: 0.5s !important;
                    display: flex !important;
                    text-decoration: none !important;
                    clip-path: polygon(50% 3%, 100% 0, 99% 50%, 100% 100%, 50% 97%, 0 100%, 1% 50%, 0 0);
                    i {
                        display: flex !important;
                        justify-content: flex-start !important;
                        align-items: center !important;
                        font-size: 32px !important;
                    }

                    p {
                        display: flex !important;
                        align-items: center !important;
                        margin: 0px 0px 0px 10px !important;
                        font-weight: 600 !important;
                        font-size: 18px !important;
                        color: $navigation !important;
                        opacity: 0.72 !important;
                        padding: 0px !important;
                    }
                }
                .router-link-exact-active {
                    background-color: #e7eef1;
                    clip-path: polygon(50% 3%, 100% 0, 99% 50%, 100% 100%, 50% 97%, 0 100%, 1% 50%, 0 0);
                    & > * {
                        color: black !important;
                    }
                }

                &:hover > a {
                    background-color: #e7eef1;
                    clip-path: polygon(50% 3%, 100% 0, 99% 50%, 100% 100%, 50% 97%, 0 100%, 1% 50%, 0 0);
                    & > * {
                        color: black !important;
                    }
                }
            }
        }
    }
}
</style>
