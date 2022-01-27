"use strict";

const { StatusCodes } = require("http-status-codes");

const Material = use('App/Models/Material/Material');
const Database = use('Database');
const MaterialService = use("App/Services/Material/MaterialService");
const Pagination = use("Pagination");
const HttpService = use("HttpService");
const Time = use('Time');
const Logger = use('Logger');

/**
 * Resourceful controller for interacting with materials
 */
class MaterialController extends HttpService {
  constructor() {
    super();
    this.materialService = new MaterialService();
  }

  async index({ request, response }) {
    const req = request.all();
    const { page, limit } = Pagination.create(req);

    const queryBuilder = Material.query().with("Supplier");

    req.search
      ? queryBuilder.where("name", "like", "%" + req.search + "%")
      : null;

    queryBuilder.orderBy("updated_at", "desc");

    const data = await queryBuilder.paginate(page, limit);

    return this.payload(data)
      .request(request)
      .status(StatusCodes.OK)
      .res(response);
  }

  async store({ request, response }) {
    const date = Time.currentTime();
    let supplier;
    const req = request.all();
    const trx = await Database.beginTransaction();
    try {
      const supplierCheck = await trx.from('supplier').where('name', req.supplier).first();
      if (supplierCheck) {
        supplier = supplierCheck.id
      } else {
        supplier = await trx.insert({
          name: req.supplier,
          created_at: date,
          updated_at: date
        }).into('supplier');
      }
      const materialCheck = await trx.from('material').where({ name: req.name, supplier: supplier }).first();

      if (materialCheck) {
        await trx.from('material').where('id', materialCheck.id).update({
          name: req.name,
          price: req.price,
          satuan: req.satuan,
          updated_at: date
        })
      } else {
        await trx.insert({
          name: req.name,
          supplier: supplier,
          price: req.price,
          satuan: req.satuan,
          created_at: date,
          updated_at: date
        }).into('material');
      }

      await trx.commit();
      return this.payload({
        message: "Data material berhasil di tambah"
      })
        .request(request)
        .status(StatusCodes.OK)
        .res(response);
    } catch(err) {
      Logger.error('Material Error Rollback', {
        request: request,
        technical: err
      });
      await trx.rollback();
      return this.payload({
        message: "Terjadi kesalahan saat menyimpan data."
      })
        .request(request)
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .res(response);
    }
  }

  async update({ request, response, params }) {
    await this.materialService.id(params.id).update(request.all());
    return this.payload({
      message: "Data berhasil diperbarui !",
    })
      .request(request)
      .status(StatusCodes.OK)
      .res(response);
  }

  async suggest({ request, response }) {
    const req = request.all();

    const queryBuilder = Material.query();
    if (req.searchName) queryBuilder.where('name', 'like', `%${req.searchName}%`);
    if (req.supplier) queryBuilder.where('supplier', req.supplier);

    const material = await queryBuilder.orderBy('updated_at', 'desc').limit(5).fetch();

    return this.payload(material)
      .request(request)
      .status(StatusCodes.OK)
      .res(response);
  }
}

module.exports = MaterialController;
