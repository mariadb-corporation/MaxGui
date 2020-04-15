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
import Vue from 'vue'

export const isNaN = require('lodash/isNaN')
export const isObject = require('lodash/isObject')
export const isEmpty = require('lodash/isEmpty')
export const isNull = require('lodash/isNull')
export const isFunction = require('lodash/isFunction')
export const cloneDeep = require('lodash/cloneDeep')
export const isUndefined = require('lodash/isUndefined')
export const pickBy = require('lodash/pickBy')
export const isBoolean = require('lodash/isBoolean')
export const pick = require('lodash/pick')

export function range(start, end) {
    if (isNaN(start) || isNaN(end)) return
    return Math.floor(Math.random() * (end - start + 1)) + start
}

/**
 * @param {(Object|Array.)} val Param either Object or Array. Null is ignore*
 * @returns {Boolean} Return true if value type is object or array.
 */
export function hasChild(val) {
    /*  help.isObject => true if val is array or object
        https://lodash.com/docs/4.17.15#isObject 
        Empty child won't be shown
    */

    if (isObject(val) && !isEmpty(val) && val !== null) {
        return true
    }
    return false
}

export function treatEmptyStringAsNull(val) {
    if (isEmpty(val)) {
        return null
    }
    return val
}

/**
 * @param {(Object|String.)} val Param either Object or String.*
 * @returns Return String
 */
export function handleNull(val) {
    // render null string
    if (isNull(val)) {
        return 'null'
    }
    // check if it is object, or array
    if (this.hasChild(val)) {
        return '' // set empty string
    } else {
        return val
    }
}
export function handleEmptyString(val) {
    return val === '' ? '""' : val
}
export function delay(t, v) {
    return new Promise(function(resolve) {
        setTimeout(resolve.bind(null, v), t)
    })
}
export function dynamicColors(dataIndex) {
    const palette = [
        'rgba(171,199,74,1)',
        'rgba(14,100,136,1)',
        'rgba(150,221,207,1)',
        'rgba(47,153,163,1)',
        'rgba(0,53,69,1)',
        'rgba(45,156,219,1)',
        'rgba(125,208,18,1)',
        'rgba(66,79,98,1)',
        'rgba(245,157,52,1)',
    ]
    return palette[dataIndex % palette.length]
}

export function strReplaceAt(str, index, chr) {
    if (index > str.length - 1) return str
    return str.substr(0, index) + chr + str.substr(index + 1)
}
/**
 * @param {Object} error Error object that returns from try catch
 * @return {Array} An array of error string
 */
export function getErrorsArr(error) {
    let errorsArr = [error]

    !isUndefined(error.response.data.errors) &&
        (errorsArr = error.response.data.errors.map(ele => `${ele.detail}`))
    return errorsArr
}

export function groupBy(OurArray, property) {
    return OurArray.reduce(function(accumulator, object) {
        // get the value of our object(age in our case) to use for group the array as the array key
        const key = object[property]
        /*  if the current value is similar to the key(age) don't accumulate
        the transformed array and leave it empty */
        if (!accumulator[key]) {
            accumulator[key] = []
        }
        // add the value to the array
        accumulator[key].push(object)
        // return the transformed array
        return accumulator
        // Also we also set the initial value of reduce() to an empty object
    }, {})
}
/**
 * @param {String} str String to be sliced
 * @param {String} char find the indexOf provided char
 * @param {Boolean} returnLastPart if true, slice the last part
 * @return {String} new String
 */
export function sliceStrAtChar(str, char, returnLastPart) {
    return returnLastPart
        ? str.slice(str.indexOf(char) + 1, str.indexOf(str.slice(-1)) + 1)
        : str.slice(0, str.indexOf(char))
}

