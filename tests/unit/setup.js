import Vue from 'vue'
import { mount, shallowMount, createLocalVue } from '@vue/test-utils'
import '@/utils/helpers'
import Vuetify from 'vuetify'
import Vuex from 'vuex'
Vue.use(Vuetify)
Vue.use(Vuex)

Vue.config.silent = true
// Required for Vuetify (Create div with a data-app attribute)
const app = document.createElement('div')
app.setAttribute('data-app', 'true')
document.body.appendChild(app)

function doMount(isShallow, component, options) {
    if (isShallow) {
        return shallowMount(component, options)
    } else {
        return mount(component, options)
    }
}

export default options => {
    const localVue = createLocalVue()

    let vuetify = new Vuetify({
        mocks: {
            $vuetify: {},
        },
    })

    localVue.use(vuetify)
    let store = options.store

    return doMount(options.shallow, options.component, {
        store,
        localVue,
        vuetify,
        propsData: options.props,
        attachToDocument: true,
        sync: false,
    })
}
