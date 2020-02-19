import Vue from "vue";
import "utils/helpers";
import "plugins/vuex";
import "plugins/axios";
import App from "./App.vue";
import vuetify from "plugins/vuetify";
import router from "router";
import Fragment from "vue-fragment";

Vue.config.productionTip = false;
Vue.use(Fragment.Plugin);

new Vue({
    vuetify,
    router,
    render: h => h(App)
}).$mount("#vue-app");
