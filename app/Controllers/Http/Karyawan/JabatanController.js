"use strict";

const { StatusCodes } = require("http-status-codes");
const HttpService = use("HttpService");
const Jabatan = use("App/Models/Karyawan/Jabatan");

class RoleController extends HttpService {
  async index({ request, response }) {
    const data = await Jabatan.all();
    return this.payload(data)
      .request(request)
      .status(StatusCodes.OK)
      .res(response);
  }

  async store({ request, response }) {
    const req = request.all();
    await Jabatan.create(req);
    return this.payload({
      message: "Posisi jabatan berhasil di buat !",
    })
      .request(request)
      .status(StatusCodes.OK)
      .res(response);
  }

  async update({ request, response, params }) {
    const jabatan = await Jabatan.findOrFail(params.id);
    await jabatan.merge(request.all());
    await jabatan.save();
    return this.payload({
      message: "Posisi jabatan telah diperbarui",
    })
      .request(request)
      .status(StatusCodes.OK)
      .res(response);
  }
}

module.exports = RoleController;
