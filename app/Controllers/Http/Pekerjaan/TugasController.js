"use strict";

const { StatusCodes } = require("http-status-codes");
const AuthService = use("AuthService");
const HttpService = use("HttpService");
const Database = use('Database');

const Tugas = use("App/Models/Tugas");
const TugasKaryawan = use("App/Models/Tugas/Karyawan");
const Pekerjaan = use("App/Models/Pekerjaan");
const Detail = use('App/Models/Transaksi/Detail');
const fcm = use('App/Helpers/fcm');

const TugasDestroyer = use('App/Services/Pekerjaan/TugasDestroyer')

const Time = use("Time");
const Logger = use("Logger");

class TugasController extends HttpService {
  constructor() {
    super();
    this.authService = new AuthService();
    this.tugasDestroyer = new TugasDestroyer();
  }

  async show ({ request, response, params }) {
    const data = await Tugas.query()
      .with('CreatedBy', (builder) => {
        builder.select('id', 'fullname');
      })
      .with('Penerima', (builder) => {
        builder.select('id', 'name');
      })
      .where("pekerjaan", params.id)
      .where('isDelete', false)
      .orderBy("created_at", "desc")
      .fetch();

    return this.payload(data)
      .request(request)
      .status(StatusCodes.OK)
      .res(response);
  }

  async history({ request, response, params }) {
    const data = await TugasKaryawan.query()
      .with('Karyawan', (builder) => {
        builder.select('id', 'fullname')
      })
      .with('CreatedBy', (builder) => {
        builder.select('id', 'fullname')
      })
      .with('Tugas', (builder) => {
        builder.select('id', 'name')
      })
      .with('RevokeBy', (builder) => {
        builder.select('id', 'fullname')
      })
      .orderBy('created_at', 'desc')
      .where('pekerjaan', params.id).fetch();

    return this.payload(data)
      .request(request)
      .status(StatusCodes.OK)
      .res(response);    
  }

  async detail ({ request, response, params }) {
    const data = await TugasKaryawan.query()
      .with('Tugas')
      .with('Karyawan')
      .with('CreatedBy')
      .where('tugas', params.id)
      .fetch();

    return this.payload(data)
      .request(request)
      .status(StatusCodes.OK)
      .res(response);
  }

  async store ({ request, response, params }) {
    const header = request.headers();
    const karyawan = await this.authService.getUser(header["x-auth-token"]);    
    const date = Time.currentTime();
    const pekerjaan = await Pekerjaan.findOrFail(params.id);
    const _detail = await Detail.query().where('id', pekerjaan.transaksi_detail).first();
    const detail = _detail.toJSON();

    const trx = await Database.beginTransaction();

    try {
      const req = Object.assign(request.all(), {
        pekerjaan: params.id,
        target_selesai: detail.qty,
        transaksi_detail: pekerjaan.transaksi_detail,
        created_by: karyawan.id,
        created_at: date,
        updated_at: date
      });

      await trx.from('transaksi_detail').where('id', pekerjaan.transaksi_detail).update({
        updated_at: date,
        status: 'process'
      })

      await trx.from('pekerjaan').where('id', params.id).update({
        isReady: false,
        updated_at: date
      })

      const tugas = await trx.insert(req).into('tugas');

      fcm.post({
        title: 'Terdapat Tugas Baru',
        body: 'Terdapat tugas ' + req.name + ' untuk pesanan ' + detail.name,
        type: 'tugas',
        data: tugas[0]
      }, 'outfield-' + req.penerima)

      await trx.commit();

      return this.payload({
        message: "Tugas berhasil ditambah !",
      })
        .request(request)
        .status(StatusCodes.OK)
        .res(response);
    } catch (err) {
      await trx.rollback();
      Logger.error('Pekerjaan Creator Error', err)
      return this.payload({
        message: "Terjadi Kesalahan",
      })
        .request(request)
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .res(response);
    }
  }

  async destroy ({ request, response, params }) {
    const data = await Tugas.findOrFail(params.id);

    if (data.target_selesai === data.jumlah_selesai) {
      return this.payload({
        message: "Tugas ini sudah selesai",
      })
        .request(request)
        .status(StatusCodes.LOCKED)
        .res(response);
    } else if (data.jumlah_selesai > 0) {
      return this.payload({
        message: "Terdapat beberapa item yang telah diselesaikan",
      })
        .request(request)
        .status(StatusCodes.LOCKED)
        .res(response);
    } else {
      await this.tugasDestroyer.deleteTugas(data);

      return this.payload({
        message: "Tugas berhasil dihapus !",
      })
        .request(request)
        .status(StatusCodes.OK)
        .res(response);
    }
  }

  async revokeHistory({ request, response, params }) {
    const header = request.headers();
    const req = request.all();
    const data = await TugasKaryawan.findOrFail(params.id);
    const karyawan = await this.authService.getUser(header["x-auth-token"]);    

    await this.tugasDestroyer.revokeHistory(data, req, karyawan);

    return this.payload({
      message: 'Riwayat tugas berhasil ditolak'
    }).request(request).status(StatusCodes.OK).res(response);

  }
}

module.exports = TugasController;
