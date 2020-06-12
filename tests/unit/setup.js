/*
 * Copyright (c) 2020 MariaDB Corporation Ab
 *
 * Use of this software is governed by the Business Source License included
 * in the LICENSE.TXT file and at www.mariadb.com/bsl11.
 *
 * Change Date: 2024-06-15
 *
 * On the date above, in accordance with the Business Source License, use
 * of this software will be governed by version 2 or later of the General
 * Public License.
 */
import Vue from 'vue'
import { mount, shallowMount, createLocalVue } from '@vue/test-utils'
import 'utils/helpers'
import Vuetify from 'vuetify'
import '@/plugins/vuetify'
import VueI18n from 'vue-i18n'
import i18n from '@/plugins/i18n'
Vue.use(Vuetify)

// Required for Vuetify (Create div with a data-app attribute)
const app = document.createElement('div')
app.setAttribute('data-app', 'true')
document.body.appendChild(app)

global.requestAnimationFrame = () => {
    return null
}

function doMount(isShallow, component, options) {
    if (isShallow) {
        return shallowMount(component, options)
    } else {
        return mount(component, options)
    }
}

Vue.config.silent = true

export default options => {
    const localVue = createLocalVue()

    let vuetify = new Vuetify({
        mocks: {
            $vuetify: {},
        },
    })

    localVue.use(vuetify)
    localVue.use(VueI18n)

    return doMount(options.shallow, options.component, {
        localVue,
        vuetify,
        i18n,
        propsData: options.props,
        attachToDocument: true,
        sync: false,
    })
}
