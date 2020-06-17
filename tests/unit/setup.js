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
import Logger from 'utils/logging'
import vuetify from '@/plugins/vuetify'
import i18n from '@/plugins/i18n'
import '@/plugins/vuex'
import store from 'store'
import PortalVue from 'portal-vue'
import { Plugin as fragment } from 'vue-fragment'

Vue.use(fragment)
Vue.use(PortalVue)
Vue.Logger = Logger

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

    return doMount(options.shallow, options.component, {
        localVue,
        store,
        vuetify,
        i18n,
        propsData: options.props,
        attachTo: '#app',
    })
}
