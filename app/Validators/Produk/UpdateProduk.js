"use strict";

const HttpService = use("HttpService");
const { StatusCodes } = require("http-status-codes");

class ProdukUpdateProduk {
  constructor() {
    this.ctl = new HttpService();
  }

  get rules() {
    return {
      name: "required",
      price: "required|number",
    };
  }

  get messages() {
    return {
      "name.required": "Nama Produk Wajib Di Isi !",
      "price.required": "Harga Produk Wajib Di Isi !",
      "price.number": "Harga Produk Harus Berupa Angka !",
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

module.exports = ProdukUpdateProduk;
