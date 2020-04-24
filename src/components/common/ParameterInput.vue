<template>
    <!-- Each input will has its form validation TODO: add validation -->
    <v-form>
        <fragment v-if="hasPwdParam">
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
                type="password"
            />
        </fragment>
        <fragment v-else-if="typeof objectItem.value === 'boolean'">
            <v-select
                :id="objectItem.id"
                v-model="objectItem.value"
                :name="objectItem.id"
                :items="[true, false]"
                outlined
                dense
                hide-details
            />
        </fragment>
        <fragment v-else-if="typeof objectItem.value === 'number'">
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
        hasPwdParam: { type: Boolean, required: false, default: false },
    },
    data() {
        return {
            objectItem: {},
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
