"use strict";

const { StatusCodes } = require("http-status-codes");

const HttpService = use("HttpService");
const AuthService = use("AuthService");

const Tugas = use("App/Models/Tugas");
const TugasKaryawan = use("App/Models/Tugas/Karyawan");
const PekerjaanMaterialPermintaan = use("App/Models/Pekerjaan/MaterialPermintaan");
const Pekerjaan = use("App/Models/Pekerjaan");
const fcm = use('App/Helpers/fcm');
const CheckCreator = use("App/Services/Tugas/CheckCreator");

class TugasController extends HttpService {
  constructor() {
    super();
    this.authService = new AuthService();
    this.checkCreator = new CheckCreator();
  }

  async index ({ request, response }) {
    const header = request.headers();
    const karyawan = await this.authService.getUser(header["x-auth-token"]);
    const data = await Tugas.query()
      .with('TransaksiDetail', (builder) => {
        builder.select('id', 'name', 'deskripsi', 'cover', 'jenis')
      })
      .where("penerima", karyawan.role)
      .where('isFinish', false)
      .orderBy("created_at", "desc")
      .fetch();

    return this.payload(data)
      .request(request)
      .status(StatusCodes.OK)
      .res(response);
  }

  async detail ({ request, response, params }) {
    const header = request.headers();
    const karyawan = await this.authService.getUser(header["x-auth-token"]);

    const data = await TugasKaryawan.query()
      .where("tugas", params.id)
      .where("karyawan", karyawan.id)
      .orderBy("created_at", "desc")
      .fetch();

    return this.payload(data)
      .request(request)
      .status(StatusCodes.OK)
      .res(response);
  }

  async show ({ request, response, params }) {
    const data = await Tugas.findOrFail(params.id);
    const detail = await data.TransaksiDetail().first();
    return this.payload({
      data,
      detail
    }).request(request).status(StatusCodes.OK).res(response);
  }

  async store ({ request, response, params }) {
    const header = request.headers();
    const karyawan = await this.authService.getUser(header["x-auth-token"]);

    const flag = await this.checkCreator.create(
      request.all(),
      karyawan,
      params.id
    );

    if (flag.status === "success") {
      return this.payload({
        message: "Tugas yang sudah dikerjakan berhasil ditambah",
      })
        .request(request)
        .status(StatusCodes.OK)
        .res(response);
    } else if (flag.status === "overload") {
      return this.payload({
        message: "Jumlah yang dikerjakan melebihi target !",
      })
        .request(request)
        .status(StatusCodes.LOCKED)
        .res(response);
    } else {
      return this.payload({
        message: "Terjadi Kesalahan",
      })
        .request(request)
        .status(StatusCodes.BAD_REQUEST)
        .res(response);
    }
  }

  async requestMaterial ({ request, response, params }) {
    const req = request.all();
    const header = request.headers();
    const karyawan = await this.authService.getUser(header["x-auth-token"]);

    const tugas = await Tugas.findOrFail(params.id);
    await PekerjaanMaterialPermintaan.create({
      pekerjaan: tugas.pekerjaan,
      karyawan: karyawan.id,
      name: req.name,
      qty: req.qty || 1,
    });

    const pekerjaan = await Pekerjaan.findOrFail(tugas.pekerjaan);
    fcm.post({
      title: 'Terdapat permintaan material',
      body: 'Sistem mendapati permintaan material ' + req.name + ' pada pekerjaan ' + pekerjaan.name,
      type: 'pekerjaan',
      data: tugas.pekerjaan
    }, 'office')

    return this.payload({
      message: "Permintaan material telah dikirim !",
    })
      .request(request)
      .status(StatusCodes.OK)
      .res(response);
  }
}

module.exports = TugasController;
