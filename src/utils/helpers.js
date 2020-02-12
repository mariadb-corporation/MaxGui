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

Object.defineProperties(Vue.prototype, {
  $help: {
    get() {
      return {
        hasChild,
        handleNull
      };
    }
  }
});
