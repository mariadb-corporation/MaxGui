<script>
import { Line, mixins } from 'vue-chartjs'
import 'chartjs-plugin-streaming'
const { reactiveProp, reactiveData } = mixins

export default {
    extends: Line,
    mixins: [reactiveProp],
    props: {
        options: {
            type: Object,
        },
    },
    mounted() {
        this.renderChart(this.chartData, {
            showLines: true,
            legend: {
                display: false,
            },
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
                        type: 'realtime',
                        time: {
                            displayFormats: {
                                second: 'HH:mm:ss',
                            },
                        },
                        realtime: {
                            ttl: 600000,
                            duration: 10000,
                            refresh: 1000, // onRefresh callback will be called every 1000 ms
                            // delay of 2000 ms, so upcoming values are known before plotting a line
                            delay: 2000,
                        },
                    },
                ],
                yAxes: [
                    {
                        display: true,
                        ticks: {
                            maxTicksLimit: 3,
                            fontSize: 10,
                            fontFamily: "'azo-sans-web', adrianna, serif",
                            fontColor: '#424F62',
                            max: 100,
                            min: 0,
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
