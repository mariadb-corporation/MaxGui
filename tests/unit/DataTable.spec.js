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
import DataTable from '@/components/common/DataTable'

describe('DataTable.vue', () => {
    let wrapper

    // mockup parent value passing to Collapse

    beforeEach(() => {
        localStorage.clear()
        wrapper = mount({
            shallow: false,
            component: DataTable,
            props: {
                /* 
                    object in headers may have these properties sortable: 
                    true || false, editableCol: true || false, align: "center || left || right",
                    cellTruncated: true || false, width: String, padding: String

                   - editableCol, align is mainly used for styling purpose which is applied in table-cell.
                   - sortable is used for disable sorting on table, by default it's always true.
                   - cellTruncated is a condition to emit 'get-truncated-info' event in table-cell
                */
                headers: [
                    { text: 'Variable', value: 'id' },
                    { text: 'Value', value: 'value' },
                ],
                data: [
                    {
                        id: 'Item 0',
                        value: null,
                    },
                    {
                        id: 'Item 1',
                        value: undefined,
                    },
                    {
                        id: 'Item 2',
                        value: 'value of item 2',
                    },
                ],
            },
        })
    })

    it(`Normal table: component processes data as expected when keepPrimitiveValue 
      props is true or false`, () => {
        /* 
            by default keepPrimitiveValue is set to false which means 
            null, undefined become a string i.e. 'null', 'undefined' respectively.
            This allows null or undefined value to be shown on the table and can be searched using global-search
            component
        */
        expect(wrapper.vm.$props.keepPrimitiveValue).to.equal(false)
        let processedData = wrapper.vm.processingData

        expect(processedData[0].value).to.equal('null')
        expect(processedData[1].value).to.equal('undefined')
        expect(processedData[0].value).to.be.a('string')
        expect(processedData[1].value).to.be.a('string')

        // this keep original value
        wrapper.setProps({
            keepPrimitiveValue: true,
        })
        expect(wrapper.vm.$props.keepPrimitiveValue).to.equal(true)
        let oriData = wrapper.vm.processingData
        expect(oriData[0].value).to.be.a('null')
        expect(oriData[1].value).to.be.an('undefined')
    })
})
