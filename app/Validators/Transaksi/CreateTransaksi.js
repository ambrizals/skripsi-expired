"use strict";

const HttpService = use("HttpService");
const { StatusCodes } = require("http-status-codes");

class TransaksiCreateTransaksi {
  constructor() {
    this.ctl = new HttpService();
  }

  get rules() {
    return {
      penerima: "required",
      alamat_pengiriman: "required",
      nomor_telepon: "required",
    };
  }

  get messages() {
    return {
      "penerima.required": "Nama penerima wajib di isi !",
      "alamat_pengiriman.required": "Alamat pengiriman wajib di isi !",
      "nomor_telepon.required": "Nomor telepon wajib di isi !",
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

module.exports = TransaksiCreateTransaksi;
