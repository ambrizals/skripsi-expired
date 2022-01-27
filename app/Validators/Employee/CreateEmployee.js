"use strict";
const HttpService = use("HttpService");
const { StatusCodes } = require("http-status-codes");

class CreateEmployee {
  constructor() {
    this.ctl = new HttpService();
  }

  get rules() {
    return {
      username: "required|unique:karyawan,username",
      password: "required",
      confirmPassword: "required|same:password",
      fullname: "required|max:50",
      home_address: "required",
      phone_number: "required|max:13|min:10",
    };
  }

  get messages() {
    return {
      "username.required": "Username wajib di isi !",
      "username.unique": "Username telah digunakan !",
      "password.required": "Password wajib di isi !",
      "confirmPassword.required": "Konfirmasi Password Wajib Di Isi !",
      "confirmPassword.same": "Password dan Konfirmasi Password Harus Sama !",
      "fullname.required": "Nama Lengkap Wajib Di Isi !",
      "fullname.max": "Nama Lengkap Tidak Boleh Lebih Dari 50 Karakter",
      "home_address.required": "Alamat Rumah Wajib Di Isi !",
      "phone_number.required": "Nomor Telepon Wajib Di Isi",
      "phone_number.max": "Nomor Telepon Tidak Boleh Lebih dari 13 Angka",
      "phone_number.min": "Nomor Telepon Tidak Kurang dari 10 Angka",
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

module.exports = CreateEmployee;
