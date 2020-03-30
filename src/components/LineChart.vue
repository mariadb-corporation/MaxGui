<script>
import { Line, mixins } from 'vue-chartjs'
import 'chartjs-plugin-streaming'

export default {
    extends: Line,

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
