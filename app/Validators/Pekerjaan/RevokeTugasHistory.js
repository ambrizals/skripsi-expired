"use strict";

const HttpService = use("HttpService");
const { StatusCodes } = require("http-status-codes");

class PekerjaanRevokeTugas {
  constructor() {
    this.ctl = new HttpService();
  }

  get rules () {
    return {
      catatan: "required"
    };
  }

  get messages () {
    return {
      "catatan.required": "Alasan penolakan wajib di isi !"
    };
  }

  async fails (errorMessages) {
    const { response, request } = this.ctx;

    return this.ctl
      .payload(errorMessages)
      .request(request)
      .status(StatusCodes.BAD_REQUEST)
      .res(response);
  }
}

module.exports = PekerjaanRevokeTugas;
