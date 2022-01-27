"use strict";

const HttpService = use("HttpService");
const { StatusCodes } = require("http-status-codes");

class PekerjaanCreateMaterial {
  constructor() {
    this.ctl = new HttpService();
  }

  get rules() {
    return {
      name: "required",
      qty: "required",
      satuan: "required",
      supplier: "required",
      price: "required",
    };
  }

  get messages() {
    return {
      "name.required": "Nama material wajib di isi !",
      "price.required": "Harga material wajib di isi !",
      "satuan.required": "Satuan material wajib di pilih !",
      "supplier.required": "Nama supplier wajib di isi !",
      "qty.required": "Qty wajib di isi !",
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

module.exports = PekerjaanCreateMaterial;
