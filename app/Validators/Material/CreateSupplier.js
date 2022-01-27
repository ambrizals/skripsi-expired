"use strict";

const HttpService = use("HttpService");
const { StatusCodes } = require("http-status-codes");

class MaterialCreateSupplier {
  constructor() {
    this.ctl = new HttpService();
  }

  get rules() {
    return {
      name: "required|unique:supplier,name",
      type: "required",
    };
  }

  get messages() {
    return {
      "name.required": "Nama Supplier Wajib Di Isi !",
      "name.unique": "Nama Supplier Telah Digunakan !",
      "type.required": "Jenis Supplier Wajib Di Isi !",
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

module.exports = MaterialCreateSupplier;
