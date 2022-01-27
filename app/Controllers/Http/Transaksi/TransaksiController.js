"use strict";
const Time = use("Time");

const { StatusCodes } = require("http-status-codes");
const HttpService = use("HttpService");
const Pagination = use("Pagination");
const AuthService = use("AuthService");

const Transaksi = use("App/Models/Transaksi/Transaksi");
const Pelanggan = use('App/Models/Pelanggan');

const Database = use('Database');
const Logger = use('Logger');

class TransaksiController extends HttpService {
  constructor() {
    super();
    this.authService = new AuthService();
  }

  async index ({ request, response }) {
    const req = request.all();
    const { page, limit } = Pagination.create(req);

    const queryBuilder = Transaksi.query();

    if (req.pelanggan) queryBuilder.where("pelanggan", req.pelanggan);

    if (req.no_transaksi) queryBuilder.where("no_transaksi", 'like', `%${req.no_transaksi}%`)

    // Refference on : /database/migrations/1612755078163_modify_transaksi_schema.js
    if(req.status) queryBuilder.where('status', req.status);

    queryBuilder.with("Pelanggan", (builder) => {
      builder.select("id", "name");
    });

    req.sortDate
      ? queryBuilder.orderBy("created_at", "asc")
      : queryBuilder.orderBy("created_at", "desc");

    const data = await queryBuilder.paginate(page, limit);

    return this.payload(data)
      .request(request)
      .status(StatusCodes.OK)
      .res(response);
  }

  async store ({ request, response }) {
    const req = request.all();
    const header = request.headers();
    const karyawan = await this.authService.getUser(header["x-auth-token"]);
    const pelanggan = await Pelanggan.findOrCreate(
      { name: req.pelanggan },
      { name: req.pelanggan, address: req.alamat_pengiriman, phone: req.nomor_telepon });

    const data = await Transaksi.create({
      ...req,
      pelanggan: pelanggan.id,
      karyawan: karyawan.id,
      status: 'quotation',
    });
    return this.payload(data)
      .request(request)
      .status(StatusCodes.OK)
      .res(response);
  }

  async show ({ request, response, params }) {
    const transaksi = await Transaksi.findOrFail(params.id);
    const pelanggan = await transaksi.Pelanggan().first();
    const karyawan = await transaksi.Karyawan().first();
    return this.payload({
      ...transaksi.toJSON(),
      Pelanggan: pelanggan,
      Karyawan: karyawan
    })
      .request(request)
      .status(StatusCodes.OK)
      .res(response);
  }

  async update ({ request, response, params }) {
    const data = await Transaksi.findOrFail(params.id);
    await data.merge(request.all());
    await data.save();

    return this.payload({
      message: "Data berhasil diperbarui",
    })
      .request(request)
      .status(StatusCodes.OK)
      .res(response);
  }

  async revoke ({ request, response, params }) {
    const date = Time.currentTime();
    const data = await Transaksi.findOrFail(params.id);
    if ((data.status !== 'quotation') && (data.status !== 'waiting_confirmation')) {
      return this.payload({
        message: 'Tidak dapat membatalkan transaksi yang sudah dikonfirmasi'
      }).request(request)
        .status(StatusCodes.NOT_ACCEPTABLE)
        .res(response)
    } else {
      const trx = await Database.beginTransaction();
      try {
        const pembayaran = await trx.from('transaksi_pembayaran').where('transaksi', params.id);
        if(pembayaran.length > 0) {
          for (let index = 0; index < pembayaran.length; index++) {
            await trx.from('transaksi_pembayaran').where('id', pembayaran[index].id).update({
              is_refund: true,
              updated_at: date
            })
          }
        }

        await trx.from('transaksi').where('id', params.id).update({
          status: 'revoke',
          updated_at: date
        })
        await trx.commit();
        return this.payload({
          message: "Transaksi telah dibatalkan",
        })
          .request(request)
          .status(StatusCodes.OK)
          .res(response);
      } catch(err) {
        Logger.error('Refund error', err)
        await trx.rollback();
        return this.payload({
          message: err.message
        }).request(request)
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .res(response)        
      }
    }
  }
}

module.exports = TransaksiController;
