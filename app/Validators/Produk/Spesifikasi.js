"use strict";

const HttpService = use("HttpService");
const { StatusCodes } = require("http-status-codes");

class ProdukSpesifikasi {
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
      "name.required": "Nama Spesifikasi Wajib Di Isi !",
      "value.required": "Nilai Spesifikasi Wajib Di Isi !",
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

module.exports = ProdukSpesifikasi;
