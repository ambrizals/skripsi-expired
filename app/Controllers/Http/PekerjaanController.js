"use strict";

const { StatusCodes } = require("http-status-codes");

const HttpService = use("HttpService");
const AuthService = use("AuthService");
const Pekerjaan = use("App/Models/Pekerjaan");
const CreatorService = use("App/Services/Pekerjaan/PekerjaanCreator");
const FinishService = use("App/Services/Pekerjaan/FinishAction");

class PekerjaanController extends HttpService {
  constructor() {
    super();
    this.authService = new AuthService();
    this.createService = new CreatorService();
    this.finishService = new FinishService();
  }

  async index ({ request, response }) {
    const req = request.all();

    const queryBuilder = Pekerjaan.query()
      .with("DetailTransaksi", (builder) => builder.select("id", "cover", "jenis", "status"));

    if (req.searchId) queryBuilder.where('id', req.searchId);

    if (req.searchName) queryBuilder.where('name', 'like', `%${req.searchName}%`);

    if (req.paginate) queryBuilder.where('id', '<', req.paginate);

    const data = await queryBuilder.orderBy('id', 'desc').limit(process.env.PAGINATION || req.limitPage || 10).fetch();

    return this.payload(data)
      .request(request)
      .status(StatusCodes.OK)
      .res(response);
  }

  async readyList ({ request, response }) {
    const data = await Pekerjaan.query().with('DetailTransaksi').where('productCreated', 0).where('isReady', 1).fetch();

    return this.payload(data)
      .request(request)
      .status(StatusCodes.OK)
      .res(response);
  }

  async store ({ request, response, params }) {
    const header = request.headers();
    const karyawan = await this.authService.getUser(header["x-auth-token"]);
    const data = await this.createService.transaksi(params.id);
    await data.create(karyawan);

    return this.payload({
      message: "Pekerjaan telah dibuat",
    })
      .request(request)
      .status(StatusCodes.OK)
      .res(response);
  }

  async show ({ request, response, params }) {
    const data = await Pekerjaan.query().with('CreatedBy').with('DetailTransaksi').where("id", params.id).first();

    if (data) {
      return this.payload(data)
        .request(request)
        .status(StatusCodes.OK)
        .res(response);
    } else {
      return this.payload({
        message: "Data tidak ditemukan",
      })
        .request(request)
        .status(StatusCodes.NOT_FOUND)
        .res(response);
    }
  }

  async markFinish ({ request, response, params }) {
    const pekerjaan = await Pekerjaan.findOrFail(params.id);
    const detailTransaksi = await pekerjaan.DetailTransaksi().first();

    if (detailTransaksi.status === 'finish') {
      return this.payload({
        message: "Pekerjaan ini sudah diselesaikan"
      }).request(request).status(StatusCodes.BAD_REQUEST).res(response)
    } else {
      await this.finishService.create(pekerjaan, detailTransaksi);
      return this.payload({
        message: "Pekerjaan telah diselesaikan.",
      })
        .request(request)
        .status(StatusCodes.OK)
        .res(response);
    }
  }

  async update ({ request, response, params }) {
    const req = request.all();
    const data = await Pekerjaan.findOrFail(params.id);
    data.catatan = req.catatan;
    await data.save();

    return this.payload({
      message: 'Data berhasil diperbarui'
    }).request(request).status(StatusCodes.OK).res(response);
  }
}

module.exports = PekerjaanController;
