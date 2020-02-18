import Vue from "vue";

export function hasChild(val) {
  if ((typeof val === "object" || typeof val === "array") && val != null) {
    return true;
  }
  return false;
}

export function handleNull(val) {
  // render null string
  if (val == null) {
    return "null";
  }
  // check if it is object,
  if (this.hasChild(val)) {
    return ""; // set empty string
  } else {
    return val;
  }
}
export function dynamicColors() {
  let r = Math.floor(Math.random() * 255);
  let g = Math.floor(Math.random() * 255);
  let b = Math.floor(Math.random() * 255);
  return "rgb(" + r + "," + g + "," + b + ")";
}

Object.defineProperties(Vue.prototype, {
  $help: {
    get() {
      return {
        hasChild,
        handleNull,
        dynamicColors
      };
    }
  }
});
