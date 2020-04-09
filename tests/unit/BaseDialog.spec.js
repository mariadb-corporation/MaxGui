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
import { expect } from 'chai'
import mount from './setup'
import BaseDialog from '@/components/common/BaseDialog.vue'

describe('BaseDialog.vue', () => {
    let wrapper

    beforeEach(() => {
        wrapper = mount({
            shallow: false,
            component: BaseDialog,
            props: {
                value: true,
            },
        })
    })

    it('Renders as Vue instance.', () => {
        expect(wrapper.isVueInstance()).to.equal(true)
    })

    it('closes when buttons are pressed', () => {
        const closeButton = wrapper.find('.close')
        const cancelButton = wrapper.find('.cancel')
        let eventFired = 0

        wrapper.vm.$on('cancelClick', () => {
            eventFired++
        })

        closeButton.trigger('click')
        cancelButton.trigger('click')
        expect(eventFired).to.equal(2)
    })
})