// Helper functions to display icon
export function serviceStateIcon(serviceState) {
    if (serviceState) {
        if (serviceState.includes('Started')) return 2
        if (serviceState.includes('Stopped') || serviceState.includes('Allocated')) return 0
        else return ''
    } else return ''
}
export function serverStateIcon(serverStatus) {
    if (serverStatus) {
        if (serverStatus === 'Master, Running' || serverStatus === 'Slave, Running') return 2
        if (serverStatus === 'Running') return 1
        if (serverStatus === 'Down') return 0
        else return ''
    } else return ''
}
export function monitorStateIcon(monitorState) {
    if (monitorState) {
        if (monitorState.includes('Running')) return 2
        if (monitorState.includes('Stopped')) return 1
        else return ''
    } else return ''
}
/**
 * @param {String} value String date to be formatted
 * @param {String} formatType format type
 * @return {String} new String with HH:mm:ss MM/DD/YYYY format
 */
export function formatValue(value, formatType) {
    let date = new Date(value)
    const DATE_RFC2822 = 'ddd, DD MMM YYYY HH:mm:ss'
    const default_format = 'HH:mm:ss MM/DD/YYYY'
    let format
    switch (formatType) {
        case 'DATE_RFC2822':
            format = DATE_RFC2822
            break
        default:
            format = default_format
    }

    return Vue.moment(date).format(format)
}
/**
 * @param {Object} obj Object to be converted to array
 * @return {Array}  an array of objects with format like this {id: key, value: obj[key]}
 */
export function objToArrOfObj(obj) {
    if (typeof obj === 'object') {
        let data = []
        let targetObj = cloneDeep(obj)

        if (!isEmpty(targetObj)) {
            Object.keys(targetObj).map(key => {
                data.push({ id: key, value: handleValue(targetObj[key]) })
            })
            return data
        }
    }
    return []
}

/**
 * @param {Any} value Object to be converted to array
 * @return {Any} return valid value, null becomes 'null', '' becomes "''", otherwise return 'n/a'
 */
export function handleValue(value) {
    let typeOfValue = typeof value
    let newVal

    if (
        Array.isArray(value) ||
        typeOfValue === 'object' ||
        typeOfValue === 'string' ||
        typeOfValue === 'number' ||
        typeOfValue === 'boolean'
    ) {
        newVal = value
    } else {
        newVal = 'undefined'
    }
    // handle typeof null object and empty string
    if (value === null) newVal = 'null'
    if (value === '') newVal = "''"
    return newVal
}
/**
 * @param {Object} obj Object to be processed in to tree data arr
 * @param {Number} level level of data
 * @return {Array} return tree data arr
 */
export function processTreeData(obj, level) {
    if (typeof obj === 'object') {
        let data = []
        let self = this
        let targetObj = self.cloneDeep(obj)

        if (!self.isEmpty(targetObj)) {
            Object.keys(targetObj).map(key => {
                const value = self.handleValue(targetObj[key])
                let newValue = self.cloneDeep(value)

                let typeOfValue = typeof value
                if (typeOfValue === 'object') {
                    newValue = null
                } else if (Array.isArray(value)) {
                    newValue = { ...newValue } // convert to object
                }
                let children = self.processTreeData(self.handleValue(targetObj[key]), level + 1)

                data.push({
                    id: key,
                    level: level + 1,
                    value: newValue,
                    children: children,
                    /* width of one v-treeview-node__level is 24, by default
                     */
                    colNameWidth: `calc(65% - 11px -  ${(level + 1) * 8.5}px)`,
                    colValueWidth: `calc(35% - 11px - ${(level + 1) * 8.5}px)`,
                })
            })
            return data
        }
    }
    return []
}
Object.defineProperties(Vue.prototype, {
    $help: {
        get() {
            return {
                range,
                hasChild,
                handleNull,
                handleEmptyString,
                dynamicColors,
                delay,
                treatEmptyStringAsNull,
                getErrorsArr,
                strReplaceAt,
                groupBy,
                sliceStrAtChar,
                serviceStateIcon,
                serverStateIcon,
                monitorStateIcon,
                formatValue,
                objToArrOfObj,
                handleValue,
                processTreeData,
                // lodash
                isNaN,
                isObject,
                isEmpty,
                isNull,
                isFunction,
                cloneDeep,
                isUndefined,
                pickBy,
                pick,
                isBoolean,
            }
        },
    },
})
