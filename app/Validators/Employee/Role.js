"use strict";
const { StatusCodes } = require("http-status-codes");
const HttpService = use("HttpService");

class EmployeeRole {
  constructor() {
    this.ctl = new HttpService();
  }

  get rules() {
    return {
      name: "required|unique:karyawan_jabatan,name",
    };
  }

  get messages() {
    return {
      "name.required": "Nama posisi wajib di isi !",
      "name.unique": "Nama posisi telah di gunakan !",
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

module.exports = EmployeeRole;
