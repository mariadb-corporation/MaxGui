import Vue from "vue";
import { delay, dynamicColors } from "utils/helpers";

export default {
    state: {
        isDestroyed: false,
        threads: [],
        updateCount: 1,
        chartdata: {
            labels: [],
            datasets: []
        },
        credentials: JSON.parse(localStorage.getItem("credentials"))
    },
    mutations: {
        setThreads(state, payload) {
            state.threads = payload;
        },
        setThreadsChartData(state, payload) {
            state.chartdata = payload;
        },
        updateCount(state) {
            state.updateCount += 1;
        },
        resetDestroyState(state) {
            state.isDestroyed = false;
        },
        clearState(state) {
            state.isDestroyed = true;
            state.chartdata = {
                labels: [],
                datasets: []
            };
            state.threads = [];
            state.updateCount = 0;
        }
    },
    actions: {
        async fetchThreadsAsync({ dispatch, commit, state }) {
            try {
                let res = await Vue.axios.get(`/v1/maxscale/threads`, {
                    auth: state.credentials
                });
                //set threads
                commit("setThreads", res.data.data);
                // only generate DataSet Schema once
                if (state.chartdata.datasets.length === 0) {
                    await dispatch("genDataSetSchema");
                } else {
                    await commit("updateCount");
                }

                // LOOP polling

                !state.isDestroyed &&
                    (await delay(2000).then(() => {
                        return dispatch("fetchThreadsAsync");
                    }));
            } catch (error) {
                console.log("error", error);
                !state.isDestroyed &&
                    (await delay(5000).then(() => {
                        return dispatch("fetchThreadsAsync");
                    }));
            }
        },

        genDataSetSchema({ commit, state }) {
            const { threads } = state;
            if (threads) {
                let arr = [];
                let lineColors = [];
                let pointColors = [];
                for (let i = 0; i < threads.length; i++) {
                    lineColors.push(dynamicColors());
                    pointColors.push(dynamicColors());
                    let obj = {
                        id: `THREAD ID - ${threads[i].id}`,
                        type: "line",
                        label: `THREAD ID - ${threads[i].id}`,
                        backgroundColor: "rgba(0,0,0,0)", // background of the line
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
        chartdata: state => state.chartdata,
        updateCount: state => state.updateCount
    }
};
