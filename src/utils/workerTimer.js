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
import Logger from './logging'
const logger = new Logger('main')

export class workerTimer {
    constructor() {}
    timeInterval(name, interval, cb) {
        logger.info(name + ' has been set up')
        this[name] = setInterval(() => {
            cb()
        }, Number(interval))
    }
    terminate(name) {
        logger.info(name + ' has been terminated')
        clearInterval(this[name])
    }
}
