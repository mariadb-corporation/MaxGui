<template>
    <fragment v-if="data">
        {{ test }}
        <v-data-table
            dense
            hide-default-footer
            fixed-header
            :headers="headersArr"
            :items="itemsArr"
            item-key="name"
        >
        </v-data-table>
    </fragment>
</template>

<script>
import { Fragment } from "vue-fragment";
export default {
    name: "styled-table",
    props: {
        data: Array
    },
    components: { Fragment },
    computed: {
        test: function() {
            if (this.data) {
                const { data } = this;
                console.log("data", data);
                let itemsArr = [];
                for (let n = 0; n < data.length; n++) {
                    let keyNames = Object.keys(data[n]);
                    let keyValues = Object.values(data[n]);
                    let headersArr = [];
                    for (let i = 0; i < keyNames.length; i++) {
                        // create headerObj and assign its value
                        let headersObj = { align: "left" };
                        headersObj.text = keyNames[i];
                        headersObj.value = keyNames[i];
                        headersArr.push(headersObj);
                    }
                    itemsArr.push(data[n]);
                    this.headersArr = headersArr;
                }
                this.itemsArr = itemsArr;
            }
        }
    },
    data() {
        return {
            headersArr: [],
            itemsArr: []
        };
    }
};
</script>
