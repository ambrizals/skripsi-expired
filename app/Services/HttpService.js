"use strict";
const { getReasonPhrase } = require("http-status-codes");

class HttpService {
  constructor() {
    this.data = null;
    this.req = null;
    this.code = 500;
    this.reason = getReasonPhrase(this.code);
  }

  payload(data) {
    this.data = data;
    return this;
  }

  request(request) {
    this.req = request;
    return this;
  }

  status(code) {
    this.code = code;
    this.reason = getReasonPhrase(code);
    return this;
  }

  async res(response) {
    return await response.status(this.code).send({
      http: {
        status: this.code,
        info: this.reason,
        url: this.req.originalUrl(),
        request: this.req.all() ? this.req.all() : null,
      },
      payload: this.data ? this.data : null,
    });
  }
}

module.exports = HttpService;
