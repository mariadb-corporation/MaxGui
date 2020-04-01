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
import _ from 'lodash'

export function range(start, end) {
    if (_.isNaN(start) || _.isNaN(end)) return
    return Math.floor(Math.random() * (end - start + 1)) + start
}

/**
 * @param {(Object|Array.)} val Param either Object or Array. Null is ignore*
 * @returns {Boolean} Return true if value type is object or array.
 */
export function hasChild(val) {
    //_.isObject => true if val is array or object
    //https://lodash.com/docs/4.17.15#isObject
    if (_.isObject(val)) {
        return true
    }

    return false
}

export function treatEmptyStringAsNull(val) {
    if (_.isEmpty(val)) {
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
    if (_.isNull(val)) {
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
    let r = Math.floor(Math.random() * 255)
    let g = Math.floor(Math.random() * 255)
    let b = Math.floor(Math.random() * 255)
    // return 'rgb(' + r + ',' + g + ',' + b + ')'

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
    error.response.data && (errorsArr = error.response.data.errors.map(ele => `${ele.detail}`))
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
            }
        },
    },
})
