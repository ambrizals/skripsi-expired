"use strict";

const { StatusCodes } = require("http-status-codes");

const Pelanggan = use("App/Models/Pelanggan");
const HttpService = use("HttpService");
const Pagination = use("Pagination");

const PelangganService = use("App/Services/PelangganService");

class PelangganController extends HttpService {
  constructor() {
    super();
    this.pelangganService = new PelangganService();
  }

  async index({ request, response }) {
    const req = request.all();
    const { page, limit } = Pagination.create(req);

    const data = await this.pelangganService.paginate(page, limit).get(req);

    return this.payload(data)
      .request(request)
      .status(StatusCodes.OK)
      .res(response);
  }

  async suggest({ request, response }) {
    const req = request.all();
    
    const queryBuilder = Pelanggan.query();

    if(req.searchName) queryBuilder.where('name', 'like', `%${req.searchName}%`)

    const data = await queryBuilder.orderBy('created_at', 'desc').limit(5).fetch()

    return this.payload(data)
      .request(request)
      .status(StatusCodes.OK)
      .res(response);
  }

  async store({ request, response }) {
    const data = await this.pelangganService.create(request.all());
    return this.payload(data)
      .request(request)
      .status(StatusCodes.OK)
      .res(response);
  }

  async update({ request, response, params }) {
    const data = await Pelanggan.findOrFail(params.id);
    await data.merge(request.all());
    await data.save();

    return this.payload({
      message: "Data pelanggan berhasil diperbarui",
    })
      .request(request)
      .status(StatusCodes.OK)
      .res(response);
  }
}

module.exports = PelangganController;
