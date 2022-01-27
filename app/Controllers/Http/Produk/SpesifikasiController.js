"use strict";
const { StatusCodes } = require("http-status-codes");

const Specs = use("App/Models/Produk/Spesifikasi");
const Product = use("App/Models/Produk/Produk");
const SpecService = use("App/Services/Produk/SpecsService");
const HttpService = use("HttpService");

class SpesifikasiController extends HttpService {
  constructor() {
    super();
    this.service = new SpecService();
  }

  async product({ request, response, params }) {
    const product = await Product.findOrFail(params.id);
    const data = await product.spesifikasi().fetch();
    return this.payload({
      product,
      spesifikasi: data,
    })
      .request(request)
      .status(StatusCodes.OK)
      .res(response);
  }

  async store({ request, response, params }) {
    const req = request.all();
    const data = await this.service.product(params.id).data(req).create();
    return this.payload(data)
      .request(request)
      .status(StatusCodes.OK)
      .res(response);
  }

  async show({ request, response, params }) {
    const data = await Specs.query().where("produk", params.id).fetch();
    return this.payload(data)
      .request(request)
      .status(StatusCodes.OK)
      .res(response);
  }

  async update({ request, response, params }) {
    const data = await Specs.findOrFail(params.id);
    await data.merge(request.all());
    await data.save();
    return this.payload({
      message: "Spesifikasi berhasil diperbarui",
    })
      .request(request)
      .status(StatusCodes.OK)
      .res(response);
  }

  async destroy({ request, response, params }) {
    const data = await Specs.findOrFail(params.id);
    await data.delete();
    return this.payload({
      message: "Spesifikasi berhasil di hapus !",
    })
      .request(request)
      .status(StatusCodes.OK)
      .res(response);
  }
}

module.exports = SpesifikasiController;
