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
                type="password"
                hide-details
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
            />
        </fragment>
    </v-form>
</template>
<script>
export default {
    name: 'parameter-input',
    props: {
        item: { type: Object, required: true },
        onItemChanges: { type: Function, required: true },
    },
    data() {
        return {
            objectItem: {},
            objectItemRules: {
                count: [val => this.validatePositiveNumber(val)],
            },
        }
    },
    watch: {
        objectItem: {
            handler(newVal) {
                let changed = !this.$help.isEqual(newVal, this.item)
                this.onItemChanges(newVal, changed)
            },
            deep: true,
        },
    },
    async created() {
        this.objectItem = this.$help.cloneDeep(this.item)
    },
}
</script>
