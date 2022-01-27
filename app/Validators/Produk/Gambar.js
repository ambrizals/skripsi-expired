"use strict";

const HttpService = use("HttpService");
const { StatusCodes } = require("http-status-codes");

class ProdukGambar {
  constructor() {
    this.ctl = new HttpService();
  }

  get rules() {
    return {
      image: "required",
    };
  }

  get messages() {
    return {
      "image.required": "Harus terdapat file yang di pilih !",
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

module.exports = ProdukGambar;
