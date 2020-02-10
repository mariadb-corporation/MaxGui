import Vue from "vue";
import axios from "axios";
import VueAxios from "vue-axios";

const apiClient = axios.create({
  baseURL: process.env.VUE_APP_API,
  headers: {
    "Content-Type": "application/json"
  }
});

Vue.use(VueAxios, apiClient);
