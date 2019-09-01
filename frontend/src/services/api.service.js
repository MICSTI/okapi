import Vue from "vue";
import axios from "axios";
import VueAxios from "vue-axios";
import TokenService from "@/services/token.service";
import { API_URL } from "@/common/config";

const ApiService = {
  init() {
    Vue.use(VueAxios, axios);
    Vue.axios.defaults.baseURL = API_URL;
  },

  async setHeader() {
    const token = await TokenService.getToken();

    Vue.axios.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${token}`;
  },

  async get(resource) {
    try {
      return Vue.axios.get(`${resource}`);
    }
    catch (err) {
      throw new Error(`ApiService ${err}`);
    }
  },

  async post(resource, params) {
    try {
      return Vue.axios.post(`${resource}`, params);
    }
    catch (err) {
      throw new Error(`ApiService ${err}`);
    }
  },

  async put(resource, params) {
    try {
      return Vue.axios.put(`${resource}`, params);
    }
    catch (err) {
      throw new Error(`ApiService ${err}`);
    }
  },

  async delete(resource, params) {
    try {
      return Vue.axios.delete(`${resource}`, params);
    }
    catch (err) {
      throw new Error(`ApiService ${err}`);
    }
  }
};

export default ApiService;
