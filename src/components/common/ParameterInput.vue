<template>
    <!-- Each input will has its form validation TODO: add validation -->
    <v-form>
        <fragment v-if="objectItem.type === 'password string'">
            <v-text-field
                :id="objectItem.id"
                v-model="objectItem.value"
                :name="objectItem.id"
                class="std error--text__bottom error--text__bottom--no-margin"
                height="36px"
                outlined
                dense
                autocomplete
                type="password"
                :rules="rules.password"
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
                autocomplete
                :rules="rules.username"
                required
                @change="handleChange"
            />
        </fragment>
        <fragment v-else-if="objectItem.type === 'bool'">
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
                onkeypress="return event.charCode >= 48"
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
                @change="handleChange"
            />
        </fragment>
        <fragment v-else-if="objectItem.type === 'enum'">
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
                @change="handleChange"
            />
        </fragment>
    </v-form>
</template>
<script>
export default {
    name: 'parameter-input',
    props: {
        item: { type: Object, required: true },
    },
    data() {
        return {
            objectItem: {},
            rules: {
                username: [val => !!val || this.$t('errors.usernameRequired')],
                password: [val => !!val || this.$t('errors.passwordRequired')],
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
    },
}
</script>
<style lang="scss" scoped>
::v-deep .std.v-input.v-text-field.error--text.error--text__bottom--no-margin {
    margin: 14px 0px 6px;
    .v-text-field__details {
        margin: 0px;
    }
}
::v-deep .std > .v-input__control {
    .v-input__slot {
        margin: 0;
    }
}
</style>
