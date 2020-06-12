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
// https://programming.vip/docs/running-interval-timer-with-worker-in-vue-environment.html
import Logger from './logging'
const logger = new Logger('main')

export class workerTimer {
    constructor() {}
    timeInterval(name, interval, _this) {
        logger.info(name + ' has been set up')
        this[name] = setInterval(() => {
            _this.postMessage({ name: name, message: `${interval / 1000} Seconds arrived.` })
        }, Number(interval))
    }
}
