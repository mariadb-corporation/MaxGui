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
                for (let n = 0; n < data.length; n++) {
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
