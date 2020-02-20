<template>
    <v-container fluid class="server-padding">
        <v-row class="server-add" justify="center">
            <v-col cols="12" class="pt-0" :xs="12" :lg="6">
                <v-row>
                    <template v-if="serversData">
                        <v-col
                            cols="12"
                            :xs="12"
                            :sm="4"
                            v-for="item in serversData"
                            :key="item.id"
                        >
                            <server-card :item="item" />
                        </v-col>
                    </template>
                    <template v-else>
                        <v-col>
                            <v-card width="100%" outlined class="pa-6">
                                <p>Loading servers data</p>
                                <v-progress-linear
                                    color="primary accent-4"
                                    indeterminate
                                    rounded
                                    height="6"
                                ></v-progress-linear>
                            </v-card>
                        </v-col>
                    </template>
                    <v-col lass="mt-0 pt-0" cols="12" :xs="12" :sm="4">
                        <server-card-add />
                    </v-col>
                </v-row>
            </v-col>

            <v-col cols="12" :xs="12" :lg="6" align="center" justify="center">
                <v-card width="100%" class="pa-6">
                    <h2 style="text-align:center">Last two second threads</h2>
                    <br />
                    <ThreadsChartContainer v-if="chartdata.datasets.length" />
                    <div v-else>
                        <p>Loading threads data</p>
                        <v-progress-linear
                            color="primary accent-4"
                            indeterminate
                            rounded
                            height="6"
                        ></v-progress-linear>
                    </div>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from "vuex";
import ServerCard from "./ServerCard";
import ServerCardAdd from "./ServerCardAdd";
import ThreadsChartContainer from "./ThreadsChartContainer";

export default {
    name: "Dashboard",
    components: {
        ServerCardAdd,
        ServerCard,
        ThreadsChartContainer
    },
    computed: {
        ...mapGetters(["serversData", "chartdata"])
    },
    methods: {
        ...mapActions([
            "fetchServers",
            "fetchThreadsAsync" // map `this.fetchThreadsAsync()` to `this.$store.dispatch('fetchThreadsAsync')`
        ]),
        ...mapMutations(["resetDestroyState"])
    },
    created() {
        this.resetDestroyState();
        this.fetchServers();
        this.fetchThreadsAsync();
    }
};
</script>

<style lang="scss" scoped>
.server-padding {
    padding: 40px 50px 0px;
}
.server-add {
    margin-bottom: 60px;
}
</style>
