"use strict";

const HttpService = use("HttpService");
const { StatusCodes } = require("http-status-codes");

class Pelanggan {
  constructor() {
    this.ctl = new HttpService();
  }

  get rules() {
    return {
      name: "required|unique:pelanggan,name",
      address: "required",
    };
  }

  get messages() {
    return {
      "name.required": "Nama Pelanggan Wajib Di Isi !",
      "name.unique": "Pelanggan sudah terdaftar !",
      "address.required": "Alamat Wajib Di Isi !",
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

module.exports = Pelanggan;
