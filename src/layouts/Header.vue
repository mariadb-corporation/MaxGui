<template>
    <v-app-bar height="52px" class="header pl-12 pr-2" fixed clipped-left app flat color="#003545">
        <v-toolbar-title class="headline">
            <router-link to="/dashboard">
                <img src="@/assets/logo.svg" alt="MariaDB Logo" />
                <span class="ml-2 white--text"><b>MaxScale</b></span>
            </router-link>
        </v-toolbar-title>

        <v-spacer></v-spacer>

        <v-menu v-model="isProfileOpened" transition="slide-y-transition" offset-y>
            <template v-slot:activator="{ on }">
                <v-btn class="mr-0" text tile v-on="on">
                    <v-icon class="user-icon mr-1 white--text" style="width:30px" size="30">
                        $vuetify.icons.user
                    </v-icon>
                    <span class="text-capitalize white--text">{{ user ? user.username : '' }}</span>

                    <v-icon
                        :class="[!isProfileOpened ? 'arrow-down' : 'arrow-up']"
                        size="7"
                        class="mr-0 ml-1 white--text"
                        left
                    >
                        $vuetify.icons.arrowDown
                    </v-icon>
                </v-btn>
            </template>
            <v-list class="header-dropdown-list">
                <v-list-item @click="handleLogout">
                    <v-list-item-title>{{ $t('logout') }}</v-list-item-title>
                </v-list-item>
            </v-list>
        </v-menu>
        <!-- <users-dialog ref="userDialog" /> -->
    </v-app-bar>
    <!-- <v-breadcrumbs class="mt-12" :items="items" large>
            <template v-slot:item="{ item }">
                <v-breadcrumbs-item>
                    <router-link style="text-decoration:none" :to="item.href">
                        {{ item.text.toUpperCase() }}
                    </router-link>
                </v-breadcrumbs-item>
            </template>
        </v-breadcrumbs> -->
</template>

<script>
import { mapActions } from 'vuex'
export default {
    props: { user: Object, default: null },
    data() {
        return {
            items: [],
            isProfileOpened: false,
        }
    },
    // watch: {
    //     $route: 'generateBreadcrumbs',
    // },
    // created: function() {
    //     this.generateBreadcrumbs();
    // },
    methods: {
        ...mapActions(['logout']),
        handleLogout() {
            this.logout(this.$router)
        },
        // generateBreadcrumbs() {
        //     let pathNames = this.$router.currentRoute.fullPath.split('/').filter(x => x);
        //     let items = [];
        //     for (let i = 0; i < pathNames.length; i++) {
        //         const last = i === pathNames.length - 1;
        //         const toPath = `/${pathNames.slice(0, i + 1).join('/')}`;
        //         let item = {
        //             text: pathNames[i].toUpperCase(),
        //             href: toPath,
        //             disabled: false,
        //         };
        //         items.push(item);
        //         this.items = items;
        //     }
        // },
    },

    // beforeRouteEnter(to, from, next) {
    //     next(vm => {
    //         vm.generateBreadcrumbs();
    //     });
    // },
}
</script>
<style lang="scss" scoped>
.header {
    background: linear-gradient(to right, #013545 0%, #064251 100%);
}

.headline {
    a {
        text-decoration: none;
    }

    img {
        vertical-align: middle;
    }

    span {
        position: relative;
        vertical-align: middle;
        font-size: 18px;
        font-weight: bold;
    }
}
.arrow-up {
    transform: rotate(-180deg);
}
.arrow-down {
    transform: rotate(0deg);
}
.v-btn {
    letter-spacing: normal;
}
.header-dropdown-list {
    border-radius: 10px;

    padding: 0px;
    .v-list-item__title {
        font-size: 0.875rem;
    }
}
</style>
