/* eslint-disable no-console */
import _ from 'lodash'
const traceCaller = require('utils/traceCaller')

const defCaller = { file: 'n/a', lineNumber: 'n/a' }

class Logger {
    constructor(name) {
        if (_.isNull(name) || _.isUndefined(name))
            throw new Error('You must provide name when creating new logger instance.')

        this.info = (...args) => {
            const caller = traceCaller(2) || defCaller
            const style = 'color: white; background-color: green;'

            console.info(
                '%c INFO ',
                style,
                `[${name}]`,
                `[${caller.file}:${caller.lineNumber}]`,
                ...args
            )
        }

        this.warn = (...args) => {
            const caller = traceCaller(2) || defCaller
            const style = 'color: black; background-color: yellow;'

            console.warn(
                '%c WARNING ',
                style,
                `[${name}]`,
                `[${caller.file}:${caller.lineNumber}]`,
                ...args
            )
        }

        this.error = (...args) => {
            const caller = traceCaller(2) || defCaller
            const style = 'color: white; background-color: red;'

            console.error(
                '%c ERROR ',
                style,
                `[${name}]`,
                `[${caller.file}:${caller.lineNumber}]`,
                ...args
            )
        }
    }
}

export default Logger
