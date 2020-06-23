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
import TableCell from '@/components/common/DataTable/TableCell'

describe('TableCell.vue', () => {
    let wrapper

    // mockup parent value passing to Collapse

    beforeEach(() => {
        localStorage.clear()
        wrapper = mount({
            shallow: false,
            component: TableCell,
            props: {
                cellIndex: 0,
                item: {
                    id: 'row_server_1',
                    serverAddress: '127.0.0.1',
                    serverPort: 4001,
                    serverConnections: 0,
                    serverState: 'Master, Running',
                    serviceIds: ['RCR-Router', 'RCR-Writer', 'RWS-Router'],
                    gtid: '0-1000-9',
                    groupId: 'Monitor',
                    monitorState: 'Running',
                },
                header: { text: `Monitor`, value: 'groupId' },
                headers: [
                    { text: `Monitor`, value: 'groupId' },
                    { text: 'State', value: 'monitorState' },
                    { text: 'Servers', value: 'id' },
                    { text: 'Address', value: 'serverAddress' },
                    { text: 'Port', value: 'serverPort' },
                    { text: 'Connections', value: 'serverConnections' },
                    { text: 'State', value: 'serverState' },
                    { text: 'GTID', value: 'gtid' },
                    { text: 'Services', value: 'serviceIds' },
                ],
                rowIndex: 0,
                hasOrderNumber: false,
                editableCell: false,
                tdBorderLeft: false,
                // For displaying draggable icon
                draggable: false,
                showDragIcon: false,
                // For displaying action column slot
                indexOfHoveredRow: null,
                // For displaying rowspan table
                colsHasRowSpan: null,
                // for tree view
                isTree: false,
                hasValidChild: false,
                // for external v-menu activator
                componentId: 'test-0123i',
            },
        })
    })

    it(`Testing rowspan feature: component assigned accurate
        td rowspan attribute value`, () => {
        let rowspanData = [
            {
                groupId: 'Monitor',
                rowspan: 2,
                hidden: true,
                id: 'row_server_2',
                gtid: '0-1000-9',
                monitorState: 'Running',
                serverAddress: '127.0.0.1',
                serverConnections: 0,
                serverPort: 4002,
                serverState: 'Slave, Running',
                serviceIds: ['RCR-Router', 'RCR-Writer', 'RWS-Router'],
            },
            {
                groupId: 'Monitor',
                rowspan: 2,
                hidden: false,
                id: 'row_server_1',
                serverAddress: '127.0.0.1',
                serverPort: 4001,
                serverConnections: 0,
                serverState: 'Master, Running',
                serviceIds: ['RCR-Router', 'RCR-Writer', 'RWS-Router'],
                gtid: '0-1000-9',
                monitorState: 'Running',
            },
        ]
        // rendering the first cell (aka groupId)
        wrapper.setProps({
            cellIndex: 0,
            colsHasRowSpan: 1,
            item: rowspanData[0],
        })
        wrapper.vm.$nextTick(() => {
            const td = wrapper.findAll('td')
            expect(td.length).to.equal(1)
            expect(td.at(0).attributes().rowspan).to.equal('2')
        })
    })
})
