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
                    id: 'RWS-Router',
                },
                header: { text: 'Service', value: 'id' },

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

    it('cell-hover and get-truncated-info events are emitted when cell is hovered', () => {
        const td = wrapper.findAll('td')
        expect(td.length).to.equal(1)
        wrapper.setProps({
            item: {
                value: 'Longggggggggggggggggggggggggggggg text',
            },
            header: { text: 'Value', value: 'value', cellTruncated: true },
        })
        let eventFired = 0
        wrapper.vm.$nextTick(() => {
            td.at(0).trigger('mouseenter')
        })
        wrapper.vm.$on('cell-hover', () => {
            eventFired++
            wrapper.vm.$on('get-truncated-info', () => {
                eventFired++
            })
        })
        wrapper.vm.$nextTick(() => {
            expect(eventFired).to.equal(2)
        })
    })

    it('Testing rowspan feature: component assigned accurate td rowspan attribute value', () => {
        wrapper.setProps({
            cellIndex: 0, // rendering the first cell (aka groupId)
            header: { text: `Monitor`, value: 'groupId' }, // rendering the first cell (aka groupId)
            colsHasRowSpan: 1,
            item: {
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
        })
        wrapper.vm.$nextTick(() => {
            const td = wrapper.findAll('td')
            expect(td.length).to.equal(1)
            expect(td.at(0).attributes().rowspan).to.equal('2')
        })
    })
})
