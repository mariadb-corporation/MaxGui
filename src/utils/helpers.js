import Vue from 'vue';
const { t } = require('typy');

export function range(start, end) {
    if (!t(start).isNumber || !t(end).isNumber) return;

    return Math.floor(Math.random() * (end - start + 1)) + start;
}

export function hasChild(val) {
    if ((typeof val === 'object' || Array.isArray(val) === 'array') && val != null) {
        return true;
    }
    return false;
}

export function treatEmptyStringAsNull(val) {
    if (val === '') {
        return null;
    }
    return val;
}

export function handleNull(val) {
    // render null string
    if (val == null) {
        return 'null';
    }
    // check if it is object,
    if (this.hasChild(val)) {
        return ''; // set empty string
    } else {
        return val;
    }
}
export function delay(t, v) {
    return new Promise(function(resolve) {
        setTimeout(resolve.bind(null, v), t);
    });
}
export function dynamicColors() {
    let r = Math.floor(Math.random() * 255);
    let g = Math.floor(Math.random() * 255);
    let b = Math.floor(Math.random() * 255);
    return 'rgb(' + r + ',' + g + ',' + b + ')';
}

/**
 * @param {Object} error Error object that returns from try catch
 * @return {Array} An array of error string
 */
export function getErrorsArr(error) {
    let errorsArr = [error];
    error.response.data && (errorsArr = error.response.data.errors.map(ele => `${ele.detail}`));
    return errorsArr;
}
Object.defineProperties(Vue.prototype, {
    $help: {
        get() {
            return {
                range,
                hasChild,
                handleNull,
                dynamicColors,
                delay,
                treatEmptyStringAsNull,
                getErrorsArr,
            };
        },
    },
});
