"use strict";

const HttpService = use("HttpService");
const { StatusCodes } = require("http-status-codes");

class TransaksiPembayaran {
  constructor() {
    this.ctl = new HttpService();
  }

  get rules() {
    return {
      jumlah_pembayaran: "required",
    };
  }

  get messages() {
    return {
      "jumlah_pembayaran.required": "Jumlah pembayaran wajib di isi !",
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

module.exports = TransaksiPembayaran;
