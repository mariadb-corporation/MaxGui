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
export const isEqual = require('lodash/isEqual')
export const xorWith = require('lodash/xorWith')
export const uniqueId = require('lodash/uniqueId')
export const orderBy = require('lodash/orderBy')
export const flattenDeep = require('lodash/flattenDeep')

export function getCookie(name) {
    let value = '; ' + document.cookie
    let parts = value.split('; ' + name + '=')
    if (parts.length == 2)
        return parts
            .pop()
            .split(';')
            .shift()
}

export function range(start, end) {
    if (isNaN(start) || isNaN(end)) return
    return Math.floor(Math.random() * (end - start + 1)) + start
}

//------------------------- Helper functions to display icon -------------------------------
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
        if (serverStatus === 'Running' || serverStatus.includes('Maintenance')) return 1
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

export function delay(t, v) {
    return new Promise(function(resolve) {
        setTimeout(resolve.bind(null, v), t)
    })
}

export function dynamicColors(dataIndex) {
    const palette = [
        'rgba(171,199,74,1)',
        'rgba(245,157,52,1)',
        'rgba(47,153,163,1)',
        'rgba(150,221,207,1)',
        'rgba(125,208,18,1)',
        'rgba(14,100,136,1)',
        'rgba(66,79,98,1)',
        'rgba(0,53,69,1)',
        'rgba(45,156,219,1)',
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

/**
 * @param {Array} OurArray Array of objects to be grouped by specified property name of object
 * @param {String} property Property to be grouped by
 * @return {Array} Return an object group by specified property name
 */
export function groupBy(array, property) {
    return array.reduce(function(accumulator, object) {
        // get the value of our object based on provided property to use for group the array as the array key
        const key = object[property]
        /*  if the current value is similar to the key don't accumulate the transformed array and leave it empty */
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

/**
 * @param {String} str String to be sliced, use for resource name
 * @return {String} new return singular string
 */
export function pluralToSingularStr(str) {
    return str.slice(0, str.lastIndexOf('s'))
}
/**
 * @param {String} value String date to be formatted
 * @param {String} formatType format type
 * @return {String} new String with HH:mm:ss MM/DD/YYYY format
 */
export function formatValue(value, formatType) {
    let date = new Date(value)
    const DATE_RFC2822 = 'ddd, DD MMM YYYY HH:mm:ss'
    const default_format = 'HH:mm:ss MM.DD.YYYY'
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
 * @param {Boolean} keepPrimitiveValue keepPrimitiveValue to whether call handleValue function or not
 * @param {Number} level depth level for nested object
 * @param {Object} nodeParent parent node , usually it's null
 * @param {String} keyName keyName
 * @param {String} keyValue keyValue
 * @return {Array}  an array of objects with format like this {id: key, value: obj[key]}
 */
let id = 0
export function objToArrOfObj(
    obj,
    keepPrimitiveValue,
    level,
    nodeParent = null,
    keyName = 'id',
    keyValue = 'value'
) {
    const isValidObj = obj !== null && typeof obj === 'object'
    if (isValidObj) {
        let data = []
        let targetObj = cloneDeep(obj)

        if (!isEmpty(targetObj)) {
            Object.keys(targetObj).map(key => {
                let value = keepPrimitiveValue ? targetObj[key] : handleValue(targetObj[key])

                let newObj = {
                    [keyName]: key,
                    [keyValue]: value,
                    level: level,
                    nodeId: ++id,
                    nodeParent: nodeParent,
                    originalValue: value,
                }

                const hasChild =
                    (value !== null && typeof value === 'object') || Array.isArray(value)
                let children = []

                if (hasChild) {
                    // only object has child value will have expanded property
                    newObj.expanded = false
                    //hard coding value when the value is an object.
                    newObj[keyValue] = handleValue('hasChild')
                    children = objToArrOfObj(value, keepPrimitiveValue, level + 1, newObj)
                }
                if (Array.isArray(value)) {
                    // convert to object
                    children = objToArrOfObj({ ...value }, keepPrimitiveValue, level + 1, newObj)
                }
                newObj.children = children
                newObj.leaf = !hasChild
                data.push(newObj)
            })
            return data
        }
    }
    return []
}

/**
 * @param {Array} a Array of object to be converted to object
 * @param {String} keyName keyName
 * @param {String} keyValue keyValue
 * @return {Object}  return original object of the objToArrOfObj function
 */
export function arrOfObjToObj(a, keyName = 'id', keyValue = 'value') {
    if (Array.isArray(a)) {
        console.log(a)
        let array = cloneDeep(a)

        let resultObj = {}

        let objValue = {} // if value of keyName is an object
        let ObjKeyName = null // if value of keyName is an object
        for (let i = 0; i < array.length; ++i) {
            let o = array[i]
            if (!isEmpty(o)) {
                if (o.nodeParent !== null) {
                    const originalObjValue = o.nodeParent.originalValue
                    const originalObjId = o.nodeParent.id
                    const objValueKeys = cloneDeep(Object.keys(objValue)).sort()
                    const originalObjValueKeys = cloneDeep(Object.keys(originalObjValue)).sort()

                    if (
                        !isEqual(objValueKeys, originalObjValueKeys) &&
                        ObjKeyName !== originalObjId
                    ) {
                        objValue = originalObjValue
                        ObjKeyName = originalObjId
                    }

                    objValue[o[keyName]] = o[keyValue] //set new value to key

                    resultObj[o.nodeParent.id] = objValue
                }
                /* the value needs to be handled, convert from 'null' or '' to 
                the actual null object */
                // leaf is undefined when the array wasn't created by objToArrOfObj
                else if (o.leaf || o.leaf === undefined) {
                    resultObj[o[keyName]] = o[keyValue]
                } else {
                    let objValue = arrOfObjToObj(o.children)
                    resultObj[o[keyName]] = objValue
                }
            }
        }

        return resultObj
    }
    return {}
}
/**
 * @private
 * Flatten a node to a single array
 * @param {Object} node Node being flattened
 * @param {Array} [children] Children of node
 * @return {Array} Array of flatten nodes
 */
function flattenNode(node, children) {
    children = children || []

    if (node.children) {
        children = children.concat(node.children)
        node.children.forEach(child => {
            child.parentNode = node
            children.splice(children.indexOf(child) + 1, 0, flattenNode(child))
        })
    }

    return flattenDeep(children)
}
/**
 * Flatten an array nested nodes
 * @param {Array} nodes Nodes to flatten
 * @return {Array} Array of flatten nodes
 */
function flattenNodes(nodes) {
    let flattenNodes = []

    nodes.forEach(node => {
        flattenNodes.push(node)

        flattenNodes.push(flattenNode(node))
    })

    return flattenDeep(flattenNodes)
}
/**
 * @param {Any} value Object to be converted to array
 * @return {Any} return valid value, null becomes 'null', '' becomes "''", otherwise return 'undefined'
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
    // special reserve word value when the value is an object. for handling display nested object in data-table
    if (value === 'hasChild') newVal = ''
    return newVal
}

Object.defineProperties(Vue.prototype, {
    $help: {
        get() {
            return {
                getCookie,
                range,
                serviceStateIcon,
                serverStateIcon,
                monitorStateIcon,

                delay,
                dynamicColors,
                strReplaceAt,
                getErrorsArr,
                groupBy,
                sliceStrAtChar,
                formatValue,
                objToArrOfObj,
                arrOfObjToObj,
                handleValue,
                pluralToSingularStr,
                flattenNodes,
                // arrayObjDeepCompare,
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
                isEqual,
                xorWith,
                uniqueId,
                orderBy,
            }
        },
    },
})
