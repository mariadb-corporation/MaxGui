import Vue from 'vue';
import 'utils/helpers';
import 'plugins/vuex';

import App from './App.vue';
import vuetify from 'plugins/vuetify';
import router from 'router';
import commonComponents from 'components/common';
import Axios from 'axios';

const location = window.location;
Axios.defaults.baseURL = process.env.NODE_ENV === 'production' ? `${location.origin}` : process.env.VUE_APP_API;

Vue.prototype.$http = Axios;

const user = JSON.parse(sessionStorage.getItem('user'));
let token = user && user.token;

Vue.prototype.$http.defaults.headers.common['Content-Type'] = 'application/json';
if (token) {
    Vue.prototype.$http.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

Object.keys(commonComponents).forEach(name => {
    Vue.component(name, commonComponents[name]);
});
Vue.config.productionTip = false;

new Vue({
    vuetify,
    router,
    render: h => h(App),
}).$mount('#vue-app');
