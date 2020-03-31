<template v-if="data">
    <data-table
        :headers="generateTableData.headersArr"
        :data="generateTableData.itemsArr"
        :sortDesc="false"
        :singleExpand="false"
        :showExpand="false"
        :dense="true"
    />
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
export default {
    name: 'compute-table',
    props: {
        data: Array,
    },
    computed: {
        generateTableData: function() {
            const { data } = this
            let itemsArr = []
            let headersArr = []
            if (data.length) {
                let keyNames = Object.keys(data[0])
                keyNames.forEach(element => {
                    headersArr.push({ align: 'left', text: element, value: element })
                })
                for (let n = data.length - 1; n >= 0; --n) {
                    let keyValues = Object.values(data[n])
                    itemsArr.push(data[n])
                }
            }
            return {
                itemsArr: itemsArr,
                headersArr: headersArr,
            }
        },
    },
    // mounted() {
    //     const { data } = this
    //     if (data) {
    //         let itemsArr = []
    //         for (let n = 0; n < data.length; n++) {
    //             let keyNames = Object.keys(data[n])
    //             let keyValues = Object.values(data[n])
    //             let headersArr = []
    //             for (let i = 0; i < keyNames.length; i++) {
    //                 // create headerObj and assign its value
    //                 let headersObj = { align: 'center' }
    //                 headersObj.text = keyNames[i]
    //                 headersObj.value = keyNames[i]
    //                 headersArr.push(headersObj)
    //             }
    //             itemsArr.push(data[n])
    //             this.headersArr = headersArr
    //         }
    //         this.itemsArr = itemsArr
    //     }
    // },
}
</script>
