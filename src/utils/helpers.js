import Vue from 'vue'
import { cloneDeep } from 'lodash'

const { t } = require('typy')
export function assertAlive(decoded) {
    const now = Date.now().valueOf() / 1000
    if (typeof decoded.exp !== 'undefined' && decoded.exp < now) {
        throw new Error(`token expired: ${JSON.stringify(decoded)}`)
    }
    if (typeof decoded.nbf !== 'undefined' && decoded.nbf > now) {
        throw new Error(`token not yet valid: ${JSON.stringify(decoded)}`)
    }
}

export function deepClone(obj) {
    return cloneDeep(obj)
}

export function range(start, end) {
    if (!t(start).isNumber || !t(end).isNumber) return

    return Math.floor(Math.random() * (end - start + 1)) + start
}

/**
 * @param {(Object|Array.)} val Param either Object or Array. Null is ignore*
 * @returns {Boolean} A boolean value to detect wheter value is object or array
 */
export function hasChild(val) {
    if ((typeof val === 'object' || Array.isArray(val) === 'array') && val !== null) {
        return true
    }
    return false
}

export function treatEmptyStringAsNull(val) {
    if (val === '') {
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
    if (val == null) {
        return 'null'
    }
    // check if it is object,
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
export function dynamicColors() {
    let r = Math.floor(Math.random() * 255)
    let g = Math.floor(Math.random() * 255)
    let b = Math.floor(Math.random() * 255)
    return 'rgb(' + r + ',' + g + ',' + b + ')'
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
                deepClone,
                assertAlive,
            }
        },
    },
})
