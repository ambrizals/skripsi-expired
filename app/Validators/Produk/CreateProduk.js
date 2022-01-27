"use strict";

const HttpService = use("HttpService");
const { StatusCodes } = require("http-status-codes");

class ProdukCreateProduk {
  constructor() {
    this.ctl = new HttpService();
  }

  get rules() {
    return {
      name: "required|unique:produk,name",
      price: "required|number",
    };
  }

  get messages() {
    return {
      "name.required": "Nama Produk Wajib Di Isi !",
      "name.unique": "Nama Produk Telah Digunakan !",
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

module.exports = ProdukCreateProduk;
