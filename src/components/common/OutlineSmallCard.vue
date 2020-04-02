<template>
    <div :class="['d-flex flex-column', cardWrapper]">
        <p class="body-2 mb-3 text-uppercase color font-weight-bold text-navigation">
            <slot name="title">
                <span :style="{ visibility: 'hidden' }">hidden</span>
            </slot>
        </p>
        <v-card :class="[cardClass]" height="75" outlined>
            <slot name="card-body"></slot>
        </v-card>
    </div>
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
    props: {
        cardWrapper: String,
        cardStyle: Object,
        cardClass: String,
    },
}
</script>
