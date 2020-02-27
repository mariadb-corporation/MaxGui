<template v-if="data">
    <v-data-table
        :dark="darkTheme"
        dense
        hide-default-footer
        fixed-header
        :headers="headersArr"
        :items="itemsArr"
        item-key="name"
    >
    </v-data-table>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
    name: 'styled-table',
    props: {
        data: Array,
    },
    data() {
        return {
            headersArr: [],
            itemsArr: [],
        };
    },
    computed: {
        ...mapGetters(['darkTheme']),
    },
    mounted() {
        const { data } = this;
        if (data) {
            let itemsArr = [];
            for (let n = 0; n < data.length; n++) {
                let keyNames = Object.keys(data[n]);
                let keyValues = Object.values(data[n]);
                let headersArr = [];
                for (let i = 0; i < keyNames.length; i++) {
                    // create headerObj and assign its value
                    let headersObj = { align: 'center' };
                    headersObj.text = keyNames[i];
                    headersObj.value = keyNames[i];
                    headersArr.push(headersObj);
                }
                itemsArr.push(data[n]);
                this.headersArr = headersArr;
            }
            this.itemsArr = itemsArr;
        }
    },
};
</script>
