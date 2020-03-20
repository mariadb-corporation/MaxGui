<template>
    <data-table
        :headers="tableHeaders"
        :data="generateTableRows"
        :sortDesc="false"
        :loading="!generateTableRows.length"
        :singleExpand="false"
        :showExpand="true"
        sortBy="id"
    >
        <template v-slot:id="{ data }">
            <span :class="boldCurrentUser(data)">
                {{ data.item.id }}
            </span>
        </template>
        <template v-slot:type="{ data }">
            <span :class="boldCurrentUser(data)">
                {{ data.item.type }}
            </span>
        </template>
        <template v-slot:role="{ data }">
            <span :class="boldCurrentUser(data)">
                {{ data.item.role }}
            </span>
        </template>
    </data-table>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
    data() {
        return {
            tableHeaders: [
                { text: 'ID', value: 'id' },
                { text: 'Type', value: 'type' },
                { text: 'Role', value: 'role' },
            ],
        }
    },
    computed: {
        ...mapGetters(['currentNetworkUser', 'allUsers']),
        /**
         * @return {Array} An array of objects
         */
        generateTableRows: function() {
            if (this.allUsers) {
                let itemsArr = []
                for (let n = this.allUsers.length - 1; n >= 0; --n) {
                    /**
                     * @typedef {Object} row
                     * @property {String} id - Id of the user
                     * @property {String} type - Type of user
                     * @property {String} role - User role
                     */
                    const {
                        id,
                        type,
                        attributes: { account },
                    } = this.allUsers[n]

                    let row = {
                        id: id,
                        type: type,
                        role: account,
                    }
                    itemsArr.push(row)
                }
                return itemsArr
            }
            return []
        },
    },
    created() {
        this.fetchCurrentNetworkUser()
        // console.log('currentNetworkUser', this.currentNetworkUser)
    },

    methods: {
        ...mapActions(['fetchCurrentNetworkUser']),
        boldCurrentUser(data) {
            return {
                'font-weight-bold':
                    data.item.id === this.currentNetworkUser.id &&
                    data.item.type === this.currentNetworkUser.type,
            }
        },
    },
}
</script>

<style lang="scss" scoped></style>
