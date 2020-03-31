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
import { Line, mixins } from 'vue-chartjs'
import 'chartjs-plugin-streaming'
// const { reactiveProp } = mixins
export default {
    extends: Line,
    // mixins: [reactiveProp],
    props: {
        options: {
            type: Object,
        },
        chartData: {
            type: Object,
        },
    },
    mounted() {
        this.renderChart(this.chartData, {
            showLines: true,
            layout: {
                padding: {
                    left: 0,
                    right: 0,
                    top: 0,
                    bottom: 0,
                },
            },
            responsive: true,
            maintainAspectRatio: false,
            elements: {
                point: {
                    radius: 0,
                },
            },
            tooltips: {
                mode: 'nearest',
                intersect: false,
                titleFontFamily: "'azo-sans-web', adrianna, serif",
                bodyFontFamily: "'azo-sans-web', adrianna, serif",
            },
            hover: {
                mode: 'nearest',
                intersect: false,
            },
            scales: {
                xAxes: [
                    {
                        display: true,
                        ticks: {
                            fontSize: 10,
                            fontColor: '#424F62',
                            fontFamily: "'azo-sans-web', adrianna, serif",
                        },
                    },
                ],
                yAxes: [
                    {
                        display: true,
                        ticks: {
                            fontSize: 10,
                            fontFamily: "'azo-sans-web', adrianna, serif",
                            fontColor: '#424F62',
                            padding: 0,
                        },
                    },
                ],
            },
            ...this.options,
        })
    },
}
</script>
