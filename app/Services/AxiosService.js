const axios = require("axios");
const Env = use("Env");

class AxiosService {
  constructor() {
    this.headers = {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
    };

    this.axios = axios;
    this.axios.validateS;
    this.baseURL = Env.get("APP_URL");

    this.config = { validateStatus: () => true };
  }

  base(base) {
    this.baseURL = base;
    return this;
  }

  url(url) {
    this.url = this.baseURL + url;
    return this;
  }

  headers(head) {
    if (head.isArray()) {
      this.headers = {
        ...this.headers,
        head,
      };
    }
    return this;
  }

  async get() {
    try {
      return await this.axios.get(this.url, this.config);
    } catch (error) {
      console.error(error.request);
    }
  }

  post(data) {
    return this.axios.post(this.url, data, this.config);
  }

  put(data) {
    return this.axios.put(this.url, data, this.config);
  }

  delete() {
    return this.axios.delete(this.url, this.config);
  }
}

module.exports = AxiosService;
