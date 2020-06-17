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
import Collapse from '@/components/common/Collapse.vue'

describe('Collapse.vue', () => {
    let wrapper
    // mockup parent value passing to Collapse

    beforeEach(() => {
        localStorage.clear()
        wrapper = mount({
            shallow: false,
            component: Collapse,
            props: {
                wrapperClass: 'collapse-wrapper',
                isContentVisible: true,
                title: 'Collapse title',
                toggleOnClick: () => {
                    // mockup isContentVisible reactivity props
                    wrapper.setProps({ isContentVisible: !wrapper.props().isContentVisible })
                },
            },
        })
    })

    it('Component collapses when toggleOnClick is called', () => {
        // this triggers toggleOnClick cb which is handle in parent component
        wrapper.find('.arrow-toggle').trigger('click')
        // component is collapsed when isContentVisible === false
        expect(wrapper.props().isContentVisible).to.be.false
    })

    it('Display edit button when hover', () => {
        wrapper.setProps({ onEdit: () => console.log('onEdit cb') })
        wrapper.vm.$nextTick(() => {
            wrapper.find('.collapse-wrapper').trigger('mouseenter')
            expect(wrapper.vm.$data.showEditBtn).to.be.true
        })
    })
})
