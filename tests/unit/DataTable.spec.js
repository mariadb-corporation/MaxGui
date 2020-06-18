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
import DataTable from '@/components/common/DataTable.vue'

describe('DataTable.vue', () => {
    let wrapper
    // mockup parent value passing to Collapse

    beforeEach(() => {
        localStorage.clear()
        wrapper = mount({
            shallow: false,
            component: DataTable,
            props: {
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
                data: [
                    {
                        id: 'row_server_3',
                        serverAddress: '127.0.0.1',
                        serverPort: 4003,
                        serverConnections: 0,
                        serverState: 'Down',
                        serviceIds: 'No services',
                        gtid: null,
                        groupId: 'Monitor-1',
                        monitorState: 'Running',
                    },
                    {
                        id: 'row_server_2',
                        serverAddress: '127.0.0.1',
                        serverPort: 4002,
                        serverConnections: 0,
                        serverState: 'Slave, Running',
                        serviceIds: ['RCR-Router', 'RCR-Writer', 'RWS-Router'],
                        gtid: '0-1000-9',
                        groupId: 'Monitor-1',
                        monitorState: 'Running',
                    },
                    {
                        id: 'row_server_1',
                        serverAddress: '127.0.0.1',
                        serverPort: 4001,
                        serverConnections: 0,
                        serverState: 'Master, Running',
                        serviceIds: ['RCR-Router', 'RCR-Writer', 'RWS-Router'],
                        gtid: '0-1000-9',
                        groupId: 'Monitor-1',
                        monitorState: 'Running',
                    },
                ],
                colsHasRowSpan: 2,
                search: '',
                sortBy: 'groupId',
            },
        })
    })

    it('DataTable test', () => {
        console.log('Not done yet', wrapper)
    })
})
