"use strict";
const { StatusCodes } = require("http-status-codes");

const HttpService = use("HttpService");
const Pagination = use("Pagination");
const Karyawan = use("App/Models/Karyawan/Karyawan");

class EmployeeController extends HttpService {
  constructor() {
    super();
  }

  async index({ request, response }) {
    const req = request.all();
    const { page, limit } = Pagination.create(req);

    const queryBuilder = Karyawan.query().with('jabatan');

    req.searchFullname
      ? queryBuilder.where("fullname", "like", "%" + req.searchFullname + "%")
      : null;

    req.isActive
      ? req.isActive === "true"
        ? queryBuilder.where("is_active", true)
        : queryBuilder.where("is_active", false)
      : null;

    req.sortDate
      ? queryBuilder.orderBy("created_at", "asc")
      : queryBuilder.orderBy("created_at", "desc");

    req.activeSort
      ? queryBuilder.orderBy("is_active", "asc")
      : queryBuilder.orderBy("is_active", "desc");

    const employee = await queryBuilder.paginate(page, limit);

    return this.payload(employee)
      .request(request)
      .status(StatusCodes.OK)
      .res(response);
  }

  async store({ request, response }) {
    const req = request.except(["confirmPassword"]);
    const data = await Karyawan.create(req);
    return this.payload({
      messages: "Data Pegawai Telah Dibuat",
      result: data,
    })
      .request(request)
      .status(StatusCodes.OK)
      .res(response);
  }

  async show({ request, response, params }) {
    const data = await Karyawan.findOrFail(params.id);
    return this.payload(data)
      .request(request)
      .status(StatusCodes.OK)
      .res(response);
  }

  async update({ request, response, params }) {
    const data = await Karyawan.findOrFail(params.id);
    await data.merge(request.except(['password']));
    await data.save();

    return this.payload({
      message: "Data Pegawai Telah Diperbarui",
    })
      .request(request)
      .status(StatusCodes.OK)
      .res(response);
  }

  async forcePassword ({ request, response, params }) {
    const req = request.all();
    const karyawan = await Karyawan.findOrFail(params.id);
    karyawan.password = req.password;
    await karyawan.save();

    return this.payload({
      message: "Password berhasil di ganti !"
    }).request(request).status(StatusCodes.OK).res(response)
  }

  async suggest({ request, response }) {
    const req = request.all();
    const queryBuilder = Karyawan.query();

    if(req.searchName) queryBuilder.where('fullname', 'like', `%${req.searchName}%`);

    const karyawan = await queryBuilder.orderBy('created_at', 'desc').fetch();

    return this.payload(karyawan)
      .request(request)
      .status(StatusCodes.OK)
      .res(response)
  }
}

module.exports = EmployeeController;
