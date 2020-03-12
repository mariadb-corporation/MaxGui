<script>
import { Line, mixins } from 'vue-chartjs';
const { reactiveProp, reactiveData } = mixins;

export default {
    extends: Line,
    mixins: [reactiveProp],
    props: {
        options: {
            type: Object,
        },
    },
    mounted() {
        this.renderChart(this.chartData, this.options);
    },
};
</script>
