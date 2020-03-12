import Vue from 'vue'
import 'utils/helpers'
import 'plugins/vuex'
import 'plugins/axios'
import 'plugins/typy'
import 'plugins/fragment'

import App from './App.vue'
import vuetify from 'plugins/vuetify'
import router from 'router'
import commonComponents from 'components/common'

Object.keys(commonComponents).forEach(name => {
    Vue.component(name, commonComponents[name])
})
Vue.config.productionTip = false

new Vue({
    vuetify,
    router,

    render: h => h(App),
}).$mount('#app')
