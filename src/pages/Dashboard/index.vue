<template>
    <v-container class="server-padding">
        <v-row justify="center">
            <v-col class="pt-0" :lg="6" :md="12" :sm="12">
                <v-row class="servers-list">
                    <fragment v-if="serversData">
                        <v-col
                            :md="6"
                            :lg="6"
                            :sm="12"
                            v-for="item in serversData"
                            :key="item.id"
                        >
                            <server-card
                                :overline="`Type: ${item.type}`"
                                :headline="item.id"
                                :link="`URL: ${item.links.self}`"
                                icon='<i class="material-icons">dashboard</i>'
                                :path="`/dashboard/${item.id}`"
                                btnText="More Info"
                            />
                        </v-col>
                    </fragment>
                    <fragment v-else>
                        <v-col :sm="12">
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
                    </fragment>
                </v-row>
            </v-col>

            <v-col :lg="6" :md="12" :sm="12" align="center" justify="center">
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
import { Fragment } from "vue-fragment";

import ThreadsChartContainer from "./ThreadsChartContainer";

export default {
    name: "Dashboard",
    components: {
        "server-card": ServerCard,
        ThreadsChartContainer,
        Fragment
    },
    computed: {
        ...mapGetters(["serversData", "chartdata"])
    },
    methods: {
        ...mapActions([
            "fetchServersAsync",
            "fetchThreadsAsync" // map `this.fetchThreadsAsync()` to `this.$store.dispatch('fetchThreadsAsync')`
        ]),
        ...mapMutations(["resetDestroyState"])
    },
    created() {
        console.log("call?");
        this.resetDestroyState();
        this.fetchServersAsync();
        this.fetchThreadsAsync();
    }
};
</script>

<style lang="scss" scoped>
.server-padding {
    padding-top: 40px;
}
.servers-list {
    margin-bottom: 60px;
}
</style>
