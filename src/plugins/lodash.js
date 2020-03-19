import _ from 'lodash'
import Vue from 'vue'
// Object.defineProperty(Vue.prototype, '$_', { value: _ })
Object.defineProperties(Vue.prototype, {
    $_: {
        get() {
            return _
        },
    },
})
