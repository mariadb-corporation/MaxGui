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
import { expect } from 'chai'
import mount from './setup'
import BaseDialog from '@/components/common/BaseDialog.vue'

describe('BaseDialog.vue', () => {
    let wrapper
    let show = true
    beforeEach(() => {
        localStorage.clear()
        wrapper = mount({
            shallow: false,
            component: BaseDialog,
            props: {
                value: show,
                title: 'dialog title',
                onCancel: () => {
                    show = !wrapper.props().value
                    wrapper.setProps({ value: show })
                },
                onClose: () => {
                    show = !wrapper.props().value
                    wrapper.setProps({ value: show })
                },
                onSave: () => {
                    show = !wrapper.props().value
                    wrapper.setProps({ value: show })
                },
            },
        })
    })

    it('dialog closes when cancel button or close button is pressed', () => {
        //----------------case: cancel btn
        expect(wrapper.vm.computeShowDialog).to.be.true
        const cancelBtn = wrapper.find('.cancel')
        cancelBtn.trigger('click')
        expect(wrapper.vm.computeShowDialog).to.be.false

        //---------------case: close btn
        show = true
        // make dialog open again
        wrapper.setProps({ value: show })
        expect(wrapper.vm.computeShowDialog).to.be.true

        const closeBtn = wrapper.find('.close')

        closeBtn.trigger('click')
        expect(wrapper.vm.computeShowDialog).to.be.false
    })

    it('dialog closes when save button is pressed (async)', async () => {
        show = true
        // make dialog open again
        wrapper.setProps({ value: show })
        expect(wrapper.vm.computeShowDialog).to.be.true
        await Vue.nextTick()
        const saveBtn = wrapper.find('.save')
        saveBtn.trigger('click')
        await Vue.nextTick()
        expect(wrapper.vm.computeShowDialog).to.be.false
    })
})
