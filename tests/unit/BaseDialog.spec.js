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
                title: 'dialog title',
                onClose: () => console.log('onClose is triggered'),
                onCancel: () => console.log('onCancel is triggered'),
                onSave: () => console.log('onSave is triggered'),
            },
        })
    })

    it('Component passed required props types', () => {
        expect(wrapper.props().value).to.be.true
        expect(wrapper.props().title).to.have.string('dialog title')
        expect(wrapper.props().onClose).to.be.a('function')
        expect(wrapper.props().onCancel).to.be.a('function')
        expect(wrapper.props().onSave).to.be.a('function')
    })
    it('Component passed optionals props types', () => {
        expect(wrapper.props().minBodyWidth).to.be.a('string')
        expect(wrapper.props().dynamicWidth).to.be.a('boolean')
        expect(wrapper.props().scrollable).to.be.a('boolean')

        expect(wrapper.props().cancelText).to.be.a('string')
        expect(wrapper.props().saveText).to.be.a('string')
        expect(wrapper.props().disabledSaveBtn).to.be.a('boolean')
        expect(wrapper.props().forceAccept).to.be.a('boolean')
    })

    it('dialog closes when cancel button is pressed', () => {
        //wrapper.props.value is set to be true already when initialize the component
        expect(wrapper.vm.computeShowDialog).to.be.true

        const btn = wrapper.find('.cancel')
        let eventFired = 0
        wrapper.vm.$on('cancel-click', () => {
            eventFired++
        })
        btn.trigger('click')
        /* 
            The visibility of base-dialog is controlled by parent component.
            This set props value to be false, computeShowDialog should re-run
            to close the dialog
        */
        wrapper.setProps({ value: false })
        expect(eventFired).to.equal(1)
        expect(wrapper.vm.computeShowDialog).to.be.false
    })

    it('dialog closes when close button is pressed', () => {
        //wrapper.props.value is set to be true already when initialize the component
        expect(wrapper.vm.computeShowDialog).to.be.true
        const btn = wrapper.find('.close')
        btn.trigger('click')
        /* 
            The visibility of base-dialog is controlled by parent component.
            This set props value to be false, computeShowDialog should re-run
            to close the dialog
        */
        wrapper.setProps({ value: false })
        expect(wrapper.vm.computeShowDialog).to.be.false
    })

    /* it('dialog closes when save button is pressed', () => {
        //wrapper.props.value is set to be true already when initialize the component
        expect(wrapper.vm.computeShowDialog).to.be.true
        const btn = wrapper.find('.save')
        btn.trigger('click')
        
            // The visibility of base-dialog is controlled by parent component.
            // This set props value to be false, computeShowDialog should re-run
            // to close the dialog
       
        wrapper.setProps({ value: false })
        expect(wrapper.vm.computeShowDialog).to.be.false
    }) */
})
