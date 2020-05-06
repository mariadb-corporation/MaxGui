<template>
    <fragment>
        <fragment v-if="objectItem.type === 'password string'">
            <v-text-field
                :id="objectItem.id"
                v-model="objectItem.value"
                :name="objectItem.id"
                class="std error--text__bottom error--text__bottom--no-margin"
                height="36px"
                outlined
                dense
                autocomplete="on"
                type="password"
                :rules="[v => !!v || `${objectItem.id} is required`]"
                required
                @change="handleChange"
            />
        </fragment>
        <fragment v-else-if="objectItem.id === 'user'">
            <v-text-field
                :id="objectItem.id"
                v-model="objectItem.value"
                :name="objectItem.id"
                class="std error--text__bottom error--text__bottom--no-margin"
                height="36px"
                outlined
                dense
                :rules="[v => !!v || `${objectItem.id} is required`]"
                required
                @change="handleChange"
            />
        </fragment>
        <fragment v-else-if="objectItem.type === 'bool'">
            <!-- No need rules for v-select as it always has predefined value-->
            <v-select
                :id="objectItem.id"
                v-model="objectItem.value"
                :name="objectItem.id"
                class="std mariadb-select-input error--text__bottom error--text__bottom--no-margin"
                :menu-props="{ contentClass: 'mariadb-select-v-menu' }"
                height="36px"
                :items="[true, false]"
                outlined
                dense
                required
                @change="handleChange"
            />
        </fragment>

        <fragment
            v-else-if="
                objectItem.type === 'count' ||
                    objectItem.type === 'duration' ||
                    objectItem.type === 'size'
            "
        >
            <v-text-field
                :id="objectItem.id"
                v-model.trim.number="objectItem.value"
                type="number"
                min="0"
                :name="objectItem.id"
                class="std error--text__bottom error--text__bottom--no-margin"
                height="36px"
                single-line
                outlined
                dense
                :rules="rules.naturalNumber"
                required
                @change="handleChange"
            />
        </fragment>
        <fragment v-else-if="objectItem.type === 'int'">
            <v-text-field
                :id="objectItem.id"
                v-model.trim.number="objectItem.value"
                type="number"
                :name="objectItem.id"
                class="std error--text__bottom error--text__bottom--no-margin"
                height="36px"
                single-line
                outlined
                dense
                :rules="rules.int"
                required
                @change="handleChange"
            />
        </fragment>
        <fragment v-else-if="objectItem.type === 'enum'">
            <!-- No need rules for v-select as it always has predefined value-->
            <v-select
                :id="objectItem.id"
                v-model="objectItem.value"
                :name="objectItem.id"
                class="std mariadb-select-input error--text__bottom error--text__bottom--no-margin"
                :menu-props="{ contentClass: 'mariadb-select-v-menu' }"
                height="36px"
                :items="objectItem.enum_values"
                outlined
                dense
                required
                @change="handleChange"
            />
        </fragment>

        <fragment v-else>
            <v-text-field
                :id="objectItem.id"
                v-model="objectItem.value"
                :name="objectItem.id"
                class="std error--text__bottom error--text__bottom--no-margin"
                height="36px"
                single-line
                outlined
                dense
                :rules="[v => !!v || `${objectItem.id} is required`]"
                required
                @change="handleChange"
            />
        </fragment>
    </fragment>
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
    name: 'parameter-input',
    props: {
        item: { type: Object, required: true },
    },
    data() {
        return {
            objectItem: {},
            rules: {
                naturalNumber: [val => this.validateNaturalNumber(val)],
                int: [val => this.validateInteger(val)],
            },
        }
    },

    async created() {
        this.objectItem = this.$help.cloneDeep(this.item)
    },
    methods: {
        handleChange(val) {
            let self = this
            let changed = !this.$help.isEqual(self.objectItem, self.item)
            // compare v-model objectItem with props item
            this.$emit('on-input-change', self.objectItem, changed)
        },
        validateNaturalNumber(val) {
            if (val < 0 && Number.isInteger(val)) {
                return `${this.objectItem.id} does not accept negative values`
            } else if (val === '') {
                return `${this.objectItem.id} is required`
            }
            return true
        },
        validateInteger(val) {
            if (!Number.isInteger(parseInt(val, 10))) {
                return `${this.objectItem.id} accepts only integer`
            } else if (val === '') {
                return `${this.objectItem.id} is required`
            }
            return true
        },
    },
}
</script>

<style lang="scss" scoped>
.std.v-input.v-text-field.error--text.error--text__bottom--no-margin {
    margin: 14px 0px 6px;
    ::v-deep .v-text-field__details {
        margin: 0px;
    }
}
.std ::v-deep .v-input__control {
    .v-input__slot {
        margin: 0;
    }
}
</style>
