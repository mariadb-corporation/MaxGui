import Vue from 'vue'
import VueMoment from 'vue-moment'
const moment = require('moment')
const momentDurationFormatSetup = require('moment-duration-format')
momentDurationFormatSetup(moment)
Vue.use(VueMoment, {
    moment,
})
