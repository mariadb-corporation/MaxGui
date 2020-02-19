<template>
    <div>
        <v-app-bar fixed dense max-height="48px" color="primary"> </v-app-bar>
        <v-breadcrumbs class="mt-12" :items="items" large>
            <template v-slot:item="{ item }">
                <v-breadcrumbs-item>
                    <router-link style="text-decoration:none" :to="item.href">
                        {{ item.text.toUpperCase() }}
                    </router-link>
                </v-breadcrumbs-item>
            </template>
        </v-breadcrumbs>
    </div>
</template>

<script>
export default {
    created: function() {
        this.generateBreadcrumbs();
    },

    watch: {
        $route: "generateBreadcrumbs"
    },
    methods: {
        generateBreadcrumbs() {
            let pathNames = this.$router.currentRoute.fullPath
                .split("/")
                .filter(x => x);
            let items = [];
            for (let i = 0; i < pathNames.length; i++) {
                const last = i === pathNames.length - 1;
                const toPath = `/${pathNames.slice(0, i + 1).join("/")}`;
                let item = {
                    text: pathNames[i].toUpperCase(),
                    href: toPath,
                    disabled: false
                };
                items.push(item);
                this.items = items;
            }
        }
    },
    data() {
        return {
            items: []
        };
    },
    beforeRouteEnter(to, from, next) {
        next(vm => {
            vm.generateBreadcrumbs();
        });
    }
};
</script>
