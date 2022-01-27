"use strict";
const HttpService = use("HttpService");

const { StatusCodes } = require("http-status-codes");

class ForcePassword {
  constructor() {
    this.ctl = new HttpService();
  }

  get rules () {
    return {
      password: "required",
      confirmPassword: "required|same:password"
    };
  }

  get messages () {
    return {
      "password.required": "Password wajib di isi !",
      "confirmPassword.required": "Pasword konfirmasi wajib di isi !",
      "confirmPassword.same": "Password konfirmasi harus sama dengan password baru !"
    };
  }

  async fails (errorMessages) {
    const { response, request } = this.ctx;

    return this.ctl
      .payload(errorMessages)
      .request(request)
      .status(StatusCodes.BAD_REQUEST)
      .res(response);
  }
}

module.exports = ForcePassword;
