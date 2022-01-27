"use strict";

const HttpService = use("HttpService");
const { StatusCodes } = require("http-status-codes");

class TransaksiCreateDetailSpesifikasi {
  constructor() {
    this.ctl = new HttpService();
  }

  get rules() {
    return {
      name: "required",
      value: "required",
    };
  }

  get messages() {
    return {
      "name.required": "Nama spesifikasi wajib di isi !",
      "value.required": "Nilai spesifikasi wajib di isi !",
    };
  }

  async fails(errorMessages) {
    const { response, request } = this.ctx;

    return this.ctl
      .payload(errorMessages)
      .request(request)
      .status(StatusCodes.BAD_REQUEST)
      .res(response);
  }
}

module.exports = TransaksiCreateDetailSpesifikasi;
