import Vue from 'vue'
import 'utils/helpers'
import 'plugins/vuex'
import 'plugins/axios'
import 'plugins/fragment'
import 'plugins/lodash'
import i18n from 'plugins/i18n'
import vuetify from 'plugins/vuetify'
import App from './App.vue'

import router from 'router'
import commonComponents from 'components/common'

Object.keys(commonComponents).forEach(name => {
    Vue.component(name, commonComponents[name])
})
Vue.config.productionTip = false

new Vue({
    vuetify,
    router,
    i18n,
    render: h => h(App),
}).$mount('#app')
