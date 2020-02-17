import Vue from "vue";
import update from "immutability-helper";

function delay(t, v) {
  return new Promise(function(resolve) {
    setTimeout(resolve.bind(null, v), t);
  });
}
function dynamicColors() {
  let r = Math.floor(Math.random() * 255);
  let g = Math.floor(Math.random() * 255);
  let b = Math.floor(Math.random() * 255);
  return "rgb(" + r + "," + g + "," + b + ")";
}
export default {
  state: {
    threads: [],
    threadsChartData: {},
    credentials: JSON.parse(localStorage.getItem("credentials"))
  },
  mutations: {
    setThreads(state, payload) {
      state.threads = payload;
    },
    setThreadsChartData(state, payload) {
      state.threadsChartData = update(state.threadsChartData, {
        $set: payload
      });
    }
  },
  actions: {
    async fetchThreadsAsync({ dispatch, commit, state }) {
      try {
        let res = await Vue.axios.get(`/v1/maxscale/threads`, {
          auth: state.credentials
        });

        await commit("setThreads", res.data.data);
      } catch (error) {
        console.log("error", error);
      }
      await dispatch("genThreadsChartSchema");
      await delay(5000).then(() => {
        return dispatch("fetchThreadsAsync");
      });
    },

    genThreadsChartSchema({ commit, state }) {
      const { threads } = state;
      if (threads) {
        let arr = [];
        let lineColors = [];
        let pointColors = [];
        for (let i = 0; i < threads.length /** */; i++) {
          lineColors.push(dynamicColors(i, threads.length));
          pointColors.push(dynamicColors(i, threads.length));
          let obj = {
            id: `THREAD ID - ${threads[i].id}`,

            type: "line",
            label: `THREAD ID - ${threads[i].id}`,

            backgroundColor: lineColors[i], // background of the line
            borderColor: lineColors[i], //theme.palette.primary.main, // line color
            borderWidth: 2,
            lineTension: 0.25,
            data: [Math.floor(Math.random() * 100)]
          };
          arr.push(obj);
        }
        let threadsChartDataSchema = {
          datasets: arr,
          labels: [new Date().toLocaleTimeString()]
        };

        commit("setThreadsChartData", threadsChartDataSchema);
      }
    }
  },
  getters: {
    threadsChartData: state => state.threadsChartData
  }
};

// updateThreadsChartData(state, payload) {
//   let newThreadsChartData = state.threadsChartData.slice();
//   let timestamp = new Date().getTime();
//   for (let i = 0; i < 3 /*newThreadsChartData.length*/; i++) {
//     newThreadsChartData = update(newThreadsChartData, {
//       [i]: {
//         data: payload.isReset
//           ? {
//               $set: []
//             }
//           : {
//               $push: [[timestamp, Math.floor(Math.random() * 100)]]
//             }
//       }
//     });
//   }
//   state.threadsChartData = newThreadsChartData;
//   //   console.log("state", state);
//   //   console.log("payload", payload);
// }
