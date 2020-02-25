<template>
    <v-card :outlined="darkTheme" :dark="darkTheme">
        <v-card-title>
            <h3>Servers</h3>
            <v-spacer />
            <v-text-field v-model="search" :append-icon="mdiMagnify" label="Search" single-line hide-details />
            <server-create />
        </v-card-title>
        <v-data-table
            :search="search"
            :loading="!generateTableRows.length"
            loading-text="Loading... Please wait"
            :headers="tableHeaders"
            :items="generateTableRows"
            class="data-table-full"
            sort-by="id"
            :single-expand="false"
            :expanded.sync="expanded"
            show-expand
            :dark="darkTheme"
        >
            <!-- Actions slot -->
            <template v-slot:item.data-table-expand="{ expand, isExpanded, item }">
                <div style="display:flex">
                    <server-update :item="item" />
                    <server-delete :item="item" />
                    <!-- Sub component Activator -->
                    <v-tooltip top>
                        <template v-slot:activator="{ on }">
                            <v-btn v-on="on" v-if="!isExpanded" @click="expand(!isExpanded)" icon color="primary">
                                <v-icon medium>{{ mdiChevronDown }}</v-icon>
                            </v-btn>
                            <v-btn v-else v-on="on" @click="expand(!isExpanded)" icon color="primary">
                                <v-icon medium>{{ mdiChevronUp }}</v-icon>
                            </v-btn>
                        </template>
                        <span>View More</span>
                    </v-tooltip>
                </div>
            </template>
            <!-- Sub component -->
            <template v-slot:expanded-item="{ headers, item }">
                <!-- :colspan="headers.length" set width to full -->
                <td :colspan="headers.length">
                    <server-read :id="item.id" />
                </td>
            </template>
        </v-data-table>
    </v-card>
</template>

<script>
import { mdiChevronUp, mdiChevronDown, mdiMagnify } from '@mdi/js';
import { mapGetters } from 'vuex';
import ServerCreate from './ServerCreate';
import ServerUpdate from './ServerUpdate';
import ServerRead from './ServerRead';
import ServerDelete from './ServerDelete';

export default {
    name: 'servers-table',
    components: {
        ServerCreate,
        ServerDelete,
        ServerUpdate,
        ServerRead,
    },
    computed: {
        ...mapGetters(['user', 'darkTheme']),
    },
    props: {
        generateTableRows: Array,
    },
    data() {
        return {
            //Icons
            mdiMagnify: mdiMagnify,
            mdiChevronUp: mdiChevronUp,
            mdiChevronDown: mdiChevronDown,
            //State
            search: '',
            expanded: [],
            tableHeaders: [
                { text: 'Server', value: 'id' },
                { text: 'Address', value: 'address' },
                { text: 'Port', value: 'port' },
                { text: 'Connections', value: 'connections' },
                { text: 'State', value: 'state' },
                { text: 'Actions', align: 'center', value: 'data-table-expand', sortable: false },
            ],
        };
    },
};
</script>

<style lang="scss" scoped></style>
