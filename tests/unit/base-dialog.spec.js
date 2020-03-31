/*
 * Copyright (c) 2020 MariaDB Corporation Ab
 *
 * Use of this software is governed by the Business Source License included
 * in the LICENSE.TXT file and at www.mariadb.com/bsl11.
 *
 * Change Date: 2024-07-01
 *
 * On the date above, in accordance with the Business Source License, use
 * of this software will be governed by version 2 or later of the General
 * Public License.
 */
import Vuex from 'vuex'
import mount from './setup'
import BaseDialog from '@/components/common/BaseDialog.vue'

describe('BaseDialog.vue', () => {
    let getters
    let store
    beforeEach(() => {
        getters = {
            darkTheme: () => true,
        }
        store = new Vuex.Store({
            getters,
        })
    })
    it('Snapshot render', () => {
        let wrapper = mount({
            shallow: false,
            component: BaseDialog,
            store: store,
            props: {
                value: true, // set Modal to be open
            },
        })

        expect(wrapper.html()).toMatchSnapshot()
    })
    it('closes when buttons are pressed', () => {
        let wrapper = mount({
            shallow: false,
            component: BaseDialog,
            store: store,
            props: {
                value: true, // set Modal to be open
            },
        })
        const closeButton = wrapper.find('.close')
        const cancelButton = wrapper.find('.cancel')
        let eventFired = 0

        wrapper.vm.$on('cancelClick', () => {
            eventFired++
        })

        closeButton.trigger('click')
        cancelButton.trigger('click')
        expect(eventFired).toEqual(2)
    })
})
