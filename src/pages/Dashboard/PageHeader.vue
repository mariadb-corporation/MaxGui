<template>
    <portal to="page-title">
        <h4
            style="margin-bottom: 0px; line-height: normal;"
            class="color text-navigation text-navigation display-1 text-capitalize page-title"
        >
            {{ pageTitle }}
        </h4>

        <span style="position:relative;top:-15px" class="field-text-info color text-field-text ">
            Uptime {{ duration }}
        </span>

        <v-menu
            transition="slide-y-transition"
            :close-on-content-click="false"
            open-on-hover
            offset-y
            nudge-left="20"
            content-class="v-menu--with-arrow shadow-drop"
        >
            <template v-slot:activator="{ on }">
                <v-icon
                    class="material-icons-outlined pointer"
                    style="position:relative;top:-15px"
                    size="16"
                    color="#9DB4BB"
                    v-on="on"
                >
                    info
                </v-icon>
            </template>

            <v-sheet style="border-radius: 10px;" class="px-6 py-4" max-width="320px">
                <span class="d-block mb-1 body-2 font-weight-bold"> About MaxScale</span>
                <div
                    v-for="(value, name) in $help.pick(maxScaleOverviewInfo, [
                        'commit',
                        'started_at',
                        'activated_at',
                    ])"
                    :key="name"
                >
                    <span class="d-flex body-2">
                        <span class="text-capitalize" style="width:35%">
                            {{ name.split('_').join(' ') }}
                        </span>
                        <v-tooltip v-if="name === 'commit'" :key="copyState" top>
                            <template v-slot:activator="{ on }">
                                <div
                                    style="width:65%;"
                                    class="pointer d-inline-block text-truncate"
                                    @dblclick="copyToClipboard(value)"
                                    v-on="on"
                                >
                                    {{ value }}
                                </div>
                            </template>
                            <span>
                                {{ copyState }}
                            </span>
                        </v-tooltip>
                        <div
                            v-else-if="name === 'started_at' || name === 'activated_at'"
                            style="width:65%;"
                            class="d-inline-block "
                        >
                            {{ $moment(value).format('MM.DD.YYYY HH:mm:ss ') }}
                        </div>
                        <div v-else style="width:65%;" class="d-inline-block ">
                            {{ value }}
                        </div>
                    </span>
                </div>
            </v-sheet>
        </v-menu>
    </portal>
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
import { mapGetters } from 'vuex'
import Worker from 'worker-loader!utils/worker.js'
export default {
    name: 'page-title',

    data() {
        return {
            isCopied: false,
            uptime: null,
            duration: null,
            copyState: 'Double click to copy to clipboard',
            workerList: [{ name: 'MaxScale uptime worker timer', interval: 1000 }],
        }
    },
    computed: {
        ...mapGetters({
            maxScaleOverviewInfo: 'maxscale/maxScaleOverviewInfo',
        }),
        pageTitle: function() {
            let version =
                this.maxScaleOverviewInfo.version !== undefined
                    ? this.maxScaleOverviewInfo.version
                    : ''
            return `MariaDB ${this.$t('productName')} ${version}`
        },
    },
    watch: {
        isCopied: function(newVal) {
            if (newVal) {
                let self = this
                self.copyState = 'Copied'
                setTimeout(
                    () => (
                        (self.isCopied = false),
                        (self.copyState = 'Double click to copy to clipboard')
                    ),
                    2000
                )
            }
        },
        'maxScaleOverviewInfo.uptime': function(val) {
            let self = this
            self.uptime = val
            self.duration = self.$moment.duration(val, 'seconds').format()
            self.workerInit()
        },
    },

    beforeDestroy() {
        this.worker.terminate()
    },

    methods: {
        //---------------------- MaxScale overview info
        copyToClipboard(value) {
            document.execCommand('copy')
            this.isCopied = true
        },
        updateUpTime() {
            this.uptime = this.uptime + 1
            this.duration = this.$moment.duration(this.uptime, 'seconds').format()
        },
        workerInit() {
            let self = this
            self.worker = new Worker()
            self.worker.postMessage(self.workerList)
            self.worker.onmessage = params => {
                self.updateUpTime()
            }
        },
    },
}
</script>
