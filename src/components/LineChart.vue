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
        isRealTime: { type: Boolean, default: true },
        yAxesTicks: {
            type: Object,
            default: () => {},
        },
    },
    data() {
        return {
            realtimeScales: {
                xAxes: [
                    {
                        gridLines: {
                            color: 'rgba(234, 234, 234, 0.8)',
                            drawTicks: false,
                            drawBorder: false,
                        },
                        type: 'realtime',
                        ticks: {
                            display: false,
                            maxTicksLimit: 4,
                            fontSize: 10,
                            fontColor: '#424F62',
                            fontFamily: "'azo-sans-web', adrianna, serif",
                        },
                    },
                ],
                yAxes: [
                    {
                        gridLines: {
                            color: 'rgba(234, 234, 234, 0.8)',
                            drawTicks: false,
                            drawBorder: false,
                        },
                        ticks: {
                            beginAtZero: true,
                            padding: 20,
                            fontSize: 10,
                            fontFamily: "'azo-sans-web', adrianna, serif",
                            fontColor: '#424F62',
                            maxTicksLimit: 3,
                            ...this.yAxesTicks,
                        },
                    },
                ],
            },
            defaultScales: {
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
            realtimeLayout: {
                padding: {
                    left: 5,
                    bottom: 15,
                    right: 0,
                    top: 0,
                },
            },
            defaultLayout: {
                padding: {
                    left: 0,
                    right: 0,
                    top: 0,
                    bottom: 0,
                },
            },
        }
    },
    mounted() {
        this.renderChart(this.chartData, {
            showLines: true,

            layout: this.isRealTime ? this.realtimeLayout : this.defaultLayout,
            legend: {
                display: false,
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

                enabled: false,
                custom: function(tooltipModel) {
                    // Tooltip Element
                    let tooltipEl = document.getElementById('chartjs-tooltip')

                    // Create element on first render
                    if (!tooltipEl) {
                        tooltipEl = document.createElement('div')
                        tooltipEl.id = 'chartjs-tooltip'
                        tooltipEl.innerHTML = '<table></table>'
                        document.body.appendChild(tooltipEl)
                    }

                    // Hide if no tooltip
                    if (tooltipModel.opacity === 0) {
                        tooltipEl.style.opacity = 0
                        return
                    }

                    // Set caret Position
                    tooltipEl.classList.remove('above', 'below', 'no-transform')
                    if (tooltipModel.yAlign) {
                        tooltipEl.classList.add(tooltipModel.yAlign)
                    } else {
                        tooltipEl.classList.add('no-transform')
                    }

                    function getBody(bodyItem) {
                        return bodyItem.lines
                    }

                    // Set Text
                    if (tooltipModel.body) {
                        let titleLines = tooltipModel.title || []
                        let bodyLines = tooltipModel.body.map(getBody)

                        let innerHtml = '<thead>'

                        titleLines.forEach(function(title) {
                            innerHtml += '<tr><th>' + title + '</th></tr>'
                        })
                        innerHtml += '</thead><tbody>'

                        bodyLines.forEach(function(body, i) {
                            let colors = tooltipModel.labelColors[i]
                            let style = 'background:' + colors.backgroundColor
                            style += '; border-color:' + colors.borderColor
                            style += '; border-width: 2px'
                            let span =
                                '<span class="chartjs-tooltip-key" style="' + style + '"></span>'
                            innerHtml += '<tr><td>' + span + body + '</td></tr>'
                        })
                        innerHtml += '</tbody>'

                        let tableRoot = tooltipEl.querySelector('table')
                        tableRoot.innerHTML = innerHtml
                    }

                    // `this` will be the overall tooltip
                    let position = this._chart.canvas.getBoundingClientRect()

                    // Display, position, and set styles for font
                    tooltipEl.style.opacity = 1
                    tooltipEl.style.left = position.left + tooltipModel.caretX + 'px'
                    tooltipEl.style.top = position.top + tooltipModel.caretY + 'px'
                    tooltipEl.style.fontFamily = tooltipModel._bodyFontFamily
                    tooltipEl.style.fontStyle = tooltipModel._bodyFontStyle
                    tooltipEl.style.padding =
                        tooltipModel.yPadding + 'px ' + tooltipModel.xPadding + 'px'
                },
            },
            hover: {
                mode: 'nearest',
                intersect: false,
            },

            scales: this.isRealTime ? this.realtimeScales : this.defaultScales,
            ...this.options,
        })
    },
}
</script>

<style lang="scss">
#chartjs-tooltip {
    opacity: 1;
    position: absolute;
    background: rgba(0, 0, 0, 0.7);
    color: white;
    border-radius: 10px;
    transition: all 0.3s ease;
    pointer-events: none;
    transform: translate(-50%, 0);
    th,
    td {
        font-size: 10px;
    }
}
.chartjs-tooltip-key {
    display: inline-block;
    width: 10px;
    height: 10px;
}
</style>
