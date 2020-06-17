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
    let toggleVal = true
    beforeEach(() => {
        localStorage.clear()
        wrapper = mount({
            shallow: false,
            component: Collapse,
            props: {
                toggleVal: toggleVal,
                title: 'Collapse title',
                toggleOnClick: () => {
                    toggleVal = !wrapper.props().toggleVal
                    // mockup toggleVal reactivity props
                    wrapper.setProps({ toggleVal: toggleVal })
                },
            },
        })
    })

    it('Component collapses when toggleOnClick is called', () => {
        // this triggers toggleOnClick cb which is handle in parent component
        const toggleBtn = wrapper.find('.arrow-toggle')
        toggleBtn.trigger('click')

        // component is collapsed when toggleVal === false
        expect(wrapper.props().toggleVal).to.be.false
    })
})
