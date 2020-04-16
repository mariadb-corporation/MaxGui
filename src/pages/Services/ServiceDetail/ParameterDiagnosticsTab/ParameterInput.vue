<template>
    <!-- Each input will has its form validation TODO: add validation -->
    <v-form>
        <fragment v-if="objectItem.id === 'password'">
            <v-form>
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
                    autocomplete
                    required
                    type="password"
                />
            </v-form>
        </fragment>
        <fragment v-else-if="objectItem.id === 'user'">
            <v-form>
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
                    required
                />
            </v-form>
        </fragment>
        <fragment v-else-if="booleanParams.includes(objectItem.id)">
            <v-select
                :id="objectItem.id"
                v-model="objectItem.value"
                :name="objectItem.id"
                :items="[true, false]"
                outlined
                dense
                hide-details
                required
            />
        </fragment>
        <fragment v-else-if="numberParams.includes(objectItem.id)">
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
    },
    data() {
        return {
            booleanParams: [
                'enable_root_user',
                'auth_all_servers',
                'strip_db_esc',
                'localhost_match_wildcard_host',
                'log_auth_warnings',
                'session_track_trx_state',
                'session_trace',
            ],
            numberParams: [
                'max_connections',
                'connection_timeout',
                'net_write_timeout',
                'retain_last_statements',
                'connection_keepalive',
            ],
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
    created() {
        this.objectItem = this.$help.cloneDeep(this.item)
    },
}
</script>
