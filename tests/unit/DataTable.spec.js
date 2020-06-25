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

/* import { expect } from 'chai' */

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
                    { text: 'Service', value: 'id' },
                    { text: 'Status', value: 'state', align: 'center' },
                    { text: 'Router', value: 'router' },
                    { text: 'Current Sessions', value: 'connections' },
                    { text: 'Total Sessions', value: 'total_connections' },
                    { text: 'Servers', value: 'serverIds' },
                ],
                data: [
                    {
                        id: 'RCR-Writer',
                        state: 'Started',
                        router: 'readconnroute',
                        connections: 0,
                        total_connections: 0,
                        serverIds: ['row_server_1', 'row_server_2'],
                    },
                    {
                        id: 'RCR-Router',
                        state: 'Started',
                        router: 'readconnroute',
                        connections: 0,
                        total_connections: 0,
                        serverIds: ['row_server_1', 'row_server_2'],
                    },
                    {
                        id: 'RWS-Router',
                        state: 'Started',
                        router: 'readwritesplit',
                        connections: 0,
                        total_connections: 0,
                        serverIds: ['row_server_1', 'row_server_2'],
                    },
                ],
            },
        })
    })

    it('Table is rendered normally with required array data, header props', () => {
        console.log('wrapper', wrapper)
        /*  const tr = wrapper.findAll('tr')
        expect(tr.length).to.equal(1)

        wrapper.setProps({
            showActionsOnHover: true,
            rowIndex: 2,
            lastPageItemIndex: 2,
        }) */
    })
})
