import Vue from 'vue';

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

Object.defineProperties(Vue.prototype, {
    $help: {
        get() {
            return {
                hasChild,
                handleNull,
                dynamicColors,
                delay,
                treatEmptyStringAsNull,
            };
        },
    },
});
