import Vue from 'vue';
import 'utils/helpers';
import 'plugins/vuex';
import 'plugins/axios';
import App from './App.vue';
import vuetify from 'plugins/vuetify';
import router from 'router';

Vue.config.productionTip = false;

new Vue({
    vuetify,
    router,
    render: h => h(App),
}).$mount('#vue-app');
