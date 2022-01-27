"use strict";

const { StatusCodes } = require("http-status-codes");

const Material = use("App/Models/Pekerjaan/Material");
const MaterialPermintaan = use("App/Models/Pekerjaan/MaterialPermintaan");
const HttpService = use("HttpService");
const AuthService = use("AuthService");
const Creator = use("App/Services/Pekerjaan/MaterialCreator");
const Database = use("Database");
const Logger = use("Logger");
const Time = use("Time");

class MaterialController extends HttpService {
  constructor() {
    super();
    this.date = Time.currentTime();
    this.authService = new AuthService();
    this.creator = new Creator();
  }

  async requestList({ request, response, params }) {
    const data = await MaterialPermintaan.query().with('KaryawanData', (builder) => {
      builder.select('id', 'fullname')
    }).with('ExecutionerData', (builder) => {
      builder.select('id', 'fullname')
    }).where('pekerjaan', params.id)
    .orderBy('created_at', 'desc')
    .fetch();

    return this.payload(data).request(request).status(StatusCodes.OK).res(response);
  }

  async show({ request, response, params }) {
    const data = await Material.query()
      .with('Karyawan', (builder) => {
        builder.select('id', 'fullname')
      })
      .with('RequestBy', (builder) => {
        builder.select('id', 'fullname')
      })
      .where("pekerjaan", params.id)
      .orderBy("created_at", "desc")
      .fetch();

    return this.payload(data)
      .request(request)
      .status(StatusCodes.OK)
      .res(response);
  }

  async store({ request, response, params }) {
    /**
     * Request is only contain : name, price, qty, unit type, price, store.
     *
     *
     */
    const req = request.all();

    const header = request.headers();
    const user = await this.authService.getUser(header["x-auth-token"]);
    const trx = await Database.beginTransaction();

    try {
      let supplier;
      let material;
      let pekerjaanMaterial;

      supplier = await this.creator.createSupplier(trx, req);
      material = await this.creator.createMaterial(trx, req, supplier)
      pekerjaanMaterial = await this.creator.createPekerjaanMaterial(trx, req, params.id, user);

      const catatMaterial = {
        pekerjaanMaterial,
        material
      }

      await this.creator.createPengeluaran(trx, params.id, user, catatMaterial, req);  

      await trx.commit();
      return this.payload({
        message: "Material pekerjaan sudah ditambahkan !",
      })
        .request(request)
        .status(StatusCodes.OK)
        .res(response);
    } catch(err) {
      console.log(err);
      await trx.rollback();
      Logger.error('Material Store Exception', err);
      return this.payload({
        message: "Terjadi Kesalahan",
        code: err.code,
        errMsg: err.message
      })
        .request(request)
        .status(StatusCodes.NOT_IMPLEMENTED)
        .res(response);      
    }
  }

  async acceptRequest({ request, response, params }) {
    const req = request.all();

    const header = request.headers();
    const user = await this.authService.getUser(header["x-auth-token"]);
    const PermintaanMaterial = await MaterialPermintaan.findOrFail(params.id);
    const trx = await Database.beginTransaction();

    try {
      let supplier;
      let material;
      let pekerjaanMaterial;
      supplier = await this.creator.createSupplier(trx, req);
      material = await this.creator.createMaterial(trx, req, supplier);
      pekerjaanMaterial = await this.creator.createPekerjaanMaterial(trx, req, PermintaanMaterial.pekerjaan, user, PermintaanMaterial);
      const catatMaterial = {
        pekerjaanMaterial,
        material
      }
      const link = await this.creator.createPengeluaran(trx, PermintaanMaterial.pekerjaan, user, catatMaterial, req);
      await this.creator.updateLinkRequest(trx, link, PermintaanMaterial.id);
      await trx.from('pekerjaan_permintaan_material').where('id', params.id).update({
        updated_at: this.date,
        executioner: user.id,
        isAccept: true
      });
      await trx.commit();
      return this.payload({
        message: "Material pekerjaan sudah ditambahkan !",
      })
        .request(request)
        .status(StatusCodes.OK)
        .res(response);
    } catch (err) {
      await trx.rollback();
      Logger.error('Material Accept Exception', err);
      return this.payload({
        message: "Terjadi Kesalahan",
        code: err.code,
        errMsg: err.message
      })
        .request(request)
        .status(StatusCodes.NOT_IMPLEMENTED)
        .res(response);
    }    
  }

  async destroy({ request, response, params }) {
    const material = await MaterialPermintaan.findOrFail(params.id);
    await material.delete();
    return this.payload({
      message: 'Permintaan material ditolak dan telah dihapus'
    }).request(request).status(StatusCodes.OK).res(response);
  }
}

module.exports = MaterialController;
