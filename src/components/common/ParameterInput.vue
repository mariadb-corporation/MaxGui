<template>
    <!-- Each input will has its form validation TODO: add validation -->
    <v-form>
        <fragment v-if="objectItem.type === 'password string'">
            <v-text-field
                :id="objectItem.id"
                v-model="objectItem.value"
                :name="objectItem.id"
                class="std"
                height="35px"
                single-line
                outlined
                dense
                autocomplete
                type="password"
                hide-details
                @change="handleChange"
            />
        </fragment>
        <fragment v-else-if="objectItem.type === 'bool'">
            <v-select
                :id="objectItem.id"
                v-model="objectItem.value"
                :name="objectItem.id"
                class="std mariadb-select-input"
                :menu-props="{ contentClass: 'mariadb-select-v-menu' }"
                height="35px"
                :items="[true, false]"
                outlined
                dense
                hide-details
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
                class="std"
                height="35px"
                single-line
                outlined
                dense
                hide-details
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
                class="std"
                height="35px"
                single-line
                outlined
                dense
                hide-details
                @change="handleChange"
            />
        </fragment>
        <fragment v-else-if="objectItem.type === 'enum'">
            <v-select
                :id="objectItem.id"
                v-model="objectItem.value"
                :name="objectItem.id"
                class="std mariadb-select-input"
                :menu-props="{ contentClass: 'mariadb-select-v-menu' }"
                height="35px"
                :items="objectItem.enum_values"
                outlined
                dense
                hide-details
                @change="handleChange"
            />
        </fragment>

        <fragment v-else>
            <v-text-field
                :id="objectItem.id"
                v-model="objectItem.value"
                :name="objectItem.id"
                class="std"
                height="35px"
                single-line
                outlined
                dense
                hide-details
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
            objectItemRules: {
                count: [val => this.validatePositiveNumber(val)],
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
