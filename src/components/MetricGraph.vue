<style lang="scss" scoped>
.sparkline {
  display: flex;
  .sparkline-inner {
    padding-left: 2px;
    overflow: hidden;
  }
}
</style>

<template>
  <v-card class="mx-auto text-center" light>
    <v-card-text>
      <v-sheet color="rgba(0, 0, 0, .1)">
        <div
          class="sparkline"
          :style="`justify-content:center; height:${height}px`"
        >
          <div class="sparkline-inner">
            <v-sparkline
              ref="main"
              :value="value"
              :color="color"
              height="100"
              padding="24"
              line-width="2"
              smooth="8"
            >
              <template class="x-axis" v-slot:label="item">
                {{ item.value }}
              </template>
            </v-sparkline>
          </div>
        </div>
      </v-sheet>
    </v-card-text>

    <v-card-text>
      <div class="display-1 font-weight-thin">Last two second threads</div>
    </v-card-text>

    <v-divider></v-divider>

    <v-card-actions class="justify-center">
      <v-btn block text>Go to Report</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: "metric-graph",
  props: {
    /* if available a red dotted line will be drawn on the sparkline coordinate system.
            The height of the line is given in percentage - 100% being the top most y coordinate of the sparkline graph
            */
    threshold: {
      type: [String, Number, null], // 0% - 100%
      default: null
    },
    values: Array,
    relative: Boolean,
    relativeValue: Number,
    justify: { type: String, default: "center" },
    color: { type: String, default: "#424f62" },
    width: { type: [String, Number], default: 720 },
    height: { type: [String, Number], default: 300 }
  },
  data() {
    return {
      maxValue: 0
    };
  },
  computed: {
    value() {
      if (!this.relative) return this.values;
      console.log(
        "[this.maxValue].concat(this.values);",
        [this.maxValue].concat(this.values)
      );
      return [this.maxValue].concat(this.values);
    },
    offset() {
      if (!this.relative || !this.values.length) return 0;
      return Math.ceil(this.width / this.values.length) + 2;
    }
  },
  methods: {
    setMaxValue() {
      if (!this.relative) return;
      if (this.relativeValue) {
        this.maxValue = this.relativeValue;
        return;
      }
      let max = this.maxValue;
      this.values.forEach(val => {
        max = Math.max(max, val);
      });
      this.maxValue = max;
    }
  },
  watch: {
    values: {
      handler() {
        this.setMaxValue();
      },
      immediate: true
    }
  },
  mounted() {
    const main = this.$refs.main.$el;
    main.style.width = `${this.width}px`;
    main.style.height = `${this.height}px`;
  }
};
</script>
