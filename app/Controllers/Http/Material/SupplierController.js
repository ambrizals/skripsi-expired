"use strict";
const { StatusCodes } = require("http-status-codes");

const HttpService = use("HttpService");
const Supplier = use("App/Models/Material/Supplier");
const Pagination = use("Pagination");

const SupplierService = use("App/Services/Material/SupplierService");

class SupplierController extends HttpService {
  constructor() {
    super();
    this.supplierService = new SupplierService();
  }

  async index({ request, response }) {
    const req = request.all();
    const { page, limit } = Pagination.create(req);

    const queryBuilder = Supplier.query();

    req.searchName
      ? queryBuilder.where("name", "like", "%" + req.searchName + "%")
      : null;

    const supplier = await queryBuilder
      .orderBy("created_at", "desc")
      .paginate(page, limit);

    return this.payload(supplier)
      .request(request)
      .status(StatusCodes.OK)
      .res(response);
  }

  async suggest({ request, response }) {
    const req = request.all();
    const queryBuilder = Supplier.query();

    if (req.searchName) queryBuilder.where('name', 'like', `%${req.searchName}%`)

    const supplier = await queryBuilder.orderBy("created_at", "desc").limit(5).fetch();

    return this.payload(supplier)
      .request(request)
      .status(StatusCodes.OK)
      .res(response)
  }

  async store({ request, response }) {
    const req = Object.assign(request.all(), { is_valid: true });
    const data = await this.supplierService.data(req).create();
    return this.payload(data)
      .request(request)
      .status(StatusCodes.OK)
      .res(response);
  }

  async show({ request, response, params }) {
    const supplier = await Supplier.findOrFail(params.id);
    return this.payload(supplier)
      .request(request)
      .status(StatusCodes.OK)
      .res(response);
  }

  async update({ request, response, params }) {
    const data = await Supplier.findOrFail(params.id);
    await data.merge(request.all());
    await data.save();

    return this.payload({
      message: "Supplier berhasil diperbarui !",
    })
      .request(request)
      .status(StatusCodes.OK)
      .res(response);
  }
}

module.exports = SupplierController;
