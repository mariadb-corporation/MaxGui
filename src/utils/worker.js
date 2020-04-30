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
import { workerTimer } from 'utils/workerTimer'
/**
 *Traversing parameters through traversers
 *new Create new worker classes
 *Call the timer method
 */
self.onmessage = function(e) {
    e.data.map(item => {
        let worker_Timer = new workerTimer()
        worker_Timer.timeInterval(item.name, item.interval, self)
    })
}