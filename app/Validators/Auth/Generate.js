"use strict";
const HttpService = use("HttpService");

const { StatusCodes } = require("http-status-codes");

class AuthGenerate {
  constructor() {
    this.ctl = new HttpService();
  }

  get rules() {
    return {
      username: "required|exists:karyawan,username",
      password: "required",
    };
  }

  get messages() {
    return {
      "username.required": "Username belum di isi !",
      "username.exists": "User belum terdaftar",
      "password.required": "Password belum di isi !",
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

module.exports = AuthGenerate;
